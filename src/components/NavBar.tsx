import Link from 'next/link'
import ThemeToggle from './ThemeToggle'
import { logoutAction } from '@/app/actions'

interface NavBarProps {
  userName: string
  isAdmin: boolean
  activeTab: 'dashboard' | 'ranking' | 'chat' | 'drabinka' | 'admin' | 'profile'
  avatarUrl?: string
}

export default function NavBar({ userName, isAdmin, activeTab, avatarUrl }: NavBarProps) {
  const link = (tab: typeof activeTab, href: string, label: string) => (
    <Link href={href} className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
      activeTab === tab
        ? 'text-white shadow-sm'
        : 'text-white/55 hover:text-white hover:bg-white/10'
    }`}
    style={activeTab === tab ? { background: 'linear-gradient(135deg, #C8102E 0%, #F4600C 100%)' } : undefined}
    >{label}</Link>
  )

  return (
    <nav className="sticky top-0 z-10 border-b border-white/8" style={{ backgroundColor: '#0C0003' }}>
      <div style={{
        height: '5px',
        width: '100%',
        background: 'linear-gradient(90deg, #C8102E 0%, #F4600C 18%, #FFD700 36%, #7DBB2D 54%, #0033A0 74%, #6B3FA0 100%)'
      }} />
      <div className="max-w-3xl mx-auto px-4 flex items-center gap-1.5 py-2.5">
        <div className="flex items-center gap-2 mr-2 shrink-0">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm shadow-md"
            style={{ background: 'linear-gradient(135deg, #C8102E 0%, #F4600C 100%)' }}>⚽</div>
          <span className="font-black text-white/90 hidden sm:block text-sm tracking-tight">
            <span style={{ color: '#C8102E' }}>MUN</span><span style={{ color: '#F4600C' }}>DIAL</span>{' '}
            <span style={{ color: '#FFD700' }}>26</span>
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
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white"
              style={{ background: 'linear-gradient(135deg, #C8102E 0%, #F4600C 100%)' }}>
              {userName[0]?.toUpperCase()}
            </div>
          )}
          <span className="text-xs text-white/30 font-medium">{userName}</span>
        </Link>
        <ThemeToggle />
        <form action={logoutAction}>
          <button className="text-xs px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-white/40 transition-colors shrink-0">
            Wyloguj
          </button>
        </form>
      </div>
    </nav>
  )
}
