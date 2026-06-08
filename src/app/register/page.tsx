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
    <main className="min-h-screen flex items-center justify-center p-4">

      <div className="relative z-10 w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #c9a227 0%, #a88520 100%)' }}>
            <span className="text-3xl">⚽</span>
          </div>
          <h1 className="font-black text-white text-2xl">Dołącz do typera</h1>
          <p className="text-white/40 text-sm mt-1">Mundial 2026</p>
        </div>

        <div className="card rounded-3xl p-7 shadow-2xl border"
          style={{ borderColor: 'rgba(201,162,39,0.20)', boxShadow: '0 12px 50px rgba(0,0,0,0.6)' }}>

          {success ? (
            <div className="text-center py-4 space-y-4">
              <div className="text-5xl">✅</div>
              <h2 className="font-black text-lg" style={{ color: '#f0eef5' }}>Rejestracja wysłana!</h2>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.50)' }}>
                Twoje konto czeka na aktywację przez admina. Dostaniesz dostęp wkrótce.
              </p>
              <a href="/"
                className="block w-full py-3 rounded-xl font-black text-sm text-center transition-all active:scale-95 shadow-md"
                style={{ background: 'linear-gradient(135deg, #c9a227 0%, #a88520 100%)', color: '#0d0a1a' }}>
                Wróć do logowania
              </a>
            </div>
          ) : (
            <form action={registerAction} className="space-y-4">
              <div>
                <label className="block text-xs font-black mb-2 uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  Imię / nick
                </label>
                <input
                  name="name"
                  type="text"
                  placeholder="Jak masz na imię?"
                  autoFocus
                  required
                  style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)', color: '#f0eef5' }}
                  className="w-full px-4 py-3 rounded-xl border text-center focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder-white/25"
                />
              </div>
              <div>
                <label className="block text-xs font-black mb-2 uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  E-mail
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="twoj@email.com"
                  autoComplete="email"
                  required
                  style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)', color: '#f0eef5' }}
                  className="w-full px-4 py-3 rounded-xl border text-center focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder-white/25"
                />
              </div>
              <div>
                <label className="block text-xs font-black mb-2 uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  Hasło
                </label>
                <input
                  name="password"
                  type="password"
                  placeholder="Min. 3 znaki"
                  autoComplete="new-password"
                  required
                  style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)', color: '#f0eef5' }}
                  className="w-full px-4 py-3 rounded-xl border text-center focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder-white/25"
                />
              </div>

              {errorMsg && (
                <div className="rounded-xl px-4 py-2.5 text-sm text-center font-medium"
                  style={{ backgroundColor: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.30)' }}>
                  {errorMsg}
                </div>
              )}

              <button type="submit"
                className="w-full py-3.5 rounded-xl font-black text-base transition-all active:scale-95 shadow-lg tracking-wide"
                style={{ background: 'linear-gradient(135deg, #c9a227 0%, #a88520 100%)', color: '#0d0a1a' }}>
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
