import { redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/session'
import { prisma } from '@/lib/db'
import NavBar from '@/components/NavBar'
import ChatClient from '@/components/ChatClient'

export default async function ChatPage() {
  const user = await getSessionUser()
  if (!user) redirect('/')

  const rawMessages = await prisma.message.findMany({
    orderBy: { createdAt: 'asc' },
    take: 200,
    include: { user: { select: { id: true, name: true } } },
  })
  const messages = rawMessages.map((m) => ({ ...m, createdAt: m.createdAt.toISOString() }))

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar userName={user.name} isAdmin={user.isAdmin} activeTab="chat" avatarUrl={user.avatarUrl ?? undefined} />
      <div className="flex-1 max-w-3xl w-full mx-auto px-4 py-4 flex flex-col" style={{ height: 'calc(100vh - 56px)' }}>
        <ChatClient initialMessages={messages} currentUserId={user.id} />
      </div>
    </div>
  )
}
