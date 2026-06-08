import { redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/session'
import { prisma } from '@/lib/db'
import NavBar from '@/components/NavBar'

const KNOCKOUT_PHASES = ['1/16 finału','1/8 finału','Ćwierćfinały','Półfinały','Mecz o 3. miejsce','Finał']
const GROUP_PHASES = ['Kolejka 1','Kolejka 2','Kolejka 3']

const GROUP_COLORS: Record<string, string> = {
  A: '#C8102E', B: '#F4600C', C: '#FFD700', D: '#7DBB2D',
  E: '#0033A0', F: '#6B3FA0', G: '#C8102E', H: '#F4600C',
  I: '#7DBB2D', J: '#0033A0', K: '#6B3FA0', L: '#C8102E',
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
  if (!team || team === 'TBD') return '❓'
  return FLAGS[team.toLowerCase().split(' ')[0]] ?? '🏳️'
}

function fmt(d: Date) {
  return new Intl.DateTimeFormat('pl-PL', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  }).format(new Date(d))
}

type Match = {
  id: number; teamHome: string; teamAway: string; kickoff: Date
  phase: string; group: string | null; status: string
  scoreHome: number | null; scoreAway: number | null
}

type Stat = {
  name: string; played: number; won: number; drawn: number
  lost: number; gf: number; ga: number; gd: number; pts: number
}

