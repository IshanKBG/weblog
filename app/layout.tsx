import './tailwind.css'
import { Analytics } from "@vercel/analytics/react"
export const metadata = {
  title: 'IshanKBG',
  description: 'My public journal',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
