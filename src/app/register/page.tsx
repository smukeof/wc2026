import { registerAction } from '../actions'
import { getSessionUser } from '@/lib/session'
import { redirect } from 'next/navigation'

const ERRORS: Record<string, string> = {
  '1': 'Wypełnij wszystkie pola.',
  '2': 'Hasło musi mieć minimum 3 znaki.',
  '3': 'Ten adres e-mail jest już zajęty.',
}

export default async function RegisterPage({ searchParams }: { searchParams: { error?: string; success?: string } }) {
  const user = await getSessionUser()
  if (user) redirect('/dashboard')

  const errorMsg = searchParams.error ? ERRORS[searchParams.error] : null
  const success = searchParams.success === '1'

  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ backgroundColor: '#140005' }}>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[700px] h-[700px] rounded-full opacity-80"
          style={{ background: 'radial-gradient(circle, #C8102E 0%, transparent 60%)' }} />
        <div className="absolute top-1/4 -right-24 w-[500px] h-[500px] rounded-full opacity-65"
          style={{ background: 'radial-gradient(circle, #F4600C 0%, transparent 60%)' }} />
        <div className="absolute -bottom-40 -right-16 w-[700px] h-[700px] rounded-full opacity-60"
          style={{ background: 'radial-gradient(circle, #0033A0 0%, transparent 60%)' }} />
        <div className="absolute -bottom-16 left-1/4 w-[350px] h-[350px] rounded-full opacity-50"
          style={{ background: 'radial-gradient(circle, #6B3FA0 0%, transparent 60%)' }} />
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at center, rgba(20,0,5,0.25) 0%, rgba(20,0,5,0.60) 100%)' }} />
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="font-black leading-none"
          style={{ fontSize: '50vw', color: 'rgba(255,255,255,0.025)', letterSpacing: '-0.05em' }}>26</span>
      </div>

      <div className="relative z-10 w-full max-w-sm">
        <div className="rounded-t-3xl overflow-hidden" style={{ height: '5px',
          background: 'linear-gradient(90deg, #C8102E 0%, #F4600C 18%, #FFD700 36%, #7DBB2D 54%, #0033A0 74%, #6B3FA0 100%)' }} />

        <div className="text-center mb-6 mt-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #C8102E 0%, #F4600C 100%)' }}>
            <span className="text-3xl">⚽</span>
          </div>
          <h1 className="font-black text-white text-2xl">Dołącz do typera</h1>
          <p className="text-white/40 text-sm mt-1">Mundial 2026</p>
        </div>

        <div className="rounded-3xl p-7 shadow-2xl border"
          style={{
            backgroundColor: '#fff8fa',
            borderColor: 'rgba(200,16,46,0.18)',
            boxShadow: '0 12px 50px rgba(0,0,0,0.6), 0 0 0 1px rgba(200,16,46,0.12)',
          }}>

          {success ? (
            <div className="text-center py-4 space-y-4">
              <div className="text-5xl">✅</div>
              <h2 className="font-black text-zinc-900 text-lg">Rejestracja wysłana!</h2>
              <p className="text-sm text-zinc-600">
                Twoje konto czeka na aktywację przez admina. Dostaniesz dostęp wkrótce.
              </p>
              <a href="/"
                className="block w-full py-3 rounded-xl font-black text-white text-sm text-center transition-all active:scale-95 shadow-md"
                style={{ background: 'linear-gradient(135deg, #C8102E 0%, #F4600C 100%)' }}>
                Wróć do logowania
              </a>
            </div>
          ) : (
            <form action={registerAction} className="space-y-4">
              <div>
                <label className="block text-xs font-black mb-2 uppercase tracking-widest" style={{ color: '#7a3040' }}>
                  Imię / nick
                </label>
                <input
                  name="name"
                  type="text"
                  placeholder="Jak masz na imię?"
                  autoFocus
                  required
                  style={{ backgroundColor: '#f5edf0', borderColor: '#e0c8d0', color: '#1a0007' }}
                  className="w-full px-4 py-3 rounded-xl border text-center focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder-[#b89aa0]"
                />
              </div>
              <div>
                <label className="block text-xs font-black mb-2 uppercase tracking-widest" style={{ color: '#7a3040' }}>
                  E-mail
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="twoj@email.com"
                  autoComplete="email"
                  required
                  style={{ backgroundColor: '#f5edf0', borderColor: '#e0c8d0', color: '#1a0007' }}
                  className="w-full px-4 py-3 rounded-xl border text-center focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder-[#b89aa0]"
                />
              </div>
              <div>
                <label className="block text-xs font-black mb-2 uppercase tracking-widest" style={{ color: '#7a3040' }}>
                  Hasło
                </label>
                <input
                  name="password"
                  type="password"
                  placeholder="Min. 3 znaki"
                  autoComplete="new-password"
                  required
                  style={{ backgroundColor: '#f5edf0', borderColor: '#e0c8d0', color: '#1a0007' }}
                  className="w-full px-4 py-3 rounded-xl border text-center focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder-[#b89aa0]"
                />
              </div>

              {errorMsg && (
                <div className="rounded-xl px-4 py-2.5 text-sm text-center font-medium"
                  style={{ backgroundColor: '#ffd5d9', color: '#8B0011', border: '1px solid #ffb3bb' }}>
                  {errorMsg}
                </div>
              )}

              <button type="submit"
                className="w-full py-3.5 rounded-xl font-black text-white text-base transition-all active:scale-95 shadow-lg tracking-wide"
                style={{ background: 'linear-gradient(135deg, #C8102E 0%, #F4600C 100%)' }}>
                Zarejestruj się →
              </button>
            </form>
          )}
        </div>

        {!success && (
          <div className="mt-4 text-center">
            <a href="/" className="text-white/40 text-sm hover:text-white/70 transition-colors">
              ← Masz już konto? Zaloguj się
            </a>
          </div>
        )}
      </div>
    </main>
  )
}