function calcStandings(groupMatches: Match[]): Stat[] {
  const stats = new Map<string, Stat>()

  for (const m of groupMatches) {
    if (m.teamHome !== 'TBD' && !stats.has(m.teamHome))
      stats.set(m.teamHome, { name: m.teamHome, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, pts: 0 })
    if (m.teamAway !== 'TBD' && !stats.has(m.teamAway))
      stats.set(m.teamAway, { name: m.teamAway, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, pts: 0 })
  }

  for (const m of groupMatches) {
    if (m.status !== 'finished' || m.scoreHome === null || m.scoreAway === null) continue
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

const tabCls = (active: boolean) =>
  `px-5 py-2 rounded-xl text-sm font-black transition-all ${active ? 'text-white shadow-md' : 'card text-zinc-600 border border-zinc-200'}`

export default async function DrabinaPage({ searchParams }: { searchParams: { view?: string } }) {
  const user = await getSessionUser()
  if (!user) redirect('/')

  const view = searchParams.view === 'puchar' ? 'puchar' : 'grupy'

  const matches: Match[] = await prisma.match.findMany({ orderBy: { kickoff: 'asc' } })

  const groupMatches = matches.filter((m) => GROUP_PHASES.includes(m.phase))
  const groups = Array.from(new Set(
    groupMatches.map((m) => m.group).filter((g): g is string => Boolean(g))
  )).sort()

  const knockoutMatches = matches.filter((m) => KNOCKOUT_PHASES.includes(m.phase))

  return (
    <div className="min-h-screen">
      <NavBar userName={user.name} isAdmin={user.isAdmin} activeTab="drabinka" avatarUrl={user.avatarUrl ?? undefined} />
      <div className="max-w-3xl mx-auto px-4 py-6">

        <h1 className="text-xl font-black text-white mb-5">🏆 Drabinka</h1>

        <div className="flex gap-2 mb-6">
          <a href="/drabinka" className={tabCls(view === 'grupy')}
            style={view === 'grupy' ? { background: 'linear-gradient(135deg, #C8102E 0%, #F4600C 100%)' } : undefined}>
            Grupy
          </a>
          <a href="/drabinka?view=puchar" className={tabCls(view === 'puchar')}
            style={view === 'puchar' ? { background: 'linear-gradient(135deg, #C8102E 0%, #F4600C 100%)' } : undefined}>
            Faza pucharowa
          </a>
        </div>

        {/* ── GRUPY ── */}
        {view === 'grupy' && (
          <div className="space-y-5">
            {groups.length === 0 && (
              <div className="text-center py-16 text-white/30">
                <div className="text-4xl mb-2">📋</div>
                <p>Brak meczów grupowych</p>
              </div>
            )}
            {groups.map((group) => {
              const gMatches = groupMatches.filter((m) => m.group === group)
              const standings = calcStandings(gMatches)
              const color = GROUP_COLORS[group] ?? '#C8102E'
              const totalRounds = GROUP_PHASES.length
              const teamsCount = standings.length

              return (
                <div key={group} className="card rounded-2xl border border-zinc-200/60 overflow-hidden shadow-lg">
                  {/* Group header */}
                  <div className="flex items-center gap-3 px-4 py-2.5 border-b border-zinc-200/60"
                    style={{ borderLeft: `4px solid ${color}` }}>
                    <span className="font-black text-sm" style={{ color }}>Grupa {group}</span>
                    <span className="text-xs text-zinc-400 ml-auto">
                      {gMatches.filter((m) => m.status === 'finished').length} / {gMatches.length} meczów
                    </span>
                  </div>

                  {/* Standings table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-zinc-400 border-b border-zinc-100/60">
                          <th className="text-left pl-4 pr-2 py-2 font-semibold">#</th>
                          <th className="text-left px-2 py-2 font-semibold">Drużyna</th>
                          <th className="text-center px-2 py-2 font-semibold w-8">M</th>
                          <th className="text-center px-2 py-2 font-semibold w-8">W</th>
                          <th className="text-center px-2 py-2 font-semibold w-8">R</th>
                          <th className="text-center px-2 py-2 font-semibold w-8">P</th>
                          <th className="text-center px-2 py-2 font-semibold w-12">Br</th>
                          <th className="text-center px-2 py-2 font-semibold w-10">+/-</th>
                          <th className="text-center px-3 py-2 font-bold text-zinc-700 w-10">Pkt</th>
                        </tr>
                      </thead>
                      <tbody>
                        {standings.map((s, i) => {
                          const qualifies = i < 2
                          const isLast = i === standings.length - 1
                          return (
                            <tr key={s.name}
                              className={`${!isLast ? 'border-b border-zinc-100/40' : ''} ${qualifies ? '' : ''}`}
                              style={qualifies ? { backgroundColor: `${color}08` } : undefined}>
                              <td className="pl-4 pr-2 py-2.5">
                                <div className="flex items-center gap-1.5">
                                  {qualifies
                                    ? <div className="w-1.5 h-4 rounded-full" style={{ backgroundColor: color }} />
                                    : <div className="w-1.5 h-4 rounded-full bg-zinc-200" />
                                  }
                                  <span className="text-zinc-400 font-semibold">{i + 1}</span>
                                </div>
                              </td>
                              <td className="px-2 py-2.5">
                                <span className={`font-semibold ${qualifies ? 'text-zinc-900' : 'text-zinc-600'}`}>
                                  {flag(s.name)} {s.name}
                                </span>
                              </td>
                              <td className="text-center px-2 py-2.5 text-zinc-500">{s.played}</td>
                              <td className="text-center px-2 py-2.5 text-zinc-500">{s.won}</td>
                              <td className="text-center px-2 py-2.5 text-zinc-500">{s.drawn}</td>
                              <td className="text-center px-2 py-2.5 text-zinc-500">{s.lost}</td>
                              <td className="text-center px-2 py-2.5 text-zinc-500">{s.gf}:{s.ga}</td>
                              <td className="text-center px-2 py-2.5 text-zinc-500">
                                {s.gd > 0 ? `+${s.gd}` : s.gd}
                              </td>
                              <td className="text-center px-3 py-2.5 font-black text-zinc-900">{s.pts}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Separator + matches */}
                  <div className="border-t border-zinc-100/60 px-4 py-3 space-y-1.5">
                    {gMatches.map((m) => (
                      <div key={m.id} className="flex items-center justify-between text-xs text-zinc-500">
                        <span className="w-28 truncate text-right font-medium text-zinc-700">{flag(m.teamHome)} {m.teamHome}</span>
                        <span className="mx-3 font-black text-zinc-900 w-16 text-center">
                          {m.status === 'finished'
                            ? `${m.scoreHome} – ${m.scoreAway}`
                            : <span className="text-zinc-400">{fmt(m.kickoff)}</span>
                          }
                        </span>
                        <span className="w-28 truncate font-medium text-zinc-700">{m.teamAway} {flag(m.teamAway)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ── FAZA PUCHAROWA ── */}
        {view === 'puchar' && (
          <div className="space-y-8">
            {KNOCKOUT_PHASES.every((p) => !knockoutMatches.some((m) => m.phase === p)) && (
              <div className="text-center py-16 text-white/30">
                <div className="text-4xl mb-2">🏆</div>
                <p>Faza pucharowa jeszcze się nie zaczęła</p>
              </div>
            )}
            {KNOCKOUT_PHASES.map((phase) => {
              const phaseMatches = knockoutMatches.filter((m) => m.phase === phase)
              if (phaseMatches.length === 0) return null
              return (
                <div key={phase}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#F4600C' }}>{phase}</span>
                    <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(244,96,12,0.2)' }} />
                  </div>
                  <div className="space-y-3">
                    {phaseMatches.map((m) => (
                      <div key={m.id} className={`card rounded-2xl p-4 border shadow-lg ${m.status === 'finished' ? 'border-green-200' : 'border-zinc-200/60'}`}>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 text-right">
                            <span className={`font-bold text-sm ${m.teamHome === 'TBD' ? 'text-zinc-400 italic' : 'text-zinc-900'}`}>
                              {m.teamHome === 'TBD' ? 'TBD' : <>{flag(m.teamHome)} {m.teamHome}</>}
                            </span>
                          </div>
                          <div className="w-24 text-center flex-shrink-0">
                            {m.status === 'finished'
                              ? <span className="font-black text-lg text-zinc-900">{m.scoreHome} – {m.scoreAway}</span>
                              : <span className="text-xs text-zinc-400 font-semibold leading-tight block">{fmt(m.kickoff)}</span>
                            }
                          </div>
                          <div className="flex-1 text-left">
                            <span className={`font-bold text-sm ${m.teamAway === 'TBD' ? 'text-zinc-400 italic' : 'text-zinc-900'}`}>
                              {m.teamAway === 'TBD' ? 'TBD' : <>{m.teamAway} {flag(m.teamAway)}</>}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
