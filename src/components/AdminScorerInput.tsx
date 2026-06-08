'use client'

import { useState } from 'react'

const SPECIALS = ['Brak gola', 'Gol samobójczy']

export default function AdminScorerInput({ defaultValue }: { defaultValue: string }) {
  const [value, setValue] = useState(defaultValue)

  const inp = 'w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-brand-500'
  const inpStyle = { backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)', color: '#f0eef5' }

  return (
    <div>
      <div className="flex gap-2 mb-2">
        {SPECIALS.map((s) => (
          <button key={s} type="button"
            onClick={() => setValue((v) => v === s ? '' : s)}
            className="px-3 py-1 rounded-lg text-xs font-bold border transition-all"
            style={value === s
              ? { background: 'rgba(201,162,39,0.20)', color: '#c9a227', borderColor: 'rgba(201,162,39,0.40)' }
              : { backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.60)' }}>
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
