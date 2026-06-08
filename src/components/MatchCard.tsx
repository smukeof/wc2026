'use client'

import { useState } from 'react'
import { savePredictionAction } from '@/app/actions'

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
  id: number
  teamHome: string
  teamAway: string
  kickoff: Date
  phase: string
  group: string | null
  status: string
  scoreHome: number | null
  scoreAway: number | null
}

export type PredictionData = {
  winner: string
  scorer: string | null
  scoreHome: number | null
  scoreAway: number | null
  points?: number
} | null

export default function MatchCard({
  match, prediction, matchPlayers, isOpen, round,
}: {
  match: MatchData
  prediction: PredictionData
  matchPlayers: string[]
  isOpen: boolean
  round?: string
}) {
  const initialScorer = prediction?.scorer ?? ''
  const initSpecial = SPECIAL_SCORERS.includes(initialScorer) ? initialScorer : ''
  const [scorerVal, setScorerVal] = useState(initSpecial ? '' : initialScorer)
  const [specialScorer, setSpecialScorer] = useState(initSpecial)

  const msLeft = new Date(match.kickoff).getTime() - Date.now()
  const hoursLeft = Math.floor(msLeft / 1000 / 60 / 60)
  const daysLeft = Math.floor(hoursLeft / 24)
  const countdown = daysLeft > 0 ? `za ${daysLeft} dni` : hoursLeft > 0 ? `za ${hoursLeft} h` : null
  const listId = `pl-${match.id}`
  const isTBD = match.teamHome === 'TBD'

  const effectiveScorer = specialScorer || scorerVal

  const inp = 'w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-brand-500'
  const inpSt = { backgroundColor: '#f5edf0', borderColor: '#e0c8d0', color: '#1a0007' }

  return (
    <div className="card rounded-2xl overflow-hidden shadow-lg"
      style={isOpen && !isTBD ? { borderTop: '3px solid #C8102E' } : undefined}>
      {/* Header */}
      <div className="px-4 pt-3 pb-3 border-b border-zinc-200/60">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-zinc-500">
            {match.group ? `Gr. ${match.group} · ` : ''}{formatDate(match.kickoff)}
          </span>
          <div className="flex items-center gap-2">
            {match.status === 'finished' && (
              <span className="text-xs font-black px-2.5 py-0.5 rounded-full text-white"
                style={{ background: 'linear-gradient(135deg, #1a0007 0%, #3a0010 100%)' }}>
                {match.scoreHome} – {match.scoreAway}
              </span>
            )}
            {countdown && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                style={{ background: 'linear-gradient(135deg, #C8102E 0%, #F4600C 100%)' }}>
                {countdown}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between text-base font-bold text-zinc-900">
          <span className={isTBD ? 'text-zinc-400 italic' : ''}>{isTBD ? '–' : `${flag(match.teamHome)} ${match.teamHome}`}</span>
          <span className="text-zinc-400 text-xs font-normal mx-2">vs</span>
          <span className={isTBD ? 'text-zinc-400 italic' : ''}>{isTBD ? '–' : `${match.teamAway} ${flag(match.teamAway)}`}</span>
        </div>
      </div>

      {/* Body */}
      {isTBD ? (
        <div className="px-4 py-3 text-center text-sm text-zinc-400 italic">Drużyny poznamy po fazie grupowej</div>
      ) : !isOpen ? (
        <div className="px-4 py-3">
          <p className="text-center text-sm text-zinc-400 mb-2">🔒 Typowanie zamknięte</p>
          {prediction && (
            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-zinc-800"><span className="text-zinc-500">Typ:</span><span className="font-semibold">{prediction.winner === 'home' ? match.teamHome : prediction.winner === 'away' ? match.teamAway : 'Remis'}</span></div>
              {prediction.scoreHome !== null && <div className="flex justify-between text-zinc-800"><span className="text-zinc-500">Wynik:</span><span className="font-mono font-semibold">{prediction.scoreHome}–{prediction.scoreAway}</span></div>}
              {prediction.scorer && <div className="flex justify-between text-zinc-800"><span className="text-zinc-500">1. bramka:</span><span className="font-semibold">{prediction.scorer}</span></div>}
              {match.status === 'finished' && prediction.points !== undefined && (
                <div className="flex justify-between pt-1.5 border-t border-zinc-200/60">
                  <span className="text-zinc-500">Punkty:</span>
                  <span className="font-black text-base" style={{ color: prediction.points > 0 ? '#C8102E' : undefined }}>
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
              <p className="text-xs font-black text-zinc-500 mb-1.5 uppercase tracking-widest">
                Zwycięzca <span className="font-black" style={{ color: '#C8102E' }}>+1 pkt</span>
              </p>
              <div className="grid grid-cols-3 gap-2">
                {([{ val: 'home', label: match.teamHome }, { val: 'draw', label: 'Remis' }, { val: 'away', label: match.teamAway }] as const).map(({ val, label }) => (
                  <label key={val} className="cursor-pointer">
                    <input type="radio" name="winner" value={val} defaultChecked={prediction?.winner === val} className="sr-only peer" required />
                    <span className="block text-center text-xs py-2 px-1 rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-700 peer-checked:border-brand-500 peer-checked:bg-brand-500 peer-checked:text-white transition-all font-bold truncate">
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Score */}
            <div>
              <p className="text-xs font-black text-zinc-500 mb-1.5 uppercase tracking-widest">
                Dokładny wynik
                <span className="font-normal normal-case tracking-normal text-zinc-400 ml-1.5 text-xs">
                  różnica <span className="font-black" style={{ color: '#C8102E' }}>+1</span>
                  {' · '}dokładny <span className="font-black" style={{ color: '#C8102E' }}>+2 extra</span>
                </span>
              </p>
              <div className="flex items-center gap-2">
                <input type="number" name="scoreHome" min={0} max={20} defaultValue={prediction?.scoreHome ?? ''} placeholder="0"
                  className="w-16 text-center py-1.5 rounded-lg border font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
                  style={inpSt} />
                <span className="text-zinc-400 font-black text-lg">–</span>
                <input type="number" name="scoreAway" min={0} max={20} defaultValue={prediction?.scoreAway ?? ''} placeholder="0"
                  className="w-16 text-center py-1.5 rounded-lg border font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
                  style={inpSt} />
              </div>
            </div>

            {/* First goal scorer */}
            <div>
              <p className="text-xs font-black text-zinc-500 mb-1.5 uppercase tracking-widest">
                Strzelec pierwszej bramki <span className="font-black" style={{ color: '#C8102E' }}>+2 pkt</span>
              </p>
              <div className="flex gap-2 mb-2">
                {SPECIAL_SCORERS.map((s) => (
                  <button key={s} type="button"
                    onClick={() => { setSpecialScorer(specialScorer === s ? '' : s); setScorerVal('') }}
                    className="px-3 py-1 rounded-lg text-xs font-bold border transition-all"
                    style={specialScorer === s
                      ? { background: 'linear-gradient(135deg,#F59E0B,#D97706)', color: 'white', borderColor: 'transparent' }
                      : { backgroundColor: '#f5edf0', borderColor: '#e0c8d0', color: '#7a3040' }}>
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
                className={`${inp} ${specialScorer ? 'opacity-40 cursor-not-allowed' : ''}`}
                style={inpSt}
              />
              {effectiveScorer && (
                <p className="mt-1 text-xs font-bold" style={{ color: '#C8102E' }}>
                  Wybrano: <span className="font-black">{effectiveScorer}</span>
                </p>
              )}
            </div>

            <button type="submit"
              className="w-full py-2.5 text-white font-black rounded-xl transition-all text-sm shadow-md active:scale-95"
              style={{ background: 'linear-gradient(135deg, #C8102E 0%, #F4600C 100%)' }}>
              {prediction ? '✏️ Zaktualizuj typ' : '✅ Zapisz typ'}
            </button>
          </form>
        </>
      )}
    </div>
  )
}
