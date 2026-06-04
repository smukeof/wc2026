import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSessionUserId } from '@/lib/session'

export async function GET() {
  const userId = getSessionUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const messages = await prisma.message.findMany({
    orderBy: { createdAt: 'asc' },
    take: 200,
    include: { user: { select: { id: true, name: true } } },
  })
  return NextResponse.json(messages)
}

export async function POST(req: Request) {
  const userId = getSessionUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const content = (body.content as string)?.trim()
  if (!content || content.length > 500) return NextResponse.json({ error: 'Invalid' }, { status: 400 })

  const message = await prisma.message.create({
    data: { userId, content },
    include: { user: { select: { id: true, name: true } } },
  })
  return NextResponse.json(message)
}
