'use client'

import Link from 'next/link'
import ThemeToggle from './ThemeToggle'
import MusicPlayer from './MusicPlayer'
import { logoutAction } from '@/app/actions'

interface NavBarProps {
  userName: string
  isAdmin: boolean
  activeTab: 'dashboard' | 'ranking' | 'chat' | 'drabinka' | 'admin' | 'profile' | 'player'
  avatarUrl?: string
}

export default function NavBar({ userName, isAdmin, activeTab, avatarUrl }: NavBarProps) {
  const link = (tab: typeof activeTab, href: string, label: string) => (
    <Link href={href} className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
      activeTab === tab
        ? 'font-black'
        : 'text-white/45 hover:text-white/80 hover:bg-white/08'
    }`}
    style={activeTab === tab
      ? { color: '#c9a227', background: 'rgba(201,162,39,0.12)', border: '1px solid rgba(201,162,39,0.18)' }
      : undefined
    }
    >{label}</Link>
  )

  return (
    <nav className="sticky top-0 z-10 border-b"
      style={{ backgroundColor: 'rgba(6, 4, 14, 0.96)', backdropFilter: 'blur(16px)', borderColor: 'rgba(255,255,255,0.06)' }}>
      <div className="max-w-3xl mx-auto px-4 flex items-center gap-1.5 py-2.5">
        <div className="flex items-center gap-2 mr-2 shrink-0">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm shadow-md"
            style={{ background: 'rgba(201,162,39,0.15)', border: '1px solid rgba(201,162,39,0.25)' }}>
            <span style={{ color: '#c9a227' }}>⚽</span>
          </div>
          <span className="font-black hidden sm:block text-sm tracking-tight" style={{ color: '#c9a227' }}>
            MUNDIAL 26
          </span>
        </div>
        <div className="flex gap-0.5 flex-1 overflow-x-auto scrollbar-none">
          {link('dashboard', '/dashboard', 'Typy')}
          {link('drabinka', '/drabinka', '🏆 Drabinka')}
          {link('ranking', '/ranking', 'Ranking')}
          {link('chat', '/chat', '💬 Chat')}
          {isAdmin && link('admin', '/admin', '⚙️ Admin')}
        </div>
        <Link href="/profile"
          className="hidden sm:flex items-center gap-1.5 mr-1.5 shrink-0 hover:opacity-80 transition-opacity">
          {avatarUrl ? (
            <img src={avatarUrl} alt={userName} className="w-6 h-6 rounded-full object-cover" />
          ) : (
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black"
              style={{ background: 'rgba(201,162,39,0.20)', color: '#c9a227', border: '1px solid rgba(201,162,39,0.25)' }}>
              {userName[0]?.toUpperCase()}
            </div>
          )}
          <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>{userName}</span>
        </Link>
        <MusicPlayer />
        <ThemeToggle />
        <form action={logoutAction}>
          <button className="text-xs px-2.5 py-1.5 rounded-lg transition-colors shrink-0"
            style={{ color: 'rgba(255,255,255,0.35)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}>
            Wyloguj
          </button>
        </form>
      </div>
    </nav>
  )
}
