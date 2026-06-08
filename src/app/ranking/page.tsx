import { redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/session'
import { prisma } from '@/lib/db'
import NavBar from '@/components/NavBar'
import RankingSelect from '@/components/RankingSelect'

const CATEGORIES = [
  { key: 'all',     label: 'Ogólny' },
  { key: 'K1',      label: 'Kolejka 1',    phase: 'Kolejka 1' },
  { key: 'K2',      label: 'Kolejka 2',    phase: 'Kolejka 2' },
  { key: 'K3',      label: 'Kolejka 3',    phase: 'Kolejka 3' },
  { key: 'R16',     label: '1/16 finału',  phase: '1/16 finału' },
  { key: 'R8',      label: '1/8 finału',   phase: '1/8 finału' },
  { key: 'QF',      label: 'Ćwierćfinały', phase: 'Ćwierćfinały' },
  { key: 'SF',      label: 'Półfinały',    phase: 'Półfinały' },
  { key: 'F',       label: 'Finał',        phase: 'Finał' },
  { key: 'special', label: '⭐ Specjalne' },
]

const PODIUM = [
  { border: 'rgba(201,162,39,0.40)', text: '#c9a227' },
  { border: 'rgba(192,192,192,0.30)', text: 'rgba(255,255,255,0.65)' },
  { border: 'rgba(180,100,30,0.35)', text: '#cd7f32' },
]

export default async function RankingPage({ searchParams }: { searchParams: { round?: string } }) {
  const user = await getSessionUser()
  if (!user) redirect('/')

  const activeKey = searchParams.round ?? 'all'

  const finishedPhases = await prisma.match.groupBy({ by: ['phase'], where: { status: 'finished' } })
  const finishedSet = new Set(finishedPhases.map((p) => p.phase))

  const availableCategories = CATEGORIES.filter((c) => {
    if (c.key === 'all' || c.key === 'special') return true
    return c.phase && finishedSet.has(c.phase)
  })

  const activeCategory = availableCategories.find((c) => c.key === activeKey) ?? availableCategories[0]

  const users = await prisma.user.findMany({
    where: { isAdmin: false },
    include: { predictions: { include: { match: true } }, specialBets: true },
  })

  const ranked = users.map((u) => {
    let pts = 0, typed = 0
    if (activeKey === 'all') {
      pts = u.predictions.reduce((s, p) => s + p.points, 0) + u.specialBets.reduce((s, b) => s + b.points, 0)
      typed = u.predictions.length
    } else if (activeKey === 'special') {
      pts = u.specialBets.reduce((s, b) => s + b.points, 0)
      typed = u.specialBets.filter((b) => b.value !== '').length
    } else {
      const preds = u.predictions.filter((p) => p.match.phase === activeCategory.phase)
      pts = preds.reduce((s, p) => s + p.points, 0)
      typed = preds.length
    }
    return { id: u.id, name: u.name, avatarUrl: u.avatarUrl, points: pts, typed }
  }).sort((a, b) => b.points - a.points || b.typed - a.typed)

  return (
    <div className="min-h-screen">
      <NavBar userName={user.name} isAdmin={user.isAdmin} activeTab="ranking" avatarUrl={user.avatarUrl ?? undefined} />
      <div className="max-w-3xl mx-auto px-4 py-6">

        <div className="flex items-center gap-3 mb-5">
          <h1 className="text-xl font-black text-white">Ranking</h1>
          <span className="text-2xl">🏆</span>
        </div>

        <RankingSelect categories={availableCategories} activeKey={activeKey} />

        {ranked.length === 0 ? (
          <div className="text-center py-16" style={{ color: 'rgba(255,255,255,0.25)' }}>
            <div className="text-4xl mb-2">🏆</div><p>Brak uczestników</p>
          </div>
        ) : (
          <div className="card rounded-2xl overflow-hidden shadow-2xl border" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
            {ranked.map((u, i) => {
              const pod = i < 3 ? PODIUM[i] : null
              const isMe = u.id === user.id
              return (
                <div key={u.id}
                  className={`flex items-center gap-4 px-4 py-3.5 ${i < ranked.length - 1 ? 'border-b' : ''}`}
                  style={{
                    borderColor: 'rgba(255,255,255,0.05)',
                    backgroundColor: pod
                      ? i === 0 ? 'rgba(201,162,39,0.06)' : i === 1 ? 'rgba(192,192,192,0.04)' : 'rgba(180,100,30,0.05)'
                      : isMe ? 'rgba(201,162,39,0.05)' : undefined,
                    borderLeft: `3px solid ${pod ? pod.border : isMe ? 'rgba(201,162,39,0.25)' : 'transparent'}`,
                  }}>
                  <span className="w-8 text-center font-black text-xl shrink-0">
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : (
                      <span className="text-sm font-black" style={{ color: 'rgba(255,255,255,0.3)' }}>{i + 1}.</span>
                    )}
                  </span>
                  {u.avatarUrl ? (
                    <img src={u.avatarUrl} alt={u.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                  ) : (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0"
                      style={{ background: 'rgba(201,162,39,0.15)', color: '#c9a227', border: '1px solid rgba(201,162,39,0.20)' }}>
                      {u.name[0]?.toUpperCase()}
                    </div>
                  )}
                  <span className="flex-1 font-bold min-w-0 truncate" style={{ color: '#f0eef5' }}>
                    {u.name}
                    {isMe && (
                      <span className="ml-2 text-xs font-black px-1.5 py-0.5 rounded-full"
                        style={{ background: 'rgba(201,162,39,0.15)', color: '#c9a227' }}>(ty)</span>
                    )}
                  </span>
                  <span className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>{u.typed} typów</span>
                  <span className="font-black text-xl w-16 text-right" style={{ color: pod?.text ?? (isMe ? '#c9a227' : '#f0eef5') }}>
                    {u.points} <span className="text-sm font-bold">pkt</span>
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
