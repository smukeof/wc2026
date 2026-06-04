import { redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/session'
import { prisma } from '@/lib/db'
import NavBar from '@/components/NavBar'

const ROUNDS = [
  { key: 'all', label: 'Ogólny' },
  { key: 'K1',  label: 'Kolejka 1',  phase: 'Kolejka 1' },
  { key: 'K2',  label: 'Kolejka 2',  phase: 'Kolejka 2' },
  { key: 'K3',  label: 'Kolejka 3',  phase: 'Kolejka 3' },
  { key: 'R16', label: '1/16',       phase: '1/16 finału' },
  { key: 'R8',  label: '1/8',        phase: '1/8 finału' },
  { key: 'QF',  label: 'Ćwierćfinały', phase: 'Ćwierćfinały' },
  { key: 'SF',  label: 'Półfinały',  phase: 'Półfinały' },
  { key: 'F',   label: 'Finał',      phase: 'Finał' },
]

// Kolory podium
const PODIUM = [
  { bg: 'rgba(255,215,0,0.08)',   border: 'rgba(255,215,0,0.25)',   text: '#B8860B' },  // złoto
  { bg: 'rgba(192,192,192,0.08)', border: 'rgba(192,192,192,0.25)', text: '#888' },      // srebro
  { bg: 'rgba(205,127,50,0.08)',  border: 'rgba(205,127,50,0.25)',  text: '#A0522D' },   // brąz
]

export default async function RankingPage({ searchParams }: { searchParams: { round?: string } }) {
  const user = await getSessionUser()
  if (!user) redirect('/')

  const activeKey = searchParams.round ?? 'all'
  const activeRound = ROUNDS.find((r) => r.key === activeKey) ?? ROUNDS[0]

  const finishedPhases = await prisma.match.groupBy({ by: ['phase'], where: { status: 'finished' } })
  const finishedSet = new Set(finishedPhases.map((p) => p.phase))
  const availableRounds = ROUNDS.filter((r) => r.key === 'all' || (r.phase && finishedSet.has(r.phase)))

  const users = await prisma.user.findMany({
    where: { isAdmin: false },
    include: { predictions: { include: { match: true } }, specialBets: true },
  })

  const ranked = users.map((u) => {
    let pts = 0, typed = 0
    if (activeKey === 'all') {
      pts = u.predictions.reduce((s, p) => s + p.points, 0) + u.specialBets.reduce((s, b) => s + b.points, 0)
      typed = u.predictions.length
    } else {
      const preds = u.predictions.filter((p) => p.match.phase === activeRound.phase)
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

        <div className="flex gap-2 overflow-x-auto pb-2 mb-5 -mx-4 px-4 scrollbar-none">
          {availableRounds.map((r) => (
            <a key={r.key} href={`/ranking?round=${r.key}`}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-bold transition-all border ${
                r.key === activeKey
                  ? 'text-white border-transparent shadow-sm'
                  : 'card text-zinc-600 border-zinc-200 hover:border-brand-300'
              }`}
              style={r.key === activeKey ? { background: 'linear-gradient(135deg, #C8102E 0%, #F4600C 100%)' } : undefined}>
              {r.label}
            </a>
          ))}
        </div>

        {ranked.length === 0 ? (
          <div className="text-center py-16 text-white/30"><div className="text-4xl mb-2">🏆</div><p>Brak uczestników</p></div>
        ) : (
          <div className="card rounded-2xl overflow-hidden shadow-2xl border border-zinc-200/60">
            {ranked.map((u, i) => {
              const pod = i < 3 ? PODIUM[i] : null
              const isMe = u.id === user.id
              return (
                <div key={u.id}
                  className={`flex items-center gap-4 px-4 py-3.5 ${i < ranked.length - 1 ? 'border-b border-zinc-200/60' : ''}`}
                  style={{
                    backgroundColor: pod ? pod.bg : isMe ? 'rgba(200,16,46,0.05)' : undefined,
                    borderLeft: pod ? `3px solid ${pod.border}` : isMe ? '3px solid rgba(200,16,46,0.3)' : '3px solid transparent',
                  }}>
                  <span className="w-8 text-center font-black text-xl shrink-0">
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : (
                      <span className="text-sm font-black" style={{ color: '#b89aa0' }}>{i + 1}.</span>
                    )}
                  </span>
                  {u.avatarUrl ? (
                    <img src={u.avatarUrl} alt={u.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                  ) : (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0"
                      style={{ background: 'linear-gradient(135deg,#C8102E,#F4600C)' }}>
                      {u.name[0]?.toUpperCase()}
                    </div>
                  )}
                  <span className="flex-1 font-bold text-zinc-900 min-w-0 truncate">
                    {u.name}
                    {isMe && (
                      <span className="ml-2 text-xs font-black px-1.5 py-0.5 rounded-full text-white"
                        style={{ background: 'linear-gradient(135deg,#C8102E,#F4600C)' }}>(ty)</span>
                    )}
                  </span>
                  <span className="text-sm text-zinc-400">{u.typed} typów</span>
                  <span className="font-black text-xl w-16 text-right"
                    style={{ color: pod?.text ?? (isMe ? '#C8102E' : '#1a0007') }}>
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
