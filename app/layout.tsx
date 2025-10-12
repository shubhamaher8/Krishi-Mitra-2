import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { OfflineDetector } from "@/components/offline-detector"
import { InstallPrompt } from "@/components/install-prompt"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "KrishiMitra 2.0 - AI-Powered Agriculture Solutions",
  description: "Advanced AI tools for crop recommendations, price predictions, and disease detection",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.png",
    apple: "/icons/apple-touch-icon-180x180.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "KrishiMitra 2.0",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "KrishiMitra 2.0",
    title: "KrishiMitra 2.0 - AI-Powered Agriculture Solutions",
    description: "Advanced AI tools for crop recommendations, price predictions, and disease detection",
    images: [
      {
        url: "/Homepage.png",
        width: 1920,
        height: 1080,
        alt: "KrishiMitra Homepage",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KrishiMitra 2.0 - AI-Powered Agriculture Solutions",
    description: "Advanced AI tools for crop recommendations, price predictions, and disease detection",
    images: ["/Homepage.png"],
  },
}

export const viewport = {
  themeColor: "#22c55e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <head>
        {/* PWA Meta Tags */}
        <meta name="application-name" content="KrishiMitra 2.0" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="KrishiMitra 2.0" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#22c55e" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon-180x180.svg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon-180x180.svg" />
        
        {/* PWA Icons */}
        <link rel="icon" type="image/svg+xml" sizes="32x32" href="/icons/icon-144x144.svg" />
        <link rel="icon" type="image/svg+xml" sizes="16x16" href="/icons/icon-144x144.svg" />
        <link rel="mask-icon" href="/icons/maskable-icon-512x512.svg" color="#22c55e" />
        
        {/* Splash Screen for iOS */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-touch-fullscreen" content="yes" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/icons/icon-192x192.svg" as="image" type="image/svg+xml" />
      </head>
      <body>
        <OfflineDetector>
          {/* Elfsight Website Translator | KrishiMitra */}
          <script src="https://elfsightcdn.com/platform.js" async></script>
          <div className="elfsight-app-f3d330dc-9294-4906-be07-8bd61ed27e36" data-elfsight-app-lazy></div>
          {children}
          <InstallPrompt />
        </OfflineDetector>
      </body>
    </html>
  )
}
