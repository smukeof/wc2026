'use client'

import { useState, useTransition } from 'react'
import { spinWheelAction } from '@/app/actions'

const ACCENT = '#c9a227'

export default function WheelSpin({ matchId, initialPoints }: { matchId: number; initialPoints: number | null }) {
  const [spun, setSpun] = useState(initialPoints !== null)
  const [points, setPoints] = useState<number | null>(initialPoints)
  const [rolling, setRolling] = useState(false)
  const [display, setDisplay] = useState<number | null>(initialPoints)
  const [pending, startTransition] = useTransition()

  const spin = () => {
    if (spun || rolling || pending) return
    setRolling(true)
    const startAt = Date.now()
    const interval = setInterval(() => setDisplay(Math.floor(Math.random() * 7)), 70)

    startTransition(async () => {
      const r = await spinWheelAction(matchId)
      const elapsed = Date.now() - startAt
      const remaining = Math.max(0, 1600 - elapsed)
      setTimeout(() => {
        clearInterval(interval)
        if (r.ok || r.alreadySpun) {
          setPoints(r.points ?? 0)
          setDisplay(r.points ?? 0)
          setSpun(true)
        }
        setRolling(false)
      }, remaining)
    })
  }

  return (
    <div className="px-4 py-4"
      style={{ background: 'linear-gradient(135deg, rgba(201,162,39,0.08), rgba(201,162,39,0.02))' }}>
      <div className="flex items-center gap-3">
        <div className={`text-3xl ${rolling ? 'animate-spin' : ''}`}>🎡</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-black" style={{ color: ACCENT }}>Koło fortuny</p>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
            {spun
              ? <>Wylosowałeś <span className="font-black" style={{ color: ACCENT }}>{points} pkt</span> — bonus doliczony do wyniku.</>
              : 'Zakręć raz — losujesz 0–6 pkt bonusu.'}
          </p>
        </div>
        {!spun && (
          <button onClick={spin} disabled={rolling || pending}
            className="px-3 py-2 font-black rounded-xl transition-all text-sm shadow-md active:scale-95 disabled:opacity-60"
            style={{ background: `linear-gradient(135deg, ${ACCENT}, #a88520)`, color: '#0d0a1a' }}>
            {rolling ? `🎲 ${display ?? 0}` : 'Zakręć!'}
          </button>
        )}
        {spun && (
          <div className="px-3 py-2 rounded-xl font-black text-lg"
            style={{ background: 'rgba(201,162,39,0.20)', color: ACCENT, border: '1px solid rgba(201,162,39,0.40)' }}>
            +{points}
          </div>
        )}
      </div>
    </div>
  )
}
