'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'
import { getSessionUserId } from '@/lib/session'

// ─── AUTH ──────────────────────────────────────────────────────────────────

export async function loginAction(formData: FormData) {
  const loginType = formData.get('loginType') as string

  if (loginType === 'email') {
    const email = (formData.get('email') as string)?.trim().toLowerCase()
    const password = (formData.get('password') as string)?.trim()
    if (!email || !password) redirect('/?error=1')
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) redirect('/?error=1')
    if (user.status === 'pending') redirect('/?error=4')
    if (user.password !== password) redirect('/?error=2')
    cookies().set('userId', user.id.toString(), { httpOnly: true, maxAge: 60 * 60 * 24 * 30, path: '/', sameSite: 'lax' })
    redirect('/dashboard')
  }

  // Code-based login (admins + legacy users)
  const code = (formData.get('code') as string)?.trim().toUpperCase()
  const password = (formData.get('password') as string)?.trim()
  if (!code) redirect('/?mode=code&error=1')
  const user = await prisma.user.findUnique({ where: { code } })
  if (!user) redirect('/?mode=code&error=1')
  if (user.isAdmin) {
    // Admin: no password required
  } else if (!user.password) {
    if (!password || password.length < 3) redirect('/?mode=code&error=3')
    await prisma.user.update({ where: { id: user.id }, data: { password } })
  } else {
    if (!password || password !== user.password) redirect('/?mode=code&error=2')
  }
  cookies().set('userId', user.id.toString(), { httpOnly: true, maxAge: 60 * 60 * 24 * 30, path: '/', sameSite: 'lax' })
  redirect('/dashboard')
}

export async function registerAction(formData: FormData) {
  const name = (formData.get('name') as string)?.trim()
  const email = (formData.get('email') as string)?.trim().toLowerCase()
  const password = (formData.get('password') as string)?.trim()
  if (!name || !email || !password) redirect('/register?error=1')
  if (password.length < 3) redirect('/register?error=2')
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) redirect('/register?error=3')
  const prefix = name.substring(0, 4).toUpperCase().replace(/[^A-Z0-9]/g, 'X').padEnd(3, 'X')
  const suffix = Math.random().toString(36).substring(2, 6).toUpperCase()
  await prisma.user.create({ data: { name, email, password, code: `${prefix}${suffix}`, status: 'pending' } })
  redirect('/register?success=1')
}

export async function logoutAction() {
  cookies().delete('userId')
  redirect('/')
}

// ─── PREDICTIONS ───────────────────────────────────────────────────────────

export async function savePredictionAction(formData: FormData) {
  const userId = getSessionUserId()
  if (!userId) redirect('/')

  const matchId = parseInt(formData.get('matchId') as string)
  const winner = formData.get('winner') as string
  const scorer = (formData.get('scorer') as string)?.trim() || null
  const scoreHomeRaw = formData.get('scoreHome') as string
  const scoreAwayRaw = formData.get('scoreAway') as string
  const scoreHome = scoreHomeRaw !== '' && scoreHomeRaw != null ? parseInt(scoreHomeRaw) : null
  const scoreAway = scoreAwayRaw !== '' && scoreAwayRaw != null ? parseInt(scoreAwayRaw) : null
  const round = (formData.get('round') as string)?.trim() || null

  if (!winner) redirect('/dashboard')

  const match = await prisma.match.findUnique({ where: { id: matchId } })
  if (!match || new Date(match.kickoff) <= new Date()) redirect('/dashboard')

  await prisma.prediction.upsert({
    where: { userId_matchId: { userId, matchId } },
    update: { winner, scorer, scoreHome, scoreAway },
    create: { userId, matchId, winner, scorer, scoreHome, scoreAway },
  })

  redirect(round ? `/dashboard?round=${round}` : '/dashboard')
}

// ─── ADMIN: MATCHES ────────────────────────────────────────────────────────

async function requireAdmin() {
  const userId = getSessionUserId()
  if (!userId) redirect('/')
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user?.isAdmin) redirect('/')
}

