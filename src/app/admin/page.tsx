import { redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/session'
import { prisma } from '@/lib/db'
import NavBar from '@/components/NavBar'
import { addMatchAction, deleteMatchAction, enterResultsAction, createUserAction, deleteUserAction, saveSpecialResultAction, activateUserAction, rejectUserAction } from '@/app/actions'

const PHASES = ['Kolejka 1','Kolejka 2','Kolejka 3','1/16 finału','1/8 finału','Ćwierćfinały','Półfinały','Mecz o 3. miejsce','Finał']
const TEAMS = ['Meksyk','RPA','Korea Południowa','Czechy','Kanada','Bośnia i Hercegowina','Katar','Szwajcaria','Brazylia','Maroko','Haiti','Szkocja','USA','Paragwaj','Australia','Turcja','Niemcy','Curaçao','Wybrzeże Kości Słoniowej','Ekwador','Holandia','Japonia','Szwecja','Tunezja','Belgia','Egipt','Iran','Nowa Zelandia','Hiszpania','Wyspy Zielonego Przylądka','Arabia Saudyjska','Urugwaj','Francja','Senegal','Irak','Norwegia','Argentyna','Algieria','Austria','Jordania','Portugalia','DR Kongo','Uzbekistan','Kolumbia','Anglia','Chorwacja','Ghana','Panama']
const YOUNG_PLAYERS = ['Lamine Yamal','Désiré Doué','Warren Zaïre-Emery','Lennart Karl',"Nico O'Reilly",'Arda Güler','Endrick','Pau Cubarsí','Antonio Nusa','Yan Diomande','Kenan Yıldız','Lucas Bergvall','Rayan Vitor','Kobbie Mainoo','Ibrahim Maza','Esmir Bajraktarević','Ibrahim Mbaye','Kerim Alajbegović','Semih Kılıçsoy','Jorrel Hato','Kendry Páez','Chemsdine Talbi','Luka Vušković','Mamadou Sarr','Joaquin Seys','Nestory Irankunda','Khalil Ayari','Christ Oulai','Assane Diao','Johan Manzambi','Paul Wanner','Samir El Mourabet','Jeremy Arévalo','Yassir Zabiri','Ben Doak','Caleb Yirenki','Rayane Bounida','Yassine Gessime']
const CONTINENTS = ['Europa','Ameryka Południowa','Ameryka Północna i Środkowa','Afryka','Azja','Australia i Oceania']
const SPECIAL_BETS = [
  { type: 'winner',         label: 'Zwycięzca turnieju',               pts: 25, icon: '🏆' },
  { type: 'topScorer',      label: 'Król strzelców',                   pts: 20, icon: '⚽' },
  { type: 'mostAssists',    label: 'Najwięcej asyst',                  pts: 10, icon: '🎯' },
  { type: 'goalkeeper',     label: 'Bramkarz turnieju',                pts:  5, icon: '🧤' },
  { type: 'continent',      label: 'Zwycięski kontynent',              pts:  5, icon: '🌍' },
  { type: 'youngPlayer',    label: 'Najlepszy młody zawodnik',         pts:  5, icon: '🌟' },
  { type: 'mostGoals',      label: 'Drużyna z największą liczbą goli', pts:  5, icon: '🔥' },
  { type: 'messiVsRonaldo', label: 'Messi vs Ronaldo – więcej bramek', pts:  5, icon: '🆚' },
]

function fmt(d: Date) {
  return new Date(d).toLocaleString('pl-PL', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
}

const inp = 'w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-brand-500'
const inpStyle = { backgroundColor: '#f5edf0', borderColor: '#e0c8d0', color: '#1a0007' }
const btnCls = 'px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-bold rounded-lg transition-colors shadow-sm'
const dangerBtnCls = 'px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-600 text-xs font-semibold rounded-lg transition-colors'

export default async function AdminPage({ searchParams }: { searchParams: { tab?: string } }) {
  const user = await getSessionUser()
  if (!user || !user.isAdmin) redirect('/')

  const tab = searchParams.tab ?? 'mecze'
  const now = new Date()

  const [matches, users, players, specialResults, pendingUsers] = await Promise.all([
    prisma.match.findMany({ orderBy: { kickoff: 'asc' }, include: { _count: { select: { predictions: true } } } }),
    prisma.user.findMany({ where: { status: 'active' }, orderBy: { id: 'asc' }, include: { _count: { select: { predictions: true } }, specialBets: true } }),
    prisma.player.findMany({ orderBy: [{ team: 'asc' }, { name: 'asc' }] }),
    prisma.specialResult.findMany(),
    prisma.user.findMany({ where: { status: 'pending' }, orderBy: { createdAt: 'desc' } }),
  ])

  const pastMatches = matches.filter((m) => new Date(m.kickoff) <= now)
  const pendingCount = pastMatches.filter((m) => m.status !== 'finished').length
  const resultMap = new Map(specialResults.map((r) => [r.type, r.value]))

  const TABS = [
    { key: 'mecze',    label: 'Mecze' },
    { key: 'kody',     label: 'Kody' },
    { key: 'wyniki',   label: `Wyniki${pendingCount > 0 ? ` (${pendingCount})` : ''}` },
    { key: 'specjalne',label: 'Specjalne' },
    { key: 'konta',    label: `Konta${pendingUsers.length > 0 ? ` (${pendingUsers.length})` : ''}` },
  ]

  return (
    <div className="min-h-screen">
      <NavBar userName={user.name} isAdmin={user.isAdmin} activeTab="admin" avatarUrl={user.avatarUrl ?? undefined} />
      <div className="max-w-3xl mx-auto px-4 py-6">
        <h1 className="text-xl font-black text-white mb-6">Panel admina</h1>

        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-none">
          {TABS.map(({ key, label }) => (
            <a key={key} href={`/admin?tab=${key}`}
              className={`flex-shrink-0 px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                tab === key ? 'bg-brand-500 text-white shadow-sm' : 'card text-zinc-600 border border-zinc-200'
              }`}>
              {label}
            </a>
          ))}
        </div>

        {/* ── MECZE ── */}
        {tab === 'mecze' && (
          <div className="space-y-5">
            <div className="card rounded-2xl p-5 border border-zinc-200/60 shadow-lg">
              <h2 className="font-bold text-zinc-900 mb-4">Dodaj mecz</h2>
              <form action={addMatchAction} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input name="teamHome" required placeholder="Gospodarz" className={inp} style={inpStyle} />
                  <input name="teamAway" required placeholder="Gość" className={inp} style={inpStyle} />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <select name="phase" required className={inp} style={inpStyle}>
                    {PHASES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <input name="group" placeholder="Grupa (np. A)" className={inp} style={inpStyle} />
                  <input name="kickoff" type="datetime-local" required className={inp} style={inpStyle} />
                </div>
                <button type="submit" className={btnCls}>+ Dodaj mecz</button>
              </form>
            </div>
            <div className="card rounded-2xl border border-zinc-200/60 overflow-hidden shadow-lg">
              {matches.length === 0 ? <p className="text-center py-8 text-zinc-400">Brak meczów</p> : matches.map((m, i) => (
                <div key={m.id} className={`flex items-center gap-3 px-4 py-3 ${i < matches.length - 1 ? 'border-b border-zinc-200/60' : ''}`}>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-zinc-900 truncate">{m.teamHome} vs {m.teamAway}</p>
                    <p className="text-xs text-zinc-500">{m.phase}{m.group ? ` · Gr.${m.group}` : ''} · {fmt(m.kickoff)} · {m._count.predictions} typów</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${m.status === 'finished' ? 'bg-green-100 text-green-700' : 'bg-brand-100 text-brand-700'}`}>
                    {m.status === 'finished' ? `${m.scoreHome}–${m.scoreAway}` : 'otwarty'}
                  </span>
                  <form action={deleteMatchAction}><input type="hidden" name="matchId" value={m.id} /><button type="submit" className={dangerBtnCls}>Usuń</button></form>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── KODY ── */}
        {tab === 'kody' && (
          <div className="space-y-5">
            <div className="card rounded-2xl p-5 border border-zinc-200/60 shadow-lg">
              <h2 className="font-bold text-zinc-900 mb-4">Nowy użytkownik</h2>
              <form action={createUserAction} className="flex gap-3">
                <input name="name" required placeholder="Imię / nick" className={`${inp} flex-1`} style={inpStyle} />
                <button type="submit" className={btnCls}>Generuj kod</button>
              </form>
            </div>
            <div className="card rounded-2xl border border-zinc-200/60 overflow-hidden shadow-lg">
              {users.map((u, i) => (
                <div key={u.id} className={`flex items-center gap-3 px-4 py-3 ${i < users.length - 1 ? 'border-b border-zinc-200/60' : ''}`}>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-zinc-900">{u.name}{u.isAdmin && <span className="text-xs text-brand-500 ml-1">(admin)</span>}</p>
                    <p className="text-xs text-zinc-500">{u._count.predictions} typowań · {u.specialBets.length} specjalnych</p>
                  </div>
                  <code className="text-sm font-mono px-3 py-1.5 rounded-lg select-all tracking-wider" style={{ backgroundColor: '#f5edf0', color: '#7a3040' }}>{u.code}</code>
                  {!u.isAdmin && (
                    <form action={deleteUserAction}><input type="hidden" name="targetId" value={u.id} /><button type="submit" className={dangerBtnCls}>Usuń</button></form>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── WYNIKI ── */}
        {tab === 'wyniki' && (
          <div className="space-y-4">
            {pastMatches.length === 0 ? (
              <div className="text-center py-16 text-white/30"><div className="text-4xl mb-2">✅</div><p>Brak zakończonych meczów</p></div>
            ) : pastMatches.map((m) => (
              <div key={m.id} className={`card rounded-2xl p-5 border shadow-lg ${m.status === 'finished' ? 'border-green-200' : 'border-zinc-200/60'}`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-bold text-zinc-900">{m.teamHome} vs {m.teamAway}</p>
                    <p className="text-xs text-zinc-500">{m.phase}{m.group ? ` · Gr.${m.group}` : ''} · {fmt(m.kickoff)} · {m._count.predictions} typowań</p>
                  </div>
                  {m.status === 'finished' && (
                    <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-lg">{m.scoreHome}–{m.scoreAway} ✓</span>
                  )}
                </div>
                <form action={enterResultsAction} className="space-y-3">
                  <input type="hidden" name="matchId" value={m.id} />
                  <div>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-1.5">Wynik</p>
                    <div className="flex items-center gap-3">
                      <input type="number" name="scoreHome" min={0} max={30} required placeholder={m.teamHome} className={`${inp} w-24`} style={inpStyle} />
                      <span className="text-zinc-400 font-bold">–</span>
                      <input type="number" name="scoreAway" min={0} max={30} required placeholder={m.teamAway} className={`${inp} w-24`} style={inpStyle} />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-1.5">Strzelec pierwszej bramki</p>
                    <input type="text" name="scorers" list="all-players-admin"
                      placeholder='Nazwisko, "Brak gola" lub "Gol samobójczy"' className={inp} style={inpStyle} />
                    <datalist id="all-players-admin">{players.map((p) => <option key={`${p.team}-${p.name}`} value={p.name} />)}</datalist>
                    <div className="flex gap-2 mt-1.5">
                      {['Brak gola','Gol samobójczy'].map((s) => (
                        <span key={s} className="text-xs px-2 py-0.5 rounded text-zinc-500" style={{ backgroundColor: '#f5edf0' }}>{s}</span>
                      ))}
                    </div>
                  </div>
                  <button type="submit" className={btnCls}>Zapisz wynik i przelicz punkty ({m._count.predictions})</button>
                </form>
              </div>
            ))}
          </div>
        )}

        {/* ── KONTA ── */}
        {tab === 'konta' && (
          <div className="space-y-4">
            {pendingUsers.length === 0 ? (
              <div className="text-center py-16 text-white/30">
                <div className="text-4xl mb-2">✅</div>
                <p>Brak kont oczekujących na aktywację</p>
              </div>
            ) : (
              <>
                <div className="rounded-xl p-4 text-sm font-medium border" style={{ backgroundColor: 'rgba(200,16,46,0.1)', borderColor: 'rgba(200,16,46,0.3)', color: '#ffb3bb' }}>
                  <strong>{pendingUsers.length} {pendingUsers.length === 1 ? 'konto czeka' : 'kont czeka'}</strong> na aktywację.
                </div>
                <div className="card rounded-2xl border border-zinc-200/60 overflow-hidden shadow-lg">
                  {pendingUsers.map((u, i) => (
                    <div key={u.id} className={`flex items-center gap-3 px-4 py-3 ${i < pendingUsers.length - 1 ? 'border-b border-zinc-200/60' : ''}`}>
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-zinc-900">{u.name}</p>
                        <p className="text-xs text-zinc-500">{u.email ?? '—'}</p>
                      </div>
                      <form action={activateUserAction}>
                        <input type="hidden" name="targetId" value={u.id} />
                        <button type="submit" className="px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 text-xs font-semibold rounded-lg transition-colors">
                          Aktywuj
                        </button>
                      </form>
                      <form action={rejectUserAction}>
                        <input type="hidden" name="targetId" value={u.id} />
                        <button type="submit" className={dangerBtnCls}>Odrzuć</button>
                      </form>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── SPECJALNE ── */}
        {tab === 'specjalne' && (
          <div className="space-y-4">
            <div className="rounded-xl p-4 text-sm font-medium border" style={{ backgroundColor: 'rgba(200,16,46,0.1)', borderColor: 'rgba(200,16,46,0.3)', color: '#ffb3bb' }}>
              <strong>Panel odpowiedzi.</strong> Wpisz poprawne odpowiedzi — system automatycznie przeliczy punkty.
            </div>
            <datalist id="all-players-special">{players.map((p) => <option key={`${p.team}-${p.name}`} value={p.name} />)}</datalist>
            {SPECIAL_BETS.map((bet) => {
              const current = resultMap.get(bet.type)
              return (
                <div key={bet.type} className="card rounded-2xl p-5 border border-zinc-200/60 shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-zinc-900">{bet.icon} {bet.label}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 font-bold">{bet.pts} pkt</span>
                  </div>
                  {current && (
                    <div className="mb-3 px-3 py-2 rounded-lg bg-green-50 border border-green-200 text-sm text-green-800">
                      Zapisana: <strong>{current}</strong>
                    </div>
                  )}
                  <form action={saveSpecialResultAction} className="flex gap-3">
                    <input type="hidden" name="type" value={bet.type} />
                    {['winner','mostGoals'].includes(bet.type) && (
                      <select name="value" defaultValue={current ?? ''} required className={`${inp} flex-1`} style={inpStyle}>
                        <option value="">— wybierz drużynę —</option>
                        {TEAMS.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    )}
                    {['topScorer','mostAssists','goalkeeper'].includes(bet.type) && (
                      <input type="text" name="value" list="all-players-special" defaultValue={current ?? ''} placeholder="Nazwisko zawodnika" autoComplete="off" required className={`${inp} flex-1`} style={inpStyle} />
                    )}
                    {bet.type === 'continent' && (
                      <select name="value" defaultValue={current ?? ''} required className={`${inp} flex-1`} style={inpStyle}>
                        <option value="">— wybierz kontynent —</option>
                        {CONTINENTS.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    )}
                    {bet.type === 'youngPlayer' && (
                      <select name="value" defaultValue={current ?? ''} required className={`${inp} flex-1`} style={inpStyle}>
                        <option value="">— wybierz zawodnika —</option>
                        {YOUNG_PLAYERS.map((p) => <option key={p} value={p}>{p}</option>)}
                      </select>
                    )}
                    {bet.type === 'messiVsRonaldo' && (
                      <select name="value" defaultValue={current ?? ''} required className={`${inp} flex-1`} style={inpStyle}>
                        <option value="">— wybierz —</option>
                        {['Lionel Messi','Cristiano Ronaldo','Remis'].map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    )}
                    <button type="submit" className={btnCls}>Zapisz i przelicz</button>
                  </form>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
