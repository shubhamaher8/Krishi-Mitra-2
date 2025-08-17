"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Leaf } from "lucide-react"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Explore", href: "/explore" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ]

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 shadow-lg">
      <div className="container flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-1.5 sm:space-x-2">
          <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent-blue">
            <Leaf className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-accent to-accent-blue bg-clip-text text-transparent">
            KrishiMitra 2.0
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium transition-colors hover:text-accent px-2 py-1 rounded-md hover:bg-accent/10"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
          <Button
            asChild
            size="sm"
            className="bg-black text-white hover:bg-gray-800 transition-colors duration-300 text-sm px-4"
          >
            <Link href="/login">Login</Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="bg-black text-white hover:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 text-sm px-4"
          >
            <Link href="/register">Get Started</Link>
          </Button>
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] sm:w-[320px] px-4">
            <div className="flex flex-col space-y-6 mt-8">
              <div className="flex flex-col space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-lg font-medium transition-colors hover:text-accent py-2 px-3 rounded-md hover:bg-accent/10 -mx-3"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="flex flex-col space-y-3 pt-6 border-t">
                <Button asChild className="bg-black text-white hover:bg-gray-800 h-11">
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    Login
                  </Link>
                </Button>
                <Button asChild className="bg-black text-white hover:bg-gray-800 h-11">
                  <Link href="/register" onClick={() => setIsOpen(false)}>
                    Get Started
                  </Link>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
