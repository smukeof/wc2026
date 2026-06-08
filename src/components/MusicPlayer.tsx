'use client'

import { useState, useEffect, useRef } from 'react'

const TRACKS = ['/music/track1.mp3', '/music/track2.mp3']

export default function MusicPlayer() {
  const [on, setOn] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const idxRef = useRef(Math.random() < 0.5 ? 0 : 1)

  useEffect(() => {
    const audio = new Audio(TRACKS[idxRef.current])
    audio.volume = 0.35
    audioRef.current = audio

    const next = () => {
      idxRef.current = idxRef.current === 0 ? 1 : 0
      audio.src = TRACKS[idxRef.current]
      audio.play()
    }
    audio.addEventListener('ended', next)

    // Odpal przy pierwszej interakcji użytkownika
    const startOnInteraction = () => {
      audio.play().then(() => {
        setOn(true)
        document.removeEventListener('click', startOnInteraction)
        document.removeEventListener('keydown', startOnInteraction)
      }).catch(() => {})
    }
    document.addEventListener('click', startOnInteraction)
    document.addEventListener('keydown', startOnInteraction)

    return () => {
      audio.removeEventListener('ended', next)
      document.removeEventListener('click', startOnInteraction)
      document.removeEventListener('keydown', startOnInteraction)
      audio.pause()
    }
  }, [])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (on) {
      audio.pause()
      setOn(false)
    } else {
      audio.play()
      setOn(true)
    }
  }

  return (
    <button
      onClick={toggle}
      title={on ? 'Wycisz muzykę' : 'Włącz muzykę'}
      className="text-sm px-2 py-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white/70 transition-colors shrink-0"
    >
      {on ? '🔊' : '🔇'}
    </button>
  )
}
