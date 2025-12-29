import type React from "react"
import type { Metadata } from "next"
import { Inter, Newsreader } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
})

export const metadata: Metadata = {
  title: "javigil - THE AI PLAYBOOK",
  description: "THE AI PLAYBOOK - Beyond the Hype",
    generator: 'javigil'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${newsreader.variable} font-inter`}>{children}</body>
    </html>
  )
}
