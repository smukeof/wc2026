'use client'

import { useState, useEffect } from 'react'

const TILE = 160

function buildGrid(images: string[], cols: number, rows: number): string[] {
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
    result.push(pool[Math.floor(Math.random() * pool.length)])
  }
  return result
}

export default function PhotoMosaic({ images }: { images: string[] }) {
  const [grid, setGrid] = useState<string[]>([])
  const [cols, setCols] = useState(8)

  useEffect(() => {
    const rebuild = () => {
      const c = Math.ceil(window.innerWidth / TILE) + 1
      const r = Math.ceil(window.innerHeight / TILE) + 1
      setCols(c)
      setGrid(buildGrid(images, c, r))
    }

    rebuild()
    window.addEventListener('resize', rebuild)

    // Reshuffle on every theme toggle (html class change)
    const observer = new MutationObserver(rebuild)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => {
      window.removeEventListener('resize', rebuild)
      observer.disconnect()
    }
  }, [images])

  return (
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
  )
}
