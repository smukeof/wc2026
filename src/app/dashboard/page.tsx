import { redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/session'
import { prisma } from '@/lib/db'
import NavBar from '@/components/NavBar'
import MatchCard from '@/components/MatchCard'
import RoundSelect from '@/components/RoundSelect'

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

const GROUP_PHASES = ['Kolejka 1', 'Kolejka 2', 'Kolejka 3']

const GROUP_COLORS: Record<string, string> = {
  A: '#C8102E', B: '#F4600C', C: '#c9a227', D: '#7DBB2D',
  E: '#0033A0', F: '#6B3FA0', G: '#C8102E', H: '#F4600C',
  I: '#7DBB2D', J: '#0033A0', K: '#6B3FA0', L: '#c9a227',
}

const tabCls = (active: boolean) =>
  `px-5 py-2 rounded-xl text-sm font-black transition-all ${active ? 'font-black' : 'border'}`

type SimMatch = {
  id: number; teamHome: string; teamAway: string; group: string | null
  phase: string; kickoff: Date; status: string
  scoreHome: number | null; scoreAway: number | null
  isPredicted: boolean; hasNoScore: boolean
}
type SimStat = {
  name: string; played: number; won: number; drawn: number
  lost: number; gf: number; ga: number; gd: number; pts: number
}

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

function calcSimStandings(simMatches: SimMatch[]): SimStat[] {
  const stats = new Map<string, SimStat>()
  for (const m of simMatches) {
    if (m.teamHome !== 'TBD' && !stats.has(m.teamHome))
      stats.set(m.teamHome, { name: m.teamHome, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, pts: 0 })
    if (m.teamAway !== 'TBD' && !stats.has(m.teamAway))
      stats.set(m.teamAway, { name: m.teamAway, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, pts: 0 })
  }
  for (const m of simMatches) {
    if (m.hasNoScore || m.scoreHome === null || m.scoreAway === null) continue
    const h = stats.get(m.teamHome)
    const a = stats.get(m.teamAway)
    if (!h || !a) continue
    h.played++; a.played++
    h.gf += m.scoreHome; h.ga += m.scoreAway; h.gd = h.gf - h.ga
    a.gf += m.scoreAway; a.ga += m.scoreHome; a.gd = a.gf - a.ga
    if (m.scoreHome > m.scoreAway) { h.won++; h.pts += 3; a.lost++ }
    else if (m.scoreHome < m.scoreAway) { a.won++; a.pts += 3; h.lost++ }
    else { h.drawn++; h.pts++; a.drawn++; a.pts++ }
  }
  return Array.from(stats.values()).sort(
    (a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf || a.name.localeCompare(b.name)
  )
}

export type OtherPrediction = {
  userId: number
  userName: string
  avatarUrl: string | null
  winner: string
  scoreHome: number | null
  scoreAway: number | null
  scorer: string | null
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { round?: string; filter?: string; view?: string }
}) {
  const user = await getSessionUser()
  if (!user) redirect('/')

  const now = new Date()
  const view = searchParams.view === 'tabela' ? 'tabela' : 'typy'

  const [allPhases, userPredictions, players, allGroupMatches] = await Promise.all([
    prisma.match.groupBy({ by: ['phase'] }),
    prisma.prediction.findMany({ where: { userId: user.id }, include: { match: true } }),
    prisma.player.findMany({ orderBy: [{ team: 'asc' }, { name: 'asc' }] }),
    prisma.match.findMany({
      where: { phase: { in: GROUP_PHASES } },
      orderBy: { kickoff: 'asc' },
    }),
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

  // Typy innych użytkowników dla tej kolejki
  const allRoundPreds = roundMatches.length > 0
    ? await prisma.prediction.findMany({
        where: { matchId: { in: roundMatches.map((m) => m.id) } },
        include: { user: { select: { id: true, name: true, avatarUrl: true } } },
        orderBy: { user: { name: 'asc' } },
      })
    : []

  const othersMap = new Map<number, OtherPrediction[]>()
  for (const pred of allRoundPreds) {
    if (pred.userId === user.id) continue
    if (!othersMap.has(pred.matchId)) othersMap.set(pred.matchId, [])
    othersMap.get(pred.matchId)!.push({
      userId: pred.userId,
      userName: pred.user.name,
      avatarUrl: pred.user.avatarUrl,
      winner: pred.winner,
      scoreHome: pred.scoreHome,
      scoreAway: pred.scoreAway,
      scorer: pred.scorer,
    })
  }

  const predMap = new Map(userPredictions.map((p) => [p.matchId, p]))
  const totalPoints = userPredictions.reduce((sum, p) => sum + p.points, 0)
  const filterUnbet = searchParams.filter === 'unbet'

  // Simulated standings data
  const simMatches: SimMatch[] = allGroupMatches.map((m) => {
    const pred = predMap.get(m.id)
    if (m.status === 'finished') return { ...m, isPredicted: false, hasNoScore: false }
    if (pred && pred.scoreHome !== null && pred.scoreAway !== null)
      return { ...m, scoreHome: pred.scoreHome, scoreAway: pred.scoreAway, isPredicted: true, hasNoScore: false }
    return { ...m, isPredicted: false, hasNoScore: true }
  })
  const simGroups = Array.from(new Set(
    allGroupMatches.map((m) => m.group).filter((g): g is string => Boolean(g))
  )).sort()

  return (
    <div className="min-h-screen">
      <NavBar userName={user.name} isAdmin={user.isAdmin} activeTab="dashboard" avatarUrl={user.avatarUrl ?? undefined} />
      <div className="max-w-3xl mx-auto px-4 py-6">

        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-white">Cześć, {user.name}! 👋</h1>
            <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Twoje punkty:{' '}
              <span className="font-black text-base" style={{ color: '#c9a227' }}>{totalPoints} pkt</span>
            </p>
          </div>
          <div className="text-3xl opacity-40">⚽</div>
        </div>

        {/* Sub-tabs */}
        <div className="flex gap-2 mb-5">
          <a href="/dashboard"
            className={tabCls(view === 'typy')}
            style={view === 'typy'
              ? { background: 'rgba(201,162,39,0.12)', color: '#c9a227', border: '1px solid rgba(201,162,39,0.25)' }
              : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.55)', borderColor: 'rgba(255,255,255,0.08)' }
            }>
            Typy
          </a>
          <a href="/dashboard?view=tabela"
            className={tabCls(view === 'tabela')}
            style={view === 'tabela'
              ? { background: 'rgba(201,162,39,0.12)', color: '#c9a227', border: '1px solid rgba(201,162,39,0.25)' }
              : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.55)', borderColor: 'rgba(255,255,255,0.08)' }
            }>
            📊 Moja tabela
          </a>
          <a href="/special"
            className={tabCls(false)}
            style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.55)', borderColor: 'rgba(255,255,255,0.08)' }}>
            ⭐ Specjalne
          </a>
        </div>

        {/* ── MOJA TABELA ── */}
        {view === 'tabela' && (
          <div>
            <p className="text-xs mb-5" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Symulacja na podstawie Twoich typów + rozegranych meczów.
            </p>
            {simGroups.length === 0 && (
              <div className="text-center py-16" style={{ color: 'rgba(255,255,255,0.25)' }}>
                <div className="text-4xl mb-2">📋</div><p>Brak meczów grupowych</p>
              </div>
            )}
            <div className="space-y-5">
              {simGroups.map((group) => {
                const gMatches = simMatches.filter((m) => m.group === group)
                const standings = calcSimStandings(gMatches)
                const color = GROUP_COLORS[group] ?? '#c9a227'
                const actualCount = gMatches.filter((m) => m.status === 'finished').length
                const predictedCount = gMatches.filter((m) => m.isPredicted).length
                return (
                  <div key={group} className="card rounded-2xl border overflow-hidden shadow-lg">
                    <div className="flex items-center gap-3 px-4 py-2.5 border-b"
                      style={{ borderLeft: `4px solid ${color}`, borderBottomColor: 'rgba(255,255,255,0.06)' }}>
                      <span className="font-black text-sm" style={{ color }}>Grupa {group}</span>
                      <span className="text-xs ml-auto" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        {actualCount > 0 && <span>{actualCount} rozegr.</span>}
                        {actualCount > 0 && predictedCount > 0 && <span className="mx-1">·</span>}
                        {predictedCount > 0 && <span style={{ color: '#c9a227' }}>{predictedCount} typów</span>}
                        {actualCount === 0 && predictedCount === 0 && <span>brak danych</span>}
                      </span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                            {['#','Drużyna','M','W','R','P','Br','+/-','Pkt'].map((h, i) => (
                              <th key={h} className={`py-2 font-semibold ${i < 2 ? (i===0?'pl-4 pr-2 text-left':'px-2 text-left') : 'px-2 text-center'}`}
                                style={{ color: 'rgba(255,255,255,0.4)' }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {standings.map((s, i) => (
                            <tr key={s.name}
                              className={i < standings.length - 1 ? 'border-b' : ''}
                              style={{
                                borderColor: 'rgba(255,255,255,0.04)',
                                backgroundColor: i < 2 ? `${color}10` : undefined,
                              }}>
                              <td className="pl-4 pr-2 py-2.5">
                                <div className="flex items-center gap-1.5">
                                  <div className="w-1.5 h-4 rounded-full"
                                    style={{ backgroundColor: i < 2 ? color : 'rgba(255,255,255,0.12)' }} />
                                  <span style={{ color: 'rgba(255,255,255,0.4)' }} className="font-semibold">{i+1}</span>
                                </div>
                              </td>
                              <td className="px-2 py-2.5">
                                <span className="font-semibold" style={{ color: i < 2 ? '#f0eef5' : 'rgba(255,255,255,0.65)' }}>
                                  {flag(s.name)} {s.name}
                                </span>
                              </td>
                              <td className="text-center px-2 py-2.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{s.played}</td>
                              <td className="text-center px-2 py-2.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{s.won}</td>
                              <td className="text-center px-2 py-2.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{s.drawn}</td>
                              <td className="text-center px-2 py-2.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{s.lost}</td>
                              <td className="text-center px-2 py-2.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{s.gf}:{s.ga}</td>
                              <td className="text-center px-2 py-2.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
                                {s.gd > 0 ? `+${s.gd}` : s.gd}
                              </td>
                              <td className="text-center px-3 py-2.5 font-black" style={{ color: '#f0eef5' }}>{s.pts}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="border-t px-4 py-3 space-y-1.5" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                      {gMatches.map((m) => (
                        <div key={m.id} className="flex items-center justify-between text-xs">
                          <span className="w-28 truncate text-right font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
                            {flag(m.teamHome)} {m.teamHome}
                          </span>
                          <span className="mx-3 w-20 text-center">
                            {m.hasNoScore
                              ? <span style={{ color: 'rgba(255,255,255,0.2)' }}>? – ?</span>
                              : m.isPredicted
                                ? <span className="font-black" style={{ color: '#c9a227' }}>{m.scoreHome} – {m.scoreAway}</span>
                                : <span className="font-black" style={{ color: '#f0eef5' }}>{m.scoreHome} – {m.scoreAway}</span>
                            }
                          </span>
                          <span className="w-28 truncate font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
                            {m.teamAway} {flag(m.teamAway)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
            {simGroups.length > 0 && (
              <div className="flex gap-4 mt-4 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                <span><span className="font-black" style={{ color: '#f0eef5' }}>2–1</span> rozegrany</span>
                <span><span className="font-black" style={{ color: '#c9a227' }}>2–1</span> Twój typ</span>
                <span><span style={{ color: 'rgba(255,255,255,0.2)' }}>?–?</span> nie obstawiony</span>
              </div>
            )}
          </div>
        )}

        {/* ── TYPY ── */}
        {view === 'typy' && (
          <>
            {availableRounds.length > 0 && (
              <RoundSelect
                rounds={availableRounds}
                activeKey={activeRound?.key ?? availableRounds[0]?.key}
                filterUnbet={filterUnbet}
              />
            )}

            {/* Filtr */}
            <div className="flex gap-2 mb-5">
              <a href={`/dashboard?round=${activeRound?.key ?? 'K1'}${filterUnbet ? '' : '&filter=unbet'}`}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold transition-all"
                style={filterUnbet
                  ? { background: 'rgba(201,162,39,0.15)', color: '#c9a227', border: '1px solid rgba(201,162,39,0.30)' }
                  : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }
                }>
                {filterUnbet ? '✕' : '🎯'} Do obstawienia
              </a>
            </div>

            <div className="space-y-3">
              {roundMatches.length === 0 && (
                <div className="text-center py-16" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  <div className="text-4xl mb-2">📋</div><p>Brak meczów</p>
                </div>
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
                              style={{ backgroundColor: GROUP_COLORS[group] ?? '#c9a227' }} />
                            <h3 className="text-xs font-black uppercase tracking-widest"
                              style={{ color: GROUP_COLORS[group] ?? '#c9a227' }}>
                              Grupa {group}
                            </h3>
                            <div className="flex-1 h-px" style={{ backgroundColor: `${GROUP_COLORS[group] ?? '#c9a227'}25` }} />
                          </div>
                          <div className="space-y-3">
                            {displayMatches.map((match) => (
                              <MatchCard key={match.id} match={match}
                                prediction={predMap.get(match.id) ?? null}
                                matchPlayers={players.filter((p) => p.team === match.teamHome || p.team === match.teamAway).map((p) => p.name)}
                                isOpen={new Date(match.kickoff) > now}
                                round={activeRound?.key}
                                otherPredictions={othersMap.get(match.id) ?? []} />
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
                      <MatchCard key={match.id} match={match}
                        prediction={predMap.get(match.id) ?? null}
                        matchPlayers={players.filter((p) => p.team === match.teamHome || p.team === match.teamAway).map((p) => p.name)}
                        isOpen={new Date(match.kickoff) > now}
                        round={activeRound?.key}
                        otherPredictions={othersMap.get(match.id) ?? []} />
                    ))
                  })()
              }
              {filterUnbet && roundMatches.every((m) => new Date(m.kickoff) <= now || predMap.has(m.id)) && (
                <div className="text-center py-12" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  <div className="text-4xl mb-2">✅</div>
                  <p className="font-bold">Wszystko obstawione w tej kolejce!</p>
                </div>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  )
}
