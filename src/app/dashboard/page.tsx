import { redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/session'
import { prisma } from '@/lib/db'
import NavBar from '@/components/NavBar'
import MatchCard from '@/components/MatchCard'

const ROUNDS = [
  { key: 'K1',  label: 'Kolejka 1',        phase: 'Kolejka 1' },
  { key: 'K2',  label: 'Kolejka 2',        phase: 'Kolejka 2' },
  { key: 'K3',  label: 'Kolejka 3',        phase: 'Kolejka 3' },
  { key: 'R16', label: '1/16 finału',      phase: '1/16 finału' },
  { key: 'R8',  label: '1/8 finału',       phase: '1/8 finału' },
  { key: 'QF',  label: 'Ćwierćfinały',     phase: 'Ćwierćfinały' },
  { key: 'SF',  label: 'Półfinały',        phase: 'Półfinały' },
  { key: 'B3',  label: 'Mecz o 3.',        phase: 'Mecz o 3. miejsce' },
  { key: 'F',   label: 'Finał',            phase: 'Finał' },
]

const FLAGS: Record<string, string> = {
  polska: '🇵🇱', niemcy: '🇩🇪', francja: '🇫🇷', brazylia: '🇧🇷', argentyna: '🇦🇷',
  anglia: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', hiszpania: '🇪🇸', portugalia: '🇵🇹', meksyk: '🇲🇽', usa: '🇺🇸',
  kanada: '🇨🇦', holandia: '🇳🇱', belgia: '🇧🇪', chorwacja: '🇭🇷', maroko: '🇲🇦',
  senegal: '🇸🇳', japonia: '🇯🇵', korea: '🇰🇷', ghana: '🇬🇭', ekwador: '🇪🇨',
  urugwaj: '🇺🇾', kolumbia: '🇨🇴', paragwaj: '🇵🇾', tunezja: '🇹🇳', egipt: '🇪🇬',
  dania: '🇩🇰', szwajcaria: '🇨🇭', austria: '🇦🇹', turcja: '🇹🇷', szwecja: '🇸🇪',
  czechy: '🇨🇿', arabia: '🇸🇦', iran: '🇮🇷', australia: '🇦🇺', katar: '🇶🇦',
  panama: '🇵🇦', nowa: '🇳🇿', szkocja: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', haiti: '🇭🇹', irak: '🇮🇶',
  norwegia: '🇳🇴', algieria: '🇩🇿', jordania: '🇯🇴', uzbekistan: '🇺🇿',
  dr: '🇨🇩', rpa: '🇿🇦', bośnia: '🇧🇦', curaçao: '🇨🇼', wyspy: '🇨🇻', wybrzeże: '🇨🇮',
}

function flag(team: string) {
  if (team === 'TBD') return '❓'
  return FLAGS[team.toLowerCase().split(' ')[0]] ?? '🏳️'
}

function formatDate(d: Date) {
  return new Intl.DateTimeFormat('pl-PL', {
    weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  }).format(new Date(d))
}

// Kolory FIFA dla grup A–L
const GROUP_COLORS: Record<string, string> = {
  A: '#C8102E', B: '#F4600C', C: '#FFD700', D: '#7DBB2D',
  E: '#0033A0', F: '#6B3FA0', G: '#C8102E', H: '#F4600C',
  I: '#7DBB2D', J: '#0033A0', K: '#6B3FA0', L: '#C8102E',
}

const pillCls = (active: boolean) =>
  `flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-bold transition-all border ${
    active
      ? 'text-white border-transparent shadow-sm'
      : 'card text-zinc-600 border-zinc-200 hover:border-brand-300'
  }`

export default async function DashboardPage({ searchParams }: { searchParams: { round?: string; filter?: string } }) {
  const user = await getSessionUser()
  if (!user) redirect('/')

  const now = new Date()

  const [allPhases, userPredictions, players] = await Promise.all([
    prisma.match.groupBy({ by: ['phase'] }),
    prisma.prediction.findMany({ where: { userId: user.id }, include: { match: true } }),
    prisma.player.findMany({ orderBy: [{ team: 'asc' }, { name: 'asc' }] }),
  ])

  const existingPhases = new Set(allPhases.map((p) => p.phase))
  const availableRounds = ROUNDS.filter((r) => existingPhases.has(r.phase))

  let activeRound = availableRounds[0]
  if (searchParams.round) {
    const found = availableRounds.find((r) => r.key === searchParams.round)
    if (found) activeRound = found
  } else {
    const upcomingPhases = await prisma.match.groupBy({ by: ['phase'], where: { kickoff: { gt: now } } })
    const upcomingSet = new Set(upcomingPhases.map((p) => p.phase))
    const nearest = availableRounds.find((r) => upcomingSet.has(r.phase))
    if (nearest) activeRound = nearest
  }

  const roundMatches = activeRound
    ? await prisma.match.findMany({ where: { phase: activeRound.phase }, orderBy: { kickoff: 'asc' } })
    : []

  const predMap = new Map(userPredictions.map((p) => [p.matchId, p]))
  const totalPoints = userPredictions.reduce((sum, p) => sum + p.points, 0)
  const filterUnbet = searchParams.filter === 'unbet'

  const roundPills = () => (
    <div className="flex flex-wrap gap-2 mb-3">
      {availableRounds.map((r) => (
        <a key={r.key} href={`/dashboard?round=${r.key}${filterUnbet ? '&filter=unbet' : ''}`}
          className={pillCls(r.key === activeRound?.key)}
          style={r.key === activeRound?.key ? { background: 'linear-gradient(135deg, #C8102E 0%, #F4600C 100%)' } : undefined}>
          {r.label}
        </a>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen">
      <NavBar userName={user.name} isAdmin={user.isAdmin} activeTab="dashboard" avatarUrl={user.avatarUrl ?? undefined} />
      <div className="max-w-3xl mx-auto px-4 py-6">

        {/* Header z punktami */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-white">Cześć, {user.name}! 👋</h1>
            <p className="text-sm text-white/50 mt-0.5">
              Twoje punkty:{' '}
              <span className="font-black text-base" style={{
                background: 'linear-gradient(90deg, #FFD700, #F4600C)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>{totalPoints} pkt</span>
            </p>
          </div>
          <div className="text-3xl opacity-60">⚽</div>
        </div>

        {/* Sub-tabs */}
        <div className="flex gap-2 mb-5">
          <a href="/dashboard" className="px-5 py-2 rounded-xl text-sm font-black text-white shadow-md"
            style={{ background: 'linear-gradient(135deg, #C8102E 0%, #F4600C 100%)' }}>Typy</a>
          <a href="/special" className="px-5 py-2 rounded-xl text-sm font-black card text-zinc-600 border border-zinc-200">⭐ Specjalne</a>
        </div>

        {roundPills()}

        {/* Filtr */}
        <div className="flex gap-2 mb-5">
          <a href={`/dashboard?round=${activeRound?.key ?? 'K1'}${filterUnbet ? '' : '&filter=unbet'}`}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold transition-all border ${
              filterUnbet
                ? 'text-white border-transparent shadow-sm'
                : 'card text-zinc-500 border-zinc-200 hover:border-brand-300'
            }`}
            style={filterUnbet ? { background: 'linear-gradient(135deg, #C8102E 0%, #F4600C 100%)' } : undefined}>
            {filterUnbet ? '✕' : '🎯'} Do obstawienia
          </a>
        </div>

        {/* ── TYPY ── */}
        <div className="space-y-3">
            {roundMatches.length === 0 && (
              <div className="text-center py-16 text-white/40"><div className="text-4xl mb-2">📋</div><p>Brak meczów</p></div>
            )}
            <datalist id="players-list">{players.map((p) => <option key={`${p.team}-${p.name}`} value={p.name} />)}</datalist>

            {activeRound?.phase.startsWith('Kolejka')
              ? ['A','B','C','D','E','F','G','H','I','J','K','L']
                  .filter((g) => roundMatches.some((m) => m.group === g))
                  .map((group) => {
                    const groupMatches = roundMatches.filter((m) => m.group === group)
                    const displayMatches = filterUnbet
                      ? groupMatches.filter((m) => new Date(m.kickoff) > now && !predMap.has(m.id))
                      : groupMatches
                    if (displayMatches.length === 0) return null
                    return (
                      <div key={group}>
                        <div className="flex items-center gap-2 mb-2 mt-5">
                          <div className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: GROUP_COLORS[group] ?? '#C8102E' }} />
                          <h3 className="text-xs font-black uppercase tracking-widest"
                            style={{ color: GROUP_COLORS[group] ?? '#C8102E' }}>
                            Grupa {group}
                          </h3>
                          <div className="flex-1 h-px" style={{ backgroundColor: `${GROUP_COLORS[group] ?? '#C8102E'}30` }} />
                        </div>
                        <div className="space-y-3">
                          {displayMatches.map((match) => (
                            <MatchCard key={match.id} match={match} prediction={predMap.get(match.id) ?? null}
                              matchPlayers={players.filter((p) => p.team === match.teamHome || p.team === match.teamAway).map((p) => p.name)}
                              isOpen={new Date(match.kickoff) > now}
                              round={activeRound?.key} />
                          ))}
                        </div>
                      </div>
                    )
                  })
              : (() => {
                  const displayMatches = filterUnbet
                    ? roundMatches.filter((m) => new Date(m.kickoff) > now && !predMap.has(m.id))
                    : roundMatches
                  return displayMatches.map((match) => (
                    <MatchCard key={match.id} match={match} prediction={predMap.get(match.id) ?? null}
                      matchPlayers={players.filter((p) => p.team === match.teamHome || p.team === match.teamAway).map((p) => p.name)}
                      isOpen={new Date(match.kickoff) > now}
                      round={activeRound?.key} />
                  ))
                })()
            }
            {filterUnbet && roundMatches.every((m) => new Date(m.kickoff) <= now || predMap.has(m.id)) && (
              <div className="text-center py-12 text-white/40">
                <div className="text-4xl mb-2">✅</div>
                <p className="font-bold">Wszystko obstawione w tej kolejce!</p>
              </div>
            )}
          </div>
      </div>
    </div>
  )
}