export async function addMatchAction(formData: FormData) {
  await requireAdmin()
  const teamHome = (formData.get('teamHome') as string).trim()
  const teamAway = (formData.get('teamAway') as string).trim()
  const phase = (formData.get('phase') as string).trim()
  const group = (formData.get('group') as string)?.trim() || null
  const kickoff = new Date(formData.get('kickoff') as string)
  await prisma.match.create({ data: { teamHome, teamAway, phase, group, kickoff } })
  redirect('/admin?tab=mecze')
}

export async function updateMatchAction(formData: FormData) {
  await requireAdmin()
  const matchId = parseInt(formData.get('matchId') as string)
  const teamHome = (formData.get('teamHome') as string).trim()
  const teamAway = (formData.get('teamAway') as string).trim()
  const phase = (formData.get('phase') as string).trim()
  const group = (formData.get('group') as string)?.trim() || null
  const kickoff = new Date(formData.get('kickoff') as string)
  await prisma.match.update({ where: { id: matchId }, data: { teamHome, teamAway, phase, group, kickoff } })
  redirect('/admin?tab=mecze')
}

export async function deleteMatchAction(formData: FormData) {
  await requireAdmin()
  const matchId = parseInt(formData.get('matchId') as string)
  await prisma.prediction.deleteMany({ where: { matchId } })
  await prisma.match.delete({ where: { id: matchId } })
  redirect('/admin')
}

// ─── ADMIN: RESULTS ────────────────────────────────────────────────────────

function calcPoints(
  prediction: { winner: string; scorer: string | null; scoreHome: number | null; scoreAway: number | null },
  match: { scoreHome: number; scoreAway: number; scorers: string | null }
): number {
  let pts = 0
  const actual = match.scoreHome > match.scoreAway ? 'home' : match.scoreHome < match.scoreAway ? 'away' : 'draw'
  if (prediction.winner === actual) pts += 1

  if (prediction.scorer && match.scorers) {
    if (prediction.scorer.toLowerCase().trim() === match.scorers.toLowerCase().trim()) pts += 1
  }

  if (prediction.scoreHome !== null && prediction.scoreAway !== null &&
      prediction.scoreHome === match.scoreHome && prediction.scoreAway === match.scoreAway) {
    pts += 2
  }
  return pts
}

export async function enterResultsAction(formData: FormData) {
  await requireAdmin()

  const matchId = parseInt(formData.get('matchId') as string)
  const scoreHome = parseInt(formData.get('scoreHome') as string)
  const scoreAway = parseInt(formData.get('scoreAway') as string)
  const scorers = (formData.get('scorers') as string)?.trim() || null

  await prisma.match.update({ where: { id: matchId }, data: { scoreHome, scoreAway, scorers, status: 'finished' } })

  const predictions = await prisma.prediction.findMany({ where: { matchId } })
  for (const pred of predictions) {
    const pts = calcPoints(pred, { scoreHome, scoreAway, scorers })
    await prisma.prediction.update({ where: { id: pred.id }, data: { points: pts } })
  }

  redirect('/admin?tab=mecze')
}

// ─── ADMIN: USERS ──────────────────────────────────────────────────────────

export async function createUserAction(formData: FormData) {
  await requireAdmin()
  const name = (formData.get('name') as string).trim()
  if (!name) redirect('/admin?tab=kody')
  const prefix = name.substring(0, 4).toUpperCase().replace(/[^A-Z0-9]/g, 'X').padEnd(3, 'X')
  const suffix = Math.random().toString(36).substring(2, 6).toUpperCase()
  await prisma.user.create({ data: { name, code: `${prefix}${suffix}` } })
  redirect('/admin?tab=kody')
}

export async function deleteUserAction(formData: FormData) {
  await requireAdmin()
  const targetId = parseInt(formData.get('targetId') as string)
  await prisma.prediction.deleteMany({ where: { userId: targetId } })
  await prisma.specialBet.deleteMany({ where: { userId: targetId } })
  await prisma.user.delete({ where: { id: targetId } })
  redirect('/admin?tab=kody')
}

