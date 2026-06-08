'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Round = { key: string; label: string }

export default function RoundSelect({
  rounds,
  activeKey,
  filterUnbet,
}: {
  rounds: Round[]
  activeKey: string
  filterUnbet: boolean
}) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const active = rounds.find((r) => r.key === activeKey) ?? rounds[0]

  const navigate = (key: string) => {
    router.push(`/dashboard?round=${key}${filterUnbet ? '&filter=unbet' : ''}`)
    setOpen(false)
  }

  return (
    <div className="relative mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black w-full text-left transition-all"
        style={{
          background: open ? 'rgba(201,162,39,0.12)' : 'rgba(255,255,255,0.05)',
          border: `1px solid ${open ? 'rgba(201,162,39,0.30)' : 'rgba(255,255,255,0.09)'}`,
          color: '#f0eef5',
        }}
      >
        <span style={{ color: '#c9a227' }}>⚽</span>
        <span className="flex-1">{active?.label ?? 'Wybierz kolejkę'}</span>
        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div
            className="absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden shadow-2xl z-20"
            style={{
              background: 'rgba(8, 5, 18, 0.97)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(20px)',
            }}
          >
            {rounds.map((r) => (
              <button
                key={r.key}
                onClick={() => navigate(r.key)}
                className="w-full text-left px-4 py-2.5 text-sm font-bold transition-all flex items-center justify-between"
                style={{
                  color: r.key === activeKey ? '#c9a227' : 'rgba(240,238,245,0.75)',
                  background: r.key === activeKey ? 'rgba(201,162,39,0.08)' : 'transparent',
                }}
                onMouseEnter={e => { if (r.key !== activeKey) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                onMouseLeave={e => { e.currentTarget.style.background = r.key === activeKey ? 'rgba(201,162,39,0.08)' : 'transparent' }}
              >
                <span>{r.label}</span>
                {r.key === activeKey && <span className="text-xs">✓</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
