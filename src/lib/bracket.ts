// Drabinka: po zakończeniu meczu przenosi zwycięzcę (i ewentualnie
// przegranego — dla meczu o 3. miejsce) do wskazanych meczów w kolejnej fazie.
//
// Match ma pola:
//   nextMatchId + nextMatchSlot ('home'|'away')   — dla zwycięzcy
//   loserMatchId + loserMatchSlot ('home'|'away') — dla przegranego (SF → Mecz o 3.)
//
// Wypełnia teamHome/teamAway w meczu docelowym (bezpiecznie — nadpisuje tylko gdy
// slot był 'TBD' lub gdy team się zmienił). Zwraca info do logowania.

import type { PrismaClient } from '@prisma/client'

type MatchLite = {
  id: number
  teamHome: string
  teamAway: string
  scoreHome: number | null
  scoreAway: number | null
  advanced: string | null
  nextMatchId: number | null
  nextMatchSlot: string | null
  loserMatchId: number | null
  loserMatchSlot: string | null
}

function pickTeam(m: MatchLite, side: 'winner' | 'loser'): string | null {
  const winnerSide = m.advanced === 'home' ? 'home'
    : m.advanced === 'away' ? 'away'
    : m.scoreHome != null && m.scoreAway != null
      ? (m.scoreHome > m.scoreAway ? 'home' : m.scoreHome < m.scoreAway ? 'away' : null)
      : null
  if (!winnerSide) return null
  const loserSide = winnerSide === 'home' ? 'away' : 'home'
  const pickSide = side === 'winner' ? winnerSide : loserSide
  return pickSide === 'home' ? m.teamHome : m.teamAway
}

export async function propagateBracket(prisma: PrismaClient, matchId: number) {
  const m = await prisma.match.findUnique({ where: { id: matchId } }) as MatchLite | null
  if (!m) return

  const updates: { targetId: number; slot: string; team: string }[] = []
  if (m.nextMatchId && m.nextMatchSlot) {
    const winner = pickTeam(m, 'winner')
    if (winner) updates.push({ targetId: m.nextMatchId, slot: m.nextMatchSlot, team: winner })
  }
  if (m.loserMatchId && m.loserMatchSlot) {
    const loser = pickTeam(m, 'loser')
    if (loser) updates.push({ targetId: m.loserMatchId, slot: m.loserMatchSlot, team: loser })
  }

  for (const u of updates) {
    const target = await prisma.match.findUnique({ where: { id: u.targetId } })
    if (!target) continue
    const field = u.slot === 'home' ? 'teamHome' : 'teamAway'
    if (target[field] === u.team) continue
    await prisma.match.update({ where: { id: u.targetId }, data: { [field]: u.team } })
  }
}
