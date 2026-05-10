import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'HIRO AI - AI Content Sales OS',
  description: 'AI Content Sales Operating System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
