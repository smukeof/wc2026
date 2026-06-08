'use client'

import { useState } from 'react'
import { savePredictionAction } from '@/app/actions'
import type { OtherPrediction } from '@/app/dashboard/page'

const SPECIAL_SCORERS = ['Brak gola', 'Gol samobójczy']

const FLAGS: Record<string, string> = {
  polska: '🇵🇱', niemcy: '🇩🇪', francja: '🇫🇷', brazylia: '🇧🇷', argentyna: '🇦🇷',
  anglia: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', hiszpania: '🇪🇸', portugalia: '🇵🇹', meksyk: '🇲🇽', usa: '🇺🇸',
  kanada: '🇨🇦', holandia: '🇳🇱', belgia: '🇧🇪', chorwacja: '🇭🇷', maroko: '🇲🇦',
  senegal: '🇸🇳', japonia: '🇯🇵', korea: '🇰🇷', ghana: '🇬🇭', ekwador: '🇪🇨',
  urugwaj: '🇺🇾', kolumbia: '🇨🇴', paragwaj: '🇵🇾', tunezja: '🇹🇳', egipt: '🇪🇬',
  dania: '🇩🇰', szwajcaria: '🇨🇭', austria: '🇦🇹', serbia: '🇷🇸', turcja: '🇹🇷',
  szwecja: '🇸🇪', czechy: '🇨🇿', arabia: '🇸🇦', iran: '🇮🇷', australia: '🇦🇺',
  katar: '🇶🇦', panama: '🇵🇦', nowa: '🇳🇿', szkocja: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', haiti: '🇭🇹',
  irak: '🇮🇶', norwegia: '🇳🇴', algieria: '🇩🇿', jordania: '🇯🇴', uzbekistan: '🇺🇿',
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

export type MatchData = {
  id: number; teamHome: string; teamAway: string; kickoff: Date
  phase: string; group: string | null; status: string
  scoreHome: number | null; scoreAway: number | null
}

export type PredictionData = {
  winner: string; scorer: string | null
  scoreHome: number | null; scoreAway: number | null
  points?: number
} | null

const ACCENT = '#c9a227'
const inpSt = { backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)', color: '#f0eef5' }
const inpCls = 'w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-brand-500'

export default function MatchCard({
  match, prediction, matchPlayers, isOpen, round, otherPredictions = [],
}: {
  match: MatchData
  prediction: PredictionData
  matchPlayers: string[]
  isOpen: boolean
  round?: string
  otherPredictions?: OtherPrediction[]
}) {
  const initialScorer = prediction?.scorer ?? ''
  const initSpecial = SPECIAL_SCORERS.includes(initialScorer) ? initialScorer : ''
  const [scorerVal, setScorerVal] = useState(initSpecial ? '' : initialScorer)
  const [specialScorer, setSpecialScorer] = useState(initSpecial)
  const [showOthers, setShowOthers] = useState(false)

  const msLeft = new Date(match.kickoff).getTime() - Date.now()
  const hoursLeft = Math.floor(msLeft / 1000 / 60 / 60)
  const daysLeft = Math.floor(hoursLeft / 24)
  const countdown = daysLeft > 0 ? `za ${daysLeft} dni` : hoursLeft > 0 ? `za ${hoursLeft} h` : null
  const listId = `pl-${match.id}`
  const isTBD = match.teamHome === 'TBD'
  const effectiveScorer = specialScorer || scorerVal

  return (
    <div className="card rounded-2xl overflow-hidden shadow-lg border"
      style={{
        borderColor: isOpen && !isTBD ? 'rgba(201,162,39,0.25)' : 'rgba(255,255,255,0.06)',
        borderTop: isOpen && !isTBD ? `2px solid ${ACCENT}` : undefined,
      }}>

      {/* Header */}
      <div className="px-4 pt-3 pb-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {match.group ? `Gr. ${match.group} · ` : ''}{formatDate(match.kickoff)}
          </span>
          <div className="flex items-center gap-2">
            {match.status === 'finished' && (
              <span className="text-xs font-black px-2.5 py-0.5 rounded-full text-white"
                style={{ background: 'rgba(255,255,255,0.12)' }}>
                {match.scoreHome} – {match.scoreAway}
              </span>
            )}
            {countdown && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(201,162,39,0.15)', color: ACCENT, border: `1px solid rgba(201,162,39,0.25)` }}>
                {countdown}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between text-base font-bold">
          <span style={{ color: isTBD ? 'rgba(255,255,255,0.3)' : '#f0eef5' }}>
            {isTBD ? '–' : `${flag(match.teamHome)} ${match.teamHome}`}
          </span>
          <span className="text-xs font-normal mx-2" style={{ color: 'rgba(255,255,255,0.3)' }}>vs</span>
          <span style={{ color: isTBD ? 'rgba(255,255,255,0.3)' : '#f0eef5' }}>
            {isTBD ? '–' : `${match.teamAway} ${flag(match.teamAway)}`}
          </span>
        </div>
      </div>

      {/* Body */}
      {isTBD ? (
        <div className="px-4 py-3 text-center text-sm italic" style={{ color: 'rgba(255,255,255,0.3)' }}>
          Drużyny poznamy po fazie grupowej
        </div>
      ) : !isOpen ? (
        <div className="px-4 py-3">
          <p className="text-center text-sm mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>🔒 Typowanie zamknięte</p>
          {prediction && (
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span style={{ color: 'rgba(255,255,255,0.45)' }}>Typ:</span>
                <span className="font-semibold" style={{ color: '#f0eef5' }}>
                  {prediction.winner === 'home' ? match.teamHome : prediction.winner === 'away' ? match.teamAway : 'Remis'}
                </span>
              </div>
              {prediction.scoreHome !== null && (
                <div className="flex justify-between">
                  <span style={{ color: 'rgba(255,255,255,0.45)' }}>Wynik:</span>
                  <span className="font-mono font-semibold" style={{ color: '#f0eef5' }}>{prediction.scoreHome}–{prediction.scoreAway}</span>
                </div>
              )}
              {prediction.scorer && (
                <div className="flex justify-between">
                  <span style={{ color: 'rgba(255,255,255,0.45)' }}>1. bramka:</span>
                  <span className="font-semibold" style={{ color: '#f0eef5' }}>{prediction.scorer}</span>
                </div>
              )}
              {match.status === 'finished' && prediction.points !== undefined && (
                <div className="flex justify-between pt-1.5 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  <span style={{ color: 'rgba(255,255,255,0.45)' }}>Punkty:</span>
                  <span className="font-black text-base" style={{ color: prediction.points > 0 ? ACCENT : 'rgba(255,255,255,0.4)' }}>
                    {prediction.points > 0 ? `+${prediction.points}` : '0'} pkt
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <>
          {matchPlayers.length > 0 && (
            <datalist id={listId}>{matchPlayers.map((n) => <option key={n} value={n} />)}</datalist>
          )}
          <form action={savePredictionAction} className="px-4 py-3 space-y-3">
            <input type="hidden" name="matchId" value={match.id} />
            <input type="hidden" name="scorer" value={effectiveScorer} />
            {round && <input type="hidden" name="round" value={round} />}

            {/* Winner */}
            <div>
              <p className="text-xs font-black mb-1.5 uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Zwycięzca <span className="font-black" style={{ color: ACCENT }}>+1 pkt</span>
              </p>
              <div className="grid grid-cols-3 gap-2">
                {([{ val: 'home', label: match.teamHome }, { val: 'draw', label: 'Remis' }, { val: 'away', label: match.teamAway }] as const).map(({ val, label }) => (
                  <label key={val} className="cursor-pointer">
                    <input type="radio" name="winner" value={val} defaultChecked={prediction?.winner === val} className="sr-only peer" required />
                    <span className="block text-center text-xs py-2 px-1 rounded-lg border transition-all font-bold truncate"
                      style={{ borderColor: 'rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.7)' }}
                      /* peer-checked handled inline below */ >
                      {label}
                    </span>
                    {/* CSS peer-checked via global — using a wrapper trick */}
                  </label>
                ))}
              </div>
              {/* Peer-checked style workaround — inject via style tag is complex, use Tailwind's peer-checked */}
              <style>{`
                .peer:checked ~ span {
                  background: rgba(201,162,39,0.18) !important;
                  border-color: rgba(201,162,39,0.50) !important;
                  color: #c9a227 !important;
                }
              `}</style>
            </div>

            {/* Score */}
            <div>
              <p className="text-xs font-black mb-1.5 uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Dokładny wynik
                <span className="font-normal normal-case tracking-normal ml-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  różnica <span className="font-black" style={{ color: ACCENT }}>+1</span>
                  {' · '}dokładny <span className="font-black" style={{ color: ACCENT }}>+2 extra</span>
                </span>
              </p>
              <div className="flex items-center gap-2">
                <input type="number" name="scoreHome" min={0} max={20} defaultValue={prediction?.scoreHome ?? ''} placeholder="0"
                  className="w-16 text-center py-1.5 rounded-lg border font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
                  style={inpSt} />
                <span className="font-black text-lg" style={{ color: 'rgba(255,255,255,0.3)' }}>–</span>
                <input type="number" name="scoreAway" min={0} max={20} defaultValue={prediction?.scoreAway ?? ''} placeholder="0"
                  className="w-16 text-center py-1.5 rounded-lg border font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
                  style={inpSt} />
              </div>
            </div>

            {/* First scorer */}
            <div>
              <p className="text-xs font-black mb-1.5 uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Strzelec pierwszej bramki <span className="font-black" style={{ color: ACCENT }}>+2 pkt</span>
              </p>
              <div className="flex gap-2 mb-2">
                {SPECIAL_SCORERS.map((s) => (
                  <button key={s} type="button"
                    onClick={() => { setSpecialScorer(specialScorer === s ? '' : s); setScorerVal('') }}
                    className="px-3 py-1 rounded-lg text-xs font-bold border transition-all"
                    style={specialScorer === s
                      ? { background: 'rgba(201,162,39,0.20)', color: ACCENT, borderColor: 'rgba(201,162,39,0.40)' }
                      : { background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)' }
                    }>
                    {s === 'Brak gola' ? '⛔ Brak gola' : '↩️ Gol samobójczy'}
                  </button>
                ))}
              </div>
              <input
                type="text"
                list={matchPlayers.length > 0 ? listId : undefined}
                value={scorerVal}
                onChange={(e) => { setScorerVal(e.target.value); setSpecialScorer('') }}
                placeholder={specialScorer || 'Zacznij pisać nazwisko…'}
                autoComplete="off"
                disabled={!!specialScorer}
                className={`${inpCls} ${specialScorer ? 'opacity-40 cursor-not-allowed' : ''}`}
                style={inpSt}
              />
              {effectiveScorer && (
                <p className="mt-1 text-xs font-bold" style={{ color: ACCENT }}>
                  Wybrano: <span className="font-black">{effectiveScorer}</span>
                </p>
              )}
            </div>

            <button type="submit"
              className="w-full py-2.5 font-black rounded-xl transition-all text-sm shadow-md active:scale-95"
              style={{ background: `linear-gradient(135deg, ${ACCENT}, #a88520)`, color: '#0d0a1a' }}>
              {prediction ? '✏️ Zaktualizuj typ' : '✅ Zapisz typ'}
            </button>
          </form>
        </>
      )}

      {/* Typy innych użytkowników */}
      {otherPredictions.length > 0 && (
        <div className="border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          <button
            onClick={() => setShowOthers(!showOthers)}
            className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-bold transition-colors"
            style={{ color: showOthers ? 'rgba(255,255,255,0.60)' : 'rgba(255,255,255,0.35)' }}>
            <span>Typy innych ({otherPredictions.length})</span>
            <span>{showOthers ? '▲' : '▼'}</span>
          </button>
          {showOthers && (
            <div className="px-4 pb-3 space-y-2">
              {otherPredictions.map((p) => (
                <div key={p.userId} className="flex items-center gap-2.5 text-xs">
                  {p.avatarUrl ? (
                    <img src={p.avatarUrl} alt={p.userName} className="w-5 h-5 rounded-full object-cover shrink-0" />
                  ) : (
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black shrink-0"
                      style={{ background: 'rgba(255,255,255,0.12)', color: '#f0eef5' }}>
                      {p.userName[0]?.toUpperCase()}
                    </div>
                  )}
                  <span className="w-20 truncate font-bold" style={{ color: 'rgba(255,255,255,0.55)' }}>{p.userName}</span>
                  <span className="font-black" style={{ color: '#f0eef5' }}>
                    {p.winner === 'home' ? match.teamHome : p.winner === 'away' ? match.teamAway : 'Remis'}
                  </span>
                  {p.scoreHome !== null && (
                    <span className="font-mono" style={{ color: 'rgba(255,255,255,0.45)' }}>{p.scoreHome}:{p.scoreAway}</span>
                  )}
                  {p.scorer && (
                    <span className="truncate max-w-[80px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{p.scorer}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
