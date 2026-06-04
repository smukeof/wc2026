'use client'

import { useState, useEffect, useRef } from 'react'

type Msg = { id: number; content: string; createdAt: string; user: { id: number; name: string } }

function fmt(iso: string) {
  return new Intl.DateTimeFormat('pl-PL', { hour: '2-digit', minute: '2-digit' }).format(new Date(iso))
}

export default function ChatClient({ initialMessages, currentUserId }: { initialMessages: Msg[]; currentUserId: number }) {
  const [messages, setMessages] = useState<Msg[]>(initialMessages)
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollBottom = () => bottomRef.current?.scrollIntoView({ behavior: 'smooth' })

  useEffect(() => {
    scrollBottom()
    const id = setInterval(async () => {
      try {
        const res = await fetch('/api/messages')
        if (res.ok) { setMessages(await res.json()); scrollBottom() }
      } catch {}
    }, 3000)
    return () => clearInterval(id)
  }, [])

  async function send() {
    const content = draft.trim()
    if (!content || sending) return
    setSending(true)
    setDraft('')
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })
      if (res.ok) {
        const msg = await res.json()
        setMessages((prev) => [...prev, msg])
        setTimeout(scrollBottom, 50)
      }
    } finally {
      setSending(false)
      inputRef.current?.focus()
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-2 pb-2">
        {messages.length === 0 && (
          <div className="text-center text-white/30 text-sm mt-8">Brak wiadomości. Napisz pierwszy! 👋</div>
        )}
        {messages.map((m) => {
          const isMe = m.user.id === currentUserId
          return (
            <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] flex flex-col gap-0.5 ${isMe ? 'items-end' : 'items-start'}`}>
                {!isMe && <span className="text-xs text-white/40 px-1">{m.user.name}</span>}
                <div className={`px-3 py-2 rounded-2xl text-sm shadow-sm ${
                  isMe
                    ? 'text-white rounded-br-sm'
                    : 'card border border-zinc-200/60 text-zinc-900 rounded-bl-sm'
                }`}
                style={isMe ? { background: 'linear-gradient(135deg, #C8102E 0%, #F4600C 100%)' } : undefined}>
                  {m.content}
                </div>
                <span className="text-xs text-white/25 px-1">{fmt(m.createdAt)}</span>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      <div className="pt-3 border-t border-white/10 flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder="Napisz wiadomość…"
          maxLength={500}
          style={{ backgroundColor: '#fff8fa', borderColor: 'rgba(200,16,46,0.15)', color: '#1a0007' }}
          className="flex-1 px-4 py-2.5 rounded-xl border placeholder-[#b89aa0] focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm shadow-sm"
        />
        <button onClick={send} disabled={!draft.trim() || sending}
          className="px-4 py-2.5 disabled:opacity-40 text-white font-black rounded-xl transition-all text-sm shadow-md active:scale-95"
          style={{ background: 'linear-gradient(135deg, #C8102E 0%, #F4600C 100%)' }}>
          Wyślij
        </button>
      </div>
    </div>
  )
}
