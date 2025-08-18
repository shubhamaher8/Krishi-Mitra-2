"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Leaf } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Explore", href: "/explore" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ]

  // Check auth state on mount and on changes
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession()
      setIsLoggedIn(!!data.session)
    }
    getSession()
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session)
    })
    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 shadow-lg">
      <div className="container flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center space-x-1.5 sm:space-x-2 hover:scale-105 transition-transform duration-300"
        >
          <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent-blue shadow-md">
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
          {!isLoggedIn ? (
            <>
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
            </>
          ) : (
            <Button
              size="sm"
              className="bg-black text-white hover:bg-gray-800 transition-colors duration-300 text-sm px-4"
              onClick={handleLogout}
            >
              Logout
            </Button>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 bg-white/20 backdrop-blur-sm border border-white/20 hover:bg-white/30 hover:scale-105 transition-all duration-300 shadow-md"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[90vw] max-w-xs border-b border-white/10 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/65 shadow-lg rounded-3xl"
          >
            <div className="flex flex-col space-y-6 mt-16">
              <div className="flex flex-col space-y-3 px-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-base font-medium transition-all duration-300 hover:text-accent py-2 px-4 rounded-lg hover:bg-gradient-to-r hover:from-accent/10 hover:to-accent-blue/10 hover:shadow-md hover:scale-105 backdrop-blur-sm border border-transparent hover:border-accent/20"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="flex flex-col space-y-3 px-4 border-t border-white/20">
                {!isLoggedIn ? (
                  <>
                    <Button
                      asChild
                      className="bg-gradient-to-r from-black to-gray-800 text-white hover:from-gray-800 hover:to-black h-12 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 backdrop-blur-sm"
                    >
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        Login
                      </Link>
                    </Button>
                    <Button
                      asChild
                      className="bg-gradient-to-r from-black to-gray-800 text-white hover:from-gray-800 hover:to-black h-12 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 backdrop-blur-sm"
                    >
                      <Link href="/register" onClick={() => setIsOpen(false)}>
                        Get Started
                      </Link>
                    </Button>
                  </>
                ) : (
                  <Button
                    className="bg-gradient-to-r from-black to-gray-800 text-white hover:from-gray-800 hover:to-black h-12 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 backdrop-blur-sm"
                    onClick={() => {
                      handleLogout()
                      setIsOpen(false)
                    }}
                  >
                    Logout
                  </Button>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
