import type { Metadata } from 'next'
import { Inter, Cinzel } from 'next/font/google'
import MagicCursor from '@/components/MagicCursor'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })
const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  weight: ['700', '900'],
})

export const metadata: Metadata = {
  title: 'Wandpack — Smart Packing Assistant',
  description: 'Your journey, perfectly packed',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${cinzel.variable} min-h-screen`}>
        <div className="stars" aria-hidden="true" />
        <MagicCursor />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  )
}
