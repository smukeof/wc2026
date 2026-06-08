import { redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/session'
import NavBar from '@/components/NavBar'
import { updateAvatarAction } from '@/app/actions'

export default async function ProfilePage({ searchParams }: { searchParams: { error?: string } }) {
  const user = await getSessionUser()
  if (!user) redirect('/')

  return (
    <div className="min-h-screen">
      <NavBar userName={user.name} isAdmin={user.isAdmin} activeTab="profile" avatarUrl={user.avatarUrl ?? undefined} />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-xl font-black text-white mb-6">Mój profil</h1>

        <div className="card rounded-2xl p-6 border shadow-lg max-w-sm mx-auto" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>

          {/* Avatar */}
          <div className="flex flex-col items-center mb-6">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover shadow-lg border-4"
                style={{ borderColor: 'rgba(201,162,39,0.40)' }}
              />
            ) : (
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-black shadow-lg border-4"
                style={{ background: 'linear-gradient(135deg, #c9a227 0%, #a88520 100%)', borderColor: 'rgba(201,162,39,0.30)', color: '#0d0a1a' }}
              >
                {user.name[0]?.toUpperCase()}
              </div>
            )}
            <p className="mt-3 font-black text-lg" style={{ color: '#f0eef5' }}>{user.name}</p>
            {user.email && <p className="text-sm" style={{ color: 'rgba(255,255,255,0.40)' }}>{user.email}</p>}
          </div>

          {/* Upload form */}
          <form action={updateAvatarAction} encType="multipart/form-data" className="space-y-3">
            <div>
              <label className="block text-xs font-black mb-2 uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Zmień avatar
              </label>
              <input
                name="avatar"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                required
                className="w-full text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:cursor-pointer file:bg-brand-500/20 file:text-brand-300"
                style={{ color: 'rgba(255,255,255,0.50)' }}
              />
              <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.30)' }}>JPG, PNG lub WEBP · max ~1 MB</p>
            </div>

            {searchParams.error === '1' && (
              <div className="rounded-xl px-4 py-2.5 text-sm text-center font-medium"
                style={{ backgroundColor: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.30)' }}>
                Wybierz plik zdjęcia.
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-black text-sm transition-all active:scale-95 shadow-md"
              style={{ background: 'linear-gradient(135deg, #c9a227 0%, #a88520 100%)', color: '#0d0a1a' }}
            >
              Zapisz avatar
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