export async function activateUserAction(formData: FormData) {
  await requireAdmin()
  const targetId = parseInt(formData.get('targetId') as string)
  await prisma.user.update({ where: { id: targetId }, data: { status: 'active' } })
  redirect('/admin?tab=konta')
}

export async function rejectUserAction(formData: FormData) {
  await requireAdmin()
  const targetId = parseInt(formData.get('targetId') as string)
  await prisma.prediction.deleteMany({ where: { userId: targetId } })
  await prisma.specialBet.deleteMany({ where: { userId: targetId } })
  await prisma.user.delete({ where: { id: targetId } })
  redirect('/admin?tab=konta')
}

// ─── PROFILE / AVATAR ──────────────────────────────────────────────────────

export async function updateAvatarAction(formData: FormData) {
  const userId = getSessionUserId()
  if (!userId) redirect('/')

  const file = formData.get('avatar') as File
  if (!file || file.size === 0) redirect('/profile?error=1')

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const base64 = `data:${file.type};base64,${buffer.toString('base64')}`

  const { v2: cloudinary } = await import('cloudinary')
  const result = await cloudinary.uploader.upload(base64, {
    folder: 'wc2026-avatars',
    width: 200,
    height: 200,
    crop: 'fill',
    gravity: 'face',
  })

  await prisma.user.update({ where: { id: userId }, data: { avatarUrl: result.secure_url } })
  redirect('/profile')
}

// ─── ADMIN: PATCH NOTES ────────────────────────────────────────────────────

export async function sendPatchNotesAction() {
  await requireAdmin()
  const userId = getSessionUserId()!
  await prisma.message.deleteMany({ where: { userId } })
  revalidatePath('/chat')
  redirect('/chat')
}

// ─── CHAT ──────────────────────────────────────────────────────────────────

export async function sendMessageAction(formData: FormData) {
  const userId = getSessionUserId()
  if (!userId) redirect('/')
  const content = (formData.get('content') as string)?.trim()
  if (!content || content.length > 500) return
  await prisma.message.create({ data: { userId, content } })
  revalidatePath('/chat')
  redirect('/chat')
}

// ─── SPECIAL BETS ──────────────────────────────────────────────────────────

const SPECIAL_DEADLINE = new Date('2026-06-11T19:00:00Z') // 21:00 CEST

export async function saveSpecialBetAction(formData: FormData) {
  const userId = getSessionUserId()
  if (!userId) redirect('/')
  if (new Date() >= SPECIAL_DEADLINE) redirect('/special')

  const type = formData.get('type') as string
  const value = (formData.get('value') as string)?.trim()
  if (!type || !value) redirect('/special')

  await prisma.specialBet.upsert({
    where: { userId_type: { userId, type } },
    update: { value },
    create: { userId, type, value },
  })
  redirect('/special')
}

// ─── ADMIN: SPECIAL RESULTS ────────────────────────────────────────────────

const SPECIAL_POINTS: Record<string, number> = {
  winner: 25, topScorer: 20, mostAssists: 10, goalkeeper: 5,
  continent: 5, youngPlayer: 5, mostGoals: 5, messiVsRonaldo: 5,
}

export async function saveSpecialResultAction(formData: FormData) {
  await requireAdmin()

  const type = formData.get('type') as string
  const value = (formData.get('value') as string)?.trim()
  if (!type || !value) redirect('/admin?tab=specjalne')

  await prisma.specialResult.upsert({
    where: { type },
    update: { value },
    create: { type, value },
  })

  const pts = SPECIAL_POINTS[type] ?? 0
  await prisma.specialBet.updateMany({ where: { type }, data: { points: 0 } })
  await prisma.specialBet.updateMany({
    where: { type, value },
    data: { points: pts },
  })

  redirect('/admin?tab=specjalne')
}
