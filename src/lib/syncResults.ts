// Auto-uzupełnianie wyników z football-data.org (FIFA World Cup 2026).
// Dopasowuje mecze po PARZE DRUŻYN (kod TLA → polska nazwa), nie po czasie.
// Ustawia wynik (po 120') + kto awansował (faza pucharowa). Strzelca NIE rusza
// (darmowe API go nie udostępnia) — zachowuje ręcznie wpisanego scorera.

import { prisma } from './db'
import { calcPoints, GROUP_PHASES } from './scoring'

// Kod TLA z API → polska nazwa drużyny w naszej bazie
const TLA_TO_PL: Record<string, string> = {
  ALG: 'Algieria', ARG: 'Argentyna', AUS: 'Australia', AUT: 'Austria', BEL: 'Belgia',
  BIH: 'Bośnia i Hercegowina', BRA: 'Brazylia', CAN: 'Kanada', CPV: 'Wyspy Zielonego Przylądka',
  COL: 'Kolumbia', COD: 'DR Kongo', CRO: 'Chorwacja', CUW: 'Curaçao', CZE: 'Czechy',
  ECU: 'Ekwador', EGY: 'Egipt', ENG: 'Anglia', FRA: 'Francja', GER: 'Niemcy', GHA: 'Ghana',
  HAI: 'Haiti', IRN: 'Iran', IRQ: 'Irak', CIV: 'Wybrzeże Kości Słoniowej', JPN: 'Japonia',
  JOR: 'Jordania', MEX: 'Meksyk', MAR: 'Maroko', NED: 'Holandia', NZL: 'Nowa Zelandia',
  NOR: 'Norwegia', PAN: 'Panama', PAR: 'Paragwaj', POR: 'Portugalia', QAT: 'Katar',
  KSA: 'Arabia Saudyjska', SCO: 'Szkocja', SEN: 'Senegal', RSA: 'RPA', KOR: 'Korea Południowa',
  ESP: 'Hiszpania', SWE: 'Szwecja', SUI: 'Szwajcaria', TUN: 'Tunezja', TUR: 'Turcja',
  USA: 'USA', URU: 'Urugwaj', UZB: 'Uzbekistan',
}

const pairKey = (a: string, b: string) => [a, b].sort().join('|')

// Bufor: wynik meczu zapisujemy dopiero 3h po jego zakończeniu (gdy API oznaczyło
// go jako FINISHED). Ręczna synchronizacja z panelu pomija bufor (force = true).
const DELAY_AFTER_END_MS = 3 * 60 * 60 * 1000

export type SyncResult = {
  ok: boolean
  error?: string
  updated: number
  skippedWaiting: number
  details: string[]
}

export async function syncResults(opts: { force?: boolean } = {}): Promise<SyncResult> {
  const token = process.env.FOOTBALL_API_TOKEN
  if (!token) return { ok: false, error: 'Brak FOOTBALL_API_TOKEN', updated: 0, skippedWaiting: 0, details: [] }

  let data: { matches?: any[] }
  try {
    const res = await fetch('https://api.football-data.org/v4/competitions/WC/matches', {
      headers: { 'X-Auth-Token': token },
      cache: 'no-store',
    })
    if (!res.ok) return { ok: false, error: `API HTTP ${res.status}`, updated: 0, skippedWaiting: 0, details: [] }
    data = await res.json()
  } catch (e) {
    return { ok: false, error: 'Fetch error: ' + (e as Error).message, updated: 0, skippedWaiting: 0, details: [] }
  }

  const apiMatches = data.matches ?? []
  const apiByPair = new Map<string, any>()
  for (const m of apiMatches) {
    const h = TLA_TO_PL[m.homeTeam?.tla]
    const a = TLA_TO_PL[m.awayTeam?.tla]
    if (!h || !a) continue
    apiByPair.set(pairKey(h, a), m)
  }

  const dbMatches = await prisma.match.findMany({ where: { status: { not: 'finished' } } })
  let updated = 0
  let skippedWaiting = 0
  const details: string[] = []

  for (const db of dbMatches) {
    const am = apiByPair.get(pairKey(db.teamHome, db.teamAway))
    if (!am || am.status !== 'FINISHED') continue
    const ft = am.score?.fullTime
    if (ft?.home == null || ft?.away == null) continue

    // Bufor 3h od zakończenia meczu (chyba że wymuszono z panelu)
    if (!opts.force && am.lastUpdated) {
      const sinceEnd = Date.now() - new Date(am.lastUpdated).getTime()
      if (sinceEnd < DELAY_AFTER_END_MS) { skippedWaiting++; continue }
    }

    // Orientacja: czy gospodarz w API == nasz gospodarz
    const apiHomePl = TLA_TO_PL[am.homeTeam.tla]
    const sameOrient = apiHomePl === db.teamHome
    const scoreHome = sameOrient ? ft.home : ft.away
    const scoreAway = sameOrient ? ft.away : ft.home

    // Awans tylko dla faz pucharowych (z winner, uwzględnia karne)
    const isKnockout = !GROUP_PHASES.includes(db.phase)
    let advanced: string | null = null
    if (isKnockout) {
      if (am.score.winner === 'HOME_TEAM') advanced = sameOrient ? 'home' : 'away'
      else if (am.score.winner === 'AWAY_TEAM') advanced = sameOrient ? 'away' : 'home'
    }

    // Zachowujemy ręcznie wpisanego strzelca (scorers) — nie nadpisujemy
    await prisma.match.update({
      where: { id: db.id },
      data: { scoreHome, scoreAway, advanced, status: 'finished' },
    })

    const preds = await prisma.prediction.findMany({ where: { matchId: db.id } })
    for (const p of preds) {
      const pts = calcPoints(p, { scoreHome, scoreAway, scorers: db.scorers, advanced })
      await prisma.prediction.update({ where: { id: p.id }, data: { points: pts } })
    }

    updated++
    const advTeam = advanced === 'home' ? db.teamHome : advanced === 'away' ? db.teamAway : null
    details.push(`${db.teamHome} ${scoreHome}–${scoreAway} ${db.teamAway}${advTeam ? ` (awans: ${advTeam})` : ''}`)
  }

  return { ok: true, updated, skippedWaiting, details }
}
