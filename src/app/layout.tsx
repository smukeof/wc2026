import type { Metadata } from 'next'
import './globals.css'
import GlobalBackground from '@/components/GlobalBackground'
import fs from 'fs'
import path from 'path'

export const metadata: Metadata = {
  title: 'Typer Mundial 2026',
  description: 'Typuj mecze Mistrzostw Świata 2026',
}

function getImages(folder: string): string[] {
  try {
    const dir = path.join(process.cwd(), 'public/players', folder)
    return fs
      .readdirSync(dir)
      .filter((f) => /\.(jpg|jpeg|webp|avif|png)$/i.test(f))
      .map((f) => `/players/${folder}/${f}`)
  } catch {
    return []
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const cr7Images = getImages('cr7')
  const messiImages = getImages('messi')

  return (
    <html lang="pl" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var t = localStorage.getItem('theme');
                if (t === 'light') {
                  document.documentElement.classList.remove('dark');
                } else {
                  document.documentElement.classList.add('dark');
                }
              })()
            `,
          }}
        />
      </head>
      <body>
        <GlobalBackground cr7Images={cr7Images} messiImages={messiImages} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          {children}
        </div>
      </body>
    </html>
  )
}
