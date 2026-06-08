import { redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/session'
import NavBar from '@/components/NavBar'
import PhotoMosaic from '@/components/PhotoMosaic'
import fs from 'fs'
import path from 'path'

export default async function MessiPage() {
  const user = await getSessionUser()
  if (!user) redirect('/')

  const dir = path.join(process.cwd(), 'public/players/messi')
  const files = fs.readdirSync(dir).filter((f) =>
    /\.(jpg|jpeg|webp|avif|png)$/i.test(f)
  )
  const images = files.map((f) => `/players/messi/${f}`)

  return (
    <div className="min-h-screen relative">
      <NavBar
        userName={user.name}
        isAdmin={user.isAdmin}
        activeTab="player"
        avatarUrl={user.avatarUrl ?? undefined}
      />
      <PhotoMosaic images={images} />

      {/* Badge */}
      <div className="fixed bottom-8 left-8 z-10 select-none pointer-events-none">
        <div className="text-[120px] font-black leading-none opacity-20 text-white drop-shadow-2xl">10</div>
        <div className="text-white font-black text-2xl tracking-tight drop-shadow-2xl -mt-4"
          style={{ textShadow: '0 2px 16px rgba(0,0,0,0.8)' }}>
          Lionel Messi
        </div>
        <div className="text-white/60 text-sm font-bold drop-shadow-lg mt-0.5"
          style={{ textShadow: '0 1px 8px rgba(0,0,0,0.8)' }}>
          🇦🇷 Argentyna
        </div>
      </div>
    </div>
  )
}
