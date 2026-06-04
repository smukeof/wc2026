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
    <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ backgroundColor: '#140005' }}>

      {/* ── TĘCZOWE BLASKI FIFA 2026 ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[700px] h-[700px] rounded-full opacity-80"
          style={{ background: 'radial-gradient(circle, #C8102E 0%, transparent 60%)' }} />
        <div className="absolute top-1/4 -right-24 w-[500px] h-[500px] rounded-full opacity-65"
          style={{ background: 'radial-gradient(circle, #F4600C 0%, transparent 60%)' }} />
        <div className="absolute -bottom-40 -right-16 w-[700px] h-[700px] rounded-full opacity-60"
          style={{ background: 'radial-gradient(circle, #0033A0 0%, transparent 60%)' }} />
        <div className="absolute -bottom-16 left-1/4 w-[350px] h-[350px] rounded-full opacity-50"
          style={{ background: 'radial-gradient(circle, #6B3FA0 0%, transparent 60%)' }} />
        <div className="absolute top-0 right-1/3 w-[250px] h-[250px] rounded-full opacity-40"
          style={{ background: 'radial-gradient(circle, #FFD700 0%, transparent 60%)' }} />
        <div className="absolute top-1/2 -left-16 w-[320px] h-[320px] rounded-full opacity-40"
          style={{ background: 'radial-gradient(circle, #7DBB2D 0%, transparent 60%)' }} />
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at center, rgba(20,0,5,0.25) 0%, rgba(20,0,5,0.60) 100%)' }} />
      </div>

      {/* ── WATERMARK "26" ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="font-black leading-none"
          style={{ fontSize: '50vw', color: 'rgba(255,255,255,0.025)', letterSpacing: '-0.05em' }}>26</span>
      </div>

      {/* ── KARTA ── */}
      <div className="relative z-10 w-full max-w-sm">

        <div className="rounded-t-3xl overflow-hidden mb-0" style={{ height: '5px',
          background: 'linear-gradient(90deg, #C8102E 0%, #F4600C 18%, #FFD700 36%, #7DBB2D 54%, #0033A0 74%, #6B3FA0 100%)' }} />

        <div className="text-center mb-8 mt-3">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-5 shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #C8102E 0%, #F4600C 100%)' }}>
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

        <div className="rounded-3xl p-7 shadow-2xl border"
          style={{
            backgroundColor: '#fff8fa',
            borderColor: 'rgba(200,16,46,0.18)',
            boxShadow: '0 12px 50px rgba(0,0,0,0.6), 0 0 0 1px rgba(200,16,46,0.12)',
          }}>

          {!isCodeMode ? (
            /* ── EMAIL LOGIN ── */
            <form action={loginAction} className="space-y-4">
              <input type="hidden" name="loginType" value="email" />
              <div>
                <label className="block text-xs font-black mb-2 uppercase tracking-widest" style={{ color: '#7a3040' }}>
                  E-mail
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="twoj@email.com"
                  autoComplete="email"
                  autoFocus
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
                  placeholder="Twoje hasło"
                  autoComplete="current-password"
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
                Zaloguj się →
              </button>
            </form>
          ) : (
            /* ── CODE LOGIN ── */
            <form action={loginAction} className="space-y-4">
              <div>
                <label className="block text-xs font-black mb-2 uppercase tracking-widest" style={{ color: '#7a3040' }}>
                  Kod dostępu
                </label>
                <input
                  name="code"
                  type="text"
                  placeholder="np. MARCEL26"
                  autoComplete="off"
                  autoFocus
                  style={{ backgroundColor: '#f5edf0', borderColor: '#e0c8d0', color: '#1a0007' }}
                  className="w-full px-4 py-3 rounded-xl border font-mono tracking-widest text-center text-lg uppercase focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder-[#b89aa0]"
                />
              </div>
              <div>
                <label className="block text-xs font-black mb-2 uppercase tracking-widest" style={{ color: '#7a3040' }}>
                  Hasło
                </label>
                <input
                  name="password"
                  type="password"
                  placeholder="Twoje hasło"
                  autoComplete="current-password"
                  style={{ backgroundColor: '#f5edf0', borderColor: '#e0c8d0', color: '#1a0007' }}
                  className="w-full px-4 py-3 rounded-xl border text-center focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder-[#b89aa0]"
                />
                <p className="text-xs mt-1.5 text-center" style={{ color: '#a87080' }}>
                  Pierwsze logowanie? Wpisz kod i ustaw swoje hasło.
                </p>
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
                Nie masz konta? <span className="font-black" style={{ color: '#F4600C' }}>Zarejestruj się →</span>
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
