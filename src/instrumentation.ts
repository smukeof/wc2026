// Automat: co 15 min sprawdza w API piłkarskim zakończone mecze i uzupełnia
// wynik + awans (patrz src/lib/syncResults.ts). Działa tylko na produkcji
// (serwerowy runtime Node), żeby nie odpytywać API podczas dev/buildu.

export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return
  if (process.env.NODE_ENV !== 'production') return

  const { syncResults } = await import('./lib/syncResults')

  const run = async () => {
    try {
      const r = await syncResults()
      if (r.updated > 0) console.log(`[sync] zaktualizowano ${r.updated}: ${r.details.join(' | ')}`)
      else if (!r.ok) console.warn('[sync] błąd:', r.error)
    } catch (e) {
      console.error('[sync] wyjątek:', e)
    }
  }

  setTimeout(run, 30_000)            // pierwszy przebieg ~30s po starcie
  setInterval(run, 15 * 60_000)      // potem co 15 minut
}
