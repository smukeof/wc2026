'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Category = { key: string; label: string }

export default function RankingSelect({
  categories,
  activeKey,
}: {
  categories: Category[]
  activeKey: string
}) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const active = categories.find((c) => c.key === activeKey) ?? categories[0]

  const navigate = (key: string) => {
    router.push(`/ranking?round=${key}`)
    setOpen(false)
  }

  return (
    <div className="relative mb-5">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black w-full text-left transition-all"
        style={{
          background: open ? 'rgba(201,162,39,0.12)' : 'rgba(255,255,255,0.05)',
          border: `1px solid ${open ? 'rgba(201,162,39,0.30)' : 'rgba(255,255,255,0.09)'}`,
          color: '#f0eef5',
        }}
      >
        <span style={{ color: '#c9a227' }}>🏆</span>
        <span className="flex-1">{active?.label ?? 'Ogólny'}</span>
        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            className="absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden shadow-2xl z-20"
            style={{
              background: 'rgba(8, 5, 18, 0.97)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(20px)',
            }}
          >
            {categories.map((c) => (
              <button
                key={c.key}
                onClick={() => navigate(c.key)}
                className="w-full text-left px-4 py-2.5 text-sm font-bold transition-all flex items-center justify-between"
                style={{
                  color: c.key === activeKey ? '#c9a227' : 'rgba(240,238,245,0.75)',
                  background: c.key === activeKey ? 'rgba(201,162,39,0.08)' : 'transparent',
                }}
                onMouseEnter={e => { if (c.key !== activeKey) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                onMouseLeave={e => { e.currentTarget.style.background = c.key === activeKey ? 'rgba(201,162,39,0.08)' : 'transparent' }}
              >
                <span>{c.label}</span>
                {c.key === activeKey && <span className="text-xs">✓</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
