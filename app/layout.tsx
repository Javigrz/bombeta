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
  description: "THE AI PLAYBOOK - Beyond the Hype. Learn how to build with AI, understand the technology, and create real products.",
  generator: 'javigil',
  keywords: ['AI', 'Artificial Intelligence', 'AI Playbook', 'Machine Learning', 'AI Development', 'Tech Education'],
  authors: [{ name: 'javigil' }],
  creator: 'javigil',
  publisher: 'javigil',
  metadataBase: new URL('https://bombetacourse.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'javigil - THE AI PLAYBOOK',
    description: 'THE AI PLAYBOOK - Beyond the Hype. Learn how to build with AI, understand the technology, and create real products.',
    url: 'https://bombetacourse.com',
    siteName: 'javigil - THE AI PLAYBOOK',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'javigil - THE AI PLAYBOOK',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'javigil - THE AI PLAYBOOK',
    description: 'THE AI PLAYBOOK - Beyond the Hype. Learn how to build with AI.',
    creator: '@javigil',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager */}
        <script dangerouslySetInnerHTML={{ __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-KM7KRF66');` }} />
        {/* End Google Tag Manager */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#FF5733" />
        <link rel="icon" href="/browser_tab.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/ios.svg" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.variable} ${newsreader.variable} font-inter`}>
        {/* Google Tag Manager (noscript) */}
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KM7KRF66" height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}></iframe></noscript>
        {/* End Google Tag Manager (noscript) */}
        {children}
      </body>
    </html>
  )
}
