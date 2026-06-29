// Wspólna logika punktacji + stałe faz. Używane przez akcje admina i auto-sync.

export const GROUP_PHASES = ['Kolejka 1', 'Kolejka 2', 'Kolejka 3']

export function calcPoints(
  prediction: { winner: string; scorer: string | null; scoreHome: number | null; scoreAway: number | null; advance?: string | null },
  match: { scoreHome: number; scoreAway: number; scorers: string | null; advanced?: string | null }
): number {
  let pts = 0
  const actual = match.scoreHome > match.scoreAway ? 'home' : match.scoreHome < match.scoreAway ? 'away' : 'draw'
  const winnerCorrect = prediction.winner === actual

  // 1. Zwycięzca / remis: 1 pkt
  if (winnerCorrect) {
    pts += 1
    // 2. Różnica bramek (po właściwej stronie): +1 pkt
    if (prediction.scoreHome !== null && prediction.scoreAway !== null) {
      const predGD = prediction.scoreHome - prediction.scoreAway
      const actualGD = match.scoreHome - match.scoreAway
      if (predGD === actualGD) pts += 1
    }
  }

  // 3. Dokładny wynik: +2 extra (łącznie 4 pkt gdy trafimy zwycięzcę + różnicę + dokładny)
  if (
    prediction.scoreHome !== null && prediction.scoreAway !== null &&
    prediction.scoreHome === match.scoreHome && prediction.scoreAway === match.scoreAway
  ) {
    pts += 2
  }

  // 4. Strzelec pierwszej bramki: 2 pkt
  if (prediction.scorer && match.scorers) {
    if (prediction.scorer.toLowerCase().trim() === match.scorers.toLowerCase().trim()) pts += 2
  }

  // 5. Awans (faza pucharowa): +1 pkt jeśli trafiono drużynę, która awansowała
  if (match.advanced && prediction.advance && prediction.advance === match.advanced) {
    pts += 1
  }

  return pts
}
