'use client'

import { useState, useEffect } from 'react'

const TILE = 160
const SEED = 2026

function seededRng(seed: number) {
  let s = seed
  return () => {
    s ^= s << 13
    s ^= s >> 17
    s ^= s << 5
    return (s >>> 0) / 4294967296
  }
}

function buildGrid(images: string[], cols: number, rows: number): string[] {
  const rng = seededRng(SEED)
  const count = cols * rows
  const result: string[] = []
  for (let i = 0; i < count; i++) {
    const col = i % cols
    const row = Math.floor(i / cols)
    const left = col > 0 ? result[i - 1] : null
    const top = row > 0 ? result[i - cols] : null
    const forbidden = [left, top].filter((x): x is string => x !== null)
    const available = images.filter((img) => !forbidden.includes(img))
    const pool = available.length > 0 ? available : images
    result.push(pool[Math.floor(rng() * pool.length)])
  }
  return result
}

export default function GlobalBackground({
  cr7Images,
  messiImages,
}: {
  cr7Images: string[]
  messiImages: string[]
}) {
  const [grid, setGrid] = useState<string[]>([])
  const [cols, setCols] = useState(10)
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const rebuild = () => {
      const dark = document.documentElement.classList.contains('dark')
      const images = dark ? messiImages : cr7Images
      const c = Math.ceil(window.innerWidth / TILE) + 1
      const r = Math.ceil(window.innerHeight / TILE) + 1
      setIsDark(dark)
      setCols(c)
      setGrid(buildGrid(images, c, r))
    }

    rebuild()
    window.addEventListener('resize', rebuild)

    const observer = new MutationObserver(rebuild)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => {
      window.removeEventListener('resize', rebuild)
      observer.disconnect()
    }
  }, [cr7Images, messiImages])

  const overlay = isDark ? 'rgba(20,0,5,0.62)' : 'rgba(245,238,240,0.72)'

  return (
    <>
      {/* Mozaika zdjęć */}
      <div
        className="fixed inset-0 overflow-hidden"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, ${TILE}px)`,
          zIndex: 0,
        }}
      >
        {grid.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            style={{ width: TILE, height: TILE, objectFit: 'cover', display: 'block' }}
          />
        ))}
      </div>
      {/* Przyciemniony overlay */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 1, backgroundColor: overlay, transition: 'background-color 0.4s' }}
      />
    </>
  )
}
