import { redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/session'
import { prisma } from '@/lib/db'
import NavBar from '@/components/NavBar'
import { saveSpecialBetAction } from '@/app/actions'

const SPECIAL_DEADLINE = new Date('2026-06-11T19:00:00Z')

const TEAMS = [
  'Meksyk','RPA','Korea Południowa','Czechy',
  'Kanada','Bośnia i Hercegowina','Katar','Szwajcaria',
  'Brazylia','Maroko','Haiti','Szkocja',
  'USA','Paragwaj','Australia','Turcja',
  'Niemcy','Curaçao','Wybrzeże Kości Słoniowej','Ekwador',
  'Holandia','Japonia','Szwecja','Tunezja',
  'Belgia','Egipt','Iran','Nowa Zelandia',
  'Hiszpania','Wyspy Zielonego Przylądka','Arabia Saudyjska','Urugwaj',
  'Francja','Senegal','Irak','Norwegia',
  'Argentyna','Algieria','Austria','Jordania',
  'Portugalia','DR Kongo','Uzbekistan','Kolumbia',
  'Anglia','Chorwacja','Ghana','Panama',
]

const YOUNG_PLAYERS = [
  'Lamine Yamal','Désiré Doué','Warren Zaïre-Emery','Lennart Karl',
  "Nico O'Reilly",'Arda Güler','Endrick','Pau Cubarsí',
  'Antonio Nusa','Yan Diomande','Kenan Yıldız','Lucas Bergvall',
  'Rayan Vitor','Kobbie Mainoo','Ibrahim Maza','Esmir Bajraktarević',
  'Ibrahim Mbaye','Kerim Alajbegović','Semih Kılıçsoy','Jorrel Hato',
  'Kendry Páez','Chemsdine Talbi','Luka Vušković','Mamadou Sarr',
  'Joaquin Seys','Nestory Irankunda','Khalil Ayari','Christ Oulai',
  'Assane Diao','Johan Manzambi','Paul Wanner','Samir El Mourabet',
  'Jeremy Arévalo','Yassir Zabiri','Ben Doak','Caleb Yirenki',
  'Rayane Bounida','Yassine Gessime',
]

const CONTINENTS = [
  'Europa','Ameryka Południowa','Ameryka Północna i Środkowa','Afryka','Azja','Australia i Oceania',
]

const BETS = [
  { type: 'winner',        label: 'Zwycięzca turnieju',                  pts: 25, icon: '🏆', mode: 'team',       color: '#C8102E' },
  { type: 'topScorer',     label: 'Król strzelców',                      pts: 20, icon: '⚽', mode: 'player',     color: '#F4600C' },
  { type: 'mostAssists',   label: 'Najwięcej asyst',                     pts: 10, icon: '🎯', mode: 'player',     color: '#FFD700' },
  { type: 'goalkeeper',    label: 'Bramkarz turnieju',                   pts:  5, icon: '🧤', mode: 'goalkeeper', color: '#7DBB2D' },
  { type: 'continent',     label: 'Zwycięski kontynent',                 pts:  5, icon: '🌍', mode: 'continent',  color: '#0033A0' },
  { type: 'youngPlayer',   label: 'Najlepszy młody zawodnik',            pts:  5, icon: '🌟', mode: 'youngPlayer',color: '#6B3FA0' },
  { type: 'mostGoals',     label: 'Drużyna z największą liczbą goli',    pts:  5, icon: '🔥', mode: 'team',       color: '#C8102E' },
  { type: 'messiVsRonaldo',label: 'Messi vs Ronaldo – więcej bramek',    pts:  5, icon: '🆚', mode: 'messi',      color: '#F4600C' },
] as const

const GK_KEYS = ['Hornicek','Stanek','Kovar','Rangel','Ochoa','Acevedo','Williams','Goss','Chaine','Hyeon-woo','Seung-gyu','Bum-keun','Vasilj','Zlomislić','Hadzikić','St Clair','Crépeau','Goodman','Abunada','Barsham','Zakaria','Keller','Kobel','Mvogo','Alisson','Ederson','Weverton','Placide','Pierre','Duverger','Bounou','El Kajoui','Tagnaouti','Gordon','Gunn','Kelly','Beach','Izzo','Ryan','Gill','Fernández','Olveira','Bayındır','Günok','Çakır','Brady','Freese','Turner','Bodak','Doornbusch','Room','Valle','Galíndez','Ramírez','Baumann','Neuer','Nubel','Fofana','Koné','Lafont','Hayakawa','Osako','Suzuki','Flekken','Roefs','Verbruggen','Nordfeldt','Johansson','Zetterstrom','Dahmen','Ben Hassine','Chamakh','Courtois','Penders','Lammens','El Shenawy','Shobeir','Soliman','Alaa','Beiranvand','Hosseini','Niazmand','Crocombe','Paulsen','Woud','Vozinha','Rosa','dos Santos','Al-Kassar','Al-Owais','Al-Aqidi','Simón','Raya','García','Rochet','Muslera','Mele','Maignan','Risser','Samba','Talib','Hassan','Fadhil','Selvik','Nyland','Tangvik','Mendy','Diouf','Diaw','Zidane','Benbout','Mastil','Ramdane','Martínez','Rulli','Musso','Schlager','Wiegele','Pentz','Abulaila','Al-Fakhouri','Bani Attiah','Vargas','Montero','Ospina','Mpasi-Nzau','Fayulu','Epolo','Costa','Silva','Sá','Velho','Yusupov','Ergashev','Nematov','Livaković','Kotarski','Pandur','Pickford','Henderson','Trafford','Anang','Asare','Ati-Zigi','Mejia','Mosquera','Samudio']

const inp = 'w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-brand-500'
const inpStyle = { backgroundColor: '#f5edf0', borderColor: '#e0c8d0', color: '#1a0007' }

export default async function SpecialPage() {
  const user = await getSessionUser()
  if (!user) redirect('/')

  const isOpen = new Date() < SPECIAL_DEADLINE
  const msLeft = SPECIAL_DEADLINE.getTime() - Date.now()
  const daysLeft = Math.floor(msLeft / 1000 / 60 / 60 / 24)
  const hoursLeft = Math.floor((msLeft / 1000 / 60 / 60) % 24)

  const [myBets, players, results] = await Promise.all([
    prisma.specialBet.findMany({ where: { userId: user.id } }),
    prisma.player.findMany({ orderBy: [{ team: 'asc' }, { name: 'asc' }] }),
    prisma.specialResult.findMany(),
  ])

  const betMap = new Map(myBets.map((b) => [b.type, b]))
  const resultMap = new Map(results.map((r) => [r.type, r.value]))
  const goalkeepers = players.filter((p) => GK_KEYS.some((k) => p.name.includes(k)))

  return (
    <div className="min-h-screen">
      <NavBar userName={user.name} isAdmin={user.isAdmin} activeTab="dashboard" avatarUrl={user.avatarUrl ?? undefined} />
      <div className="max-w-3xl mx-auto px-4 py-6">

        {/* Sub-tabs */}
        <div className="flex gap-2 mb-5">
          <a href="/dashboard" className="px-5 py-2 rounded-xl text-sm font-black card text-zinc-600 border border-zinc-200">Typy</a>
          <a href="/dashboard?view=tabela" className="px-5 py-2 rounded-xl text-sm font-black card text-zinc-600 border border-zinc-200">📊 Moja tabela</a>
          <a href="/special" className="px-5 py-2 rounded-xl text-sm font-black text-white shadow-md"
            style={{ background: 'linear-gradient(135deg, #C8102E 0%, #F4600C 100%)' }}>⭐ Specjalne</a>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-black text-white">⭐ Typy specjalne</h1>
          </div>
          {isOpen ? (
            <p className="text-sm text-white/40 mt-1">
              Zamknięcie za{' '}
              <span className="font-black" style={{ color: '#F4600C' }}>
                {daysLeft > 0 ? `${daysLeft} dni i ${hoursLeft} h` : `${hoursLeft} h`}
              </span>
            </p>
          ) : (
            <p className="text-sm mt-1 font-bold" style={{ color: '#C8102E' }}>🔒 Typowanie zamknięte — mundial się rozpoczął</p>
          )}
        </div>

        <datalist id="all-players">{players.map((p) => <option key={`${p.team}-${p.name}`} value={p.name} />)}</datalist>
        <datalist id="goalkeepers">{goalkeepers.map((p) => <option key={`${p.team}-${p.name}`} value={p.name} />)}</datalist>

        <div className="space-y-4">
          {BETS.map((bet) => {
            const current = betMap.get(bet.type)
            const correct = resultMap.get(bet.type)
            const isCorrect = correct && current?.value?.toLowerCase() === correct.toLowerCase()

            return (
              <div key={bet.type} className="card rounded-2xl overflow-hidden shadow-lg border border-zinc-200/60"
                style={{ borderTop: `3px solid ${bet.color}` }}>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-base font-black text-zinc-900">{bet.icon} {bet.label}</span>
                      {correct && (
                        <p className="text-xs mt-0.5 text-zinc-500">
                          Prawidłowa: <span className="font-bold text-zinc-700">{correct}</span>
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {isCorrect && <span className="text-xs font-black text-green-600">+{bet.pts} pkt ✓</span>}
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-black text-white"
                        style={{ backgroundColor: isCorrect ? '#16a34a' : bet.color }}>
                        {bet.pts} pkt
                      </span>
                    </div>
                  </div>

                  {current && (
                    <div className={`mb-3 px-3 py-2 rounded-lg text-sm border font-medium ${
                      isCorrect
                        ? 'bg-green-50 border-green-200 text-green-800'
                        : 'bg-zinc-50 border-zinc-200 text-zinc-700'
                    }`}>
                      Twój typ: <span className="font-black">{current.value}</span>
                    </div>
                  )}

                  {isOpen && (
                    <form action={saveSpecialBetAction}>
                      <input type="hidden" name="type" value={bet.type} />

                      {bet.mode === 'team' && (
                        <select name="value" defaultValue={current?.value ?? ''} required className={inp} style={inpStyle}>
                          <option value="">— wybierz drużynę —</option>
                          {TEAMS.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                      )}
                      {bet.mode === 'player' && (
                        <input type="text" name="value" list="all-players" defaultValue={current?.value ?? ''}
                          placeholder="Zacznij pisać nazwisko…" autoComplete="off" required className={inp} style={inpStyle} />
                      )}
                      {bet.mode === 'goalkeeper' && (
                        <input type="text" name="value" list="goalkeepers" defaultValue={current?.value ?? ''}
                          placeholder="Zacznij pisać nazwisko bramkarza…" autoComplete="off" required className={inp} style={inpStyle} />
                      )}
                      {bet.mode === 'continent' && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {CONTINENTS.map((c) => (
                            <label key={c} className="cursor-pointer">
                              <input type="radio" name="value" value={c} defaultChecked={current?.value === c} className="sr-only peer" required />
                              <span className="block text-center text-xs py-2 px-1 rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-700 peer-checked:border-brand-500 peer-checked:bg-brand-500 peer-checked:text-white transition-all font-bold">{c}</span>
                            </label>
                          ))}
                        </div>
                      )}
                      {bet.mode === 'youngPlayer' && (
                        <select name="value" defaultValue={current?.value ?? ''} required className={inp} style={inpStyle}>
                          <option value="">— wybierz zawodnika —</option>
                          {YOUNG_PLAYERS.map((p) => <option key={p} value={p}>{p}</option>)}
                        </select>
                      )}
                      {bet.mode === 'messi' && (
                        <div className="grid grid-cols-3 gap-2">
                          {['Lionel Messi','Cristiano Ronaldo','Remis'].map((o) => (
                            <label key={o} className="cursor-pointer">
                              <input type="radio" name="value" value={o} defaultChecked={current?.value === o} className="sr-only peer" required />
                              <span className="block text-center text-xs py-2 px-1 rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-700 peer-checked:border-brand-500 peer-checked:bg-brand-500 peer-checked:text-white transition-all font-black">{o}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      <button type="submit"
                        className="mt-3 w-full py-2 text-white font-black rounded-xl transition-all text-sm shadow-md active:scale-95"
                        style={{ background: `linear-gradient(135deg, ${bet.color} 0%, #F4600C 100%)` }}>
                        {current ? '✏️ Zaktualizuj' : '✅ Zapisz typ'}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
