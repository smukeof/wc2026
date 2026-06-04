import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Typer Mundial 2026',
  description: 'Typuj mecze Mistrzostw Świata 2026',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var t = localStorage.getItem('theme');
                // Default to dark (FIFA theme) unless user explicitly chose light
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
      <body>{children}</body>
    </html>
  )
}
