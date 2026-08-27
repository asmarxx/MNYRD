import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MNYRD | مَن يورّد؟',
  description: 'اسأل أهل المشتريات ووصل لمورد مجرّب أسرع.'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  )
}
