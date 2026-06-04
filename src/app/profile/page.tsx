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

        <div className="card rounded-2xl p-6 border border-zinc-200/60 shadow-lg max-w-sm mx-auto">

          {/* Avatar */}
          <div className="flex flex-col items-center mb-6">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover shadow-lg border-4"
                style={{ borderColor: '#C8102E' }}
              />
            ) : (
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-black text-white shadow-lg border-4"
                style={{ background: 'linear-gradient(135deg, #C8102E 0%, #F4600C 100%)', borderColor: 'rgba(200,16,46,0.3)' }}
              >
                {user.name[0]?.toUpperCase()}
              </div>
            )}
            <p className="mt-3 font-black text-zinc-900 text-lg">{user.name}</p>
            {user.email && <p className="text-sm text-zinc-500">{user.email}</p>}
          </div>

          {/* Upload form */}
          <form action={updateAvatarAction} encType="multipart/form-data" className="space-y-3">
            <div>
              <label className="block text-xs font-black mb-2 uppercase tracking-widest" style={{ color: '#7a3040' }}>
                Zmień avatar
              </label>
              <input
                name="avatar"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                required
                className="w-full text-sm text-zinc-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:text-white file:cursor-pointer"
                style={{ '--file-bg': '#C8102E' } as React.CSSProperties}
              />
              <p className="text-xs text-zinc-400 mt-1">JPG, PNG lub WEBP · max ~1 MB</p>
            </div>

            {searchParams.error === '1' && (
              <div className="rounded-xl px-4 py-2.5 text-sm text-center font-medium"
                style={{ backgroundColor: '#ffd5d9', color: '#8B0011', border: '1px solid #ffb3bb' }}>
                Wybierz plik zdjęcia.
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-black text-white text-sm transition-all active:scale-95 shadow-md"
              style={{ background: 'linear-gradient(135deg, #C8102E 0%, #F4600C 100%)' }}
            >
              Zapisz avatar
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
