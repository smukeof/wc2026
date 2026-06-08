import { loginAction } from './actions'
import { getSessionUser } from '@/lib/session'
import { redirect } from 'next/navigation'

const EMAIL_ERRORS: Record<string, string> = {
  '1': 'Nieprawidłowy e-mail lub hasło.',
  '2': 'Nieprawidłowe hasło.',
  '4': 'Konto oczekuje na aktywację przez admina.',
}
const CODE_ERRORS: Record<string, string> = {
  '1': 'Nieprawidłowy kod dostępu.',
  '2': 'Nieprawidłowe hasło.',
  '3': 'Hasło musi mieć minimum 3 znaki.',
}

export default async function LoginPage({ searchParams }: { searchParams: { error?: string; mode?: string } }) {
  const user = await getSessionUser()
  if (user) redirect('/dashboard')

  const isCodeMode = searchParams.mode === 'code'
  const errorMsg = searchParams.error
    ? (isCodeMode ? CODE_ERRORS[searchParams.error] : EMAIL_ERRORS[searchParams.error])
    : null

  return (
    <main className="min-h-screen flex items-center justify-center p-4">

      {/* ── KARTA ── */}
      <div className="relative z-10 w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-5 shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #c9a227 0%, #a88520 100%)' }}>
            <span className="text-4xl">⚽</span>
          </div>
          <h1 className="font-black text-white leading-none" style={{ fontSize: '2.8rem', letterSpacing: '-0.04em' }}>
            MUNDIAL
          </h1>
          <p className="font-black leading-none mt-1"
            style={{ fontSize: '3.5rem', letterSpacing: '-0.06em', WebkitTextStroke: '3px #ffffff', color: 'transparent' }}>
            2026
          </p>
          <p className="text-white/50 text-sm mt-3 font-medium tracking-wide">Typer Mistrzostw Świata</p>
        </div>

        {/* Form card */}
        <div className="card rounded-3xl p-7 shadow-2xl border"
          style={{ borderColor: 'rgba(201,162,39,0.20)', boxShadow: '0 12px 50px rgba(0,0,0,0.6)' }}>

          {!isCodeMode ? (
            /* ── EMAIL LOGIN ── */
            <form action={loginAction} className="space-y-4">
              <input type="hidden" name="loginType" value="email" />
              <div>
                <label className="block text-xs font-black mb-2 uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  E-mail
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="twoj@email.com"
                  autoComplete="email"
                  autoFocus
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
                  placeholder="Twoje hasło"
                  autoComplete="current-password"
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
                Zaloguj się →
              </button>
            </form>
          ) : (
            /* ── CODE LOGIN ── */
            <form action={loginAction} className="space-y-4">
              <div>
                <label className="block text-xs font-black mb-2 uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  Kod dostępu
                </label>
                <input
                  name="code"
                  type="text"
                  placeholder="np. MARCEL26"
                  autoComplete="off"
                  autoFocus
                  style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)', color: '#f0eef5' }}
                  className="w-full px-4 py-3 rounded-xl border font-mono tracking-widest text-center text-lg uppercase focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder-white/25"
                />
              </div>
              <div>
                <label className="block text-xs font-black mb-2 uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  Hasło
                </label>
                <input
                  name="password"
                  type="password"
                  placeholder="Twoje hasło"
                  autoComplete="current-password"
                  style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)', color: '#f0eef5' }}
                  className="w-full px-4 py-3 rounded-xl border text-center focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder-white/25"
                />
                <p className="text-xs mt-1.5 text-center" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  Pierwsze logowanie? Wpisz kod i ustaw swoje hasło.
                </p>
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
                Zaloguj się →
              </button>
            </form>
          )}
        </div>

        <div className="mt-4 flex flex-col items-center gap-2">
          {!isCodeMode ? (
            <>
              <a href="/register"
                className="text-white/60 text-sm font-medium hover:text-white transition-colors">
                Nie masz konta? <span className="font-black" style={{ color: '#c9a227' }}>Zarejestruj się →</span>
              </a>
              <a href="/?mode=code" className="text-white/25 text-xs hover:text-white/50 transition-colors mt-1">
                Admin / kod dostępu
              </a>
            </>
          ) : (
            <a href="/" className="text-white/40 text-xs hover:text-white/70 transition-colors">
              ← Wróć do logowania e-mailem
            </a>
          )}
        </div>
      </div>
    </main>
  )
}
