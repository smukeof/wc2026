'use client'

import { useState } from 'react'

const SPECIALS = ['Brak gola', 'Gol samobójczy']

export default function AdminScorerInput({ defaultValue }: { defaultValue: string }) {
  const [value, setValue] = useState(defaultValue)

  const inp = 'w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-brand-500'
  const inpStyle = { backgroundColor: '#f5edf0', borderColor: '#e0c8d0', color: '#1a0007' }

  return (
    <div>
      <div className="flex gap-2 mb-2">
        {SPECIALS.map((s) => (
          <button key={s} type="button"
            onClick={() => setValue((v) => v === s ? '' : s)}
            className="px-3 py-1 rounded-lg text-xs font-bold border transition-all"
            style={value === s
              ? { background: 'linear-gradient(135deg,#F59E0B,#D97706)', color: 'white', borderColor: 'transparent' }
              : { backgroundColor: '#f5edf0', borderColor: '#e0c8d0', color: '#7a3040' }}>
            {s === 'Brak gola' ? '⛔ Brak gola' : '↩️ Gol samobójczy'}
          </button>
        ))}
      </div>
      <input type="text" name="scorers" list="all-players-admin"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder='Zacznij pisać nazwisko…'
        autoComplete="off"
        className={inp} style={inpStyle} />
    </div>
  )
}
