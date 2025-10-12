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
      <body>
        {/* Elfsight Website Translator | KrishiMitra */}
        <script src="https://elfsightcdn.com/platform.js" async></script>
        <div className="elfsight-app-f3d330dc-9294-4906-be07-8bd61ed27e36" data-elfsight-app-lazy></div>
        {children}
      </body>
    </html>
  )
}
