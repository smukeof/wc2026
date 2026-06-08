'use client'

import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [dark, setDark] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('theme')
    const isDark = stored !== 'light'
    setDark(isDark)
    document.documentElement.classList.toggle('dark', isDark)
  }, [])

  function toggle() {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  return (
    <button
      onClick={toggle}
      title={dark ? 'Przełącz na CR7' : 'Przełącz na Messi'}
      className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full text-xs font-black transition-all hover:scale-110"
      style={dark
        ? { background: 'rgba(0,100,180,0.25)', color: '#75b2dd', border: '1px solid rgba(117,178,221,0.3)' }
        : { background: 'rgba(200,16,46,0.20)', color: '#e87070', border: '1px solid rgba(232,112,112,0.3)' }
      }
    >
      {dark ? '10' : '7'}
    </button>
  )
}
