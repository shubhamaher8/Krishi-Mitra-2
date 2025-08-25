import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "KrishiMitra 2.0 - AI-Powered Agriculture Solutions",
  description: "Advanced AI tools for crop recommendations, price predictions, and disease detection",
  icons: {
    icon: "/favicon.png",
  },
}

export const viewport = {
  themeColor: "#22c55e", 
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body>{children}</body>
    </html>
  )
}
