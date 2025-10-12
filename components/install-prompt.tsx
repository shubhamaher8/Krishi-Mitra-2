'use client'

import { useState, useEffect } from 'react'
import { Download, X, Smartphone, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    const isIOSInstalled = (window.navigator as any).standalone === true
    
    if (isStandalone || isIOSInstalled) {
      setIsInstalled(true)
      return
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      
      // Show install prompt after a delay (user has been on site for a bit)
      setTimeout(() => {
        const hasShownPrompt = localStorage.getItem('pwa-install-prompt-shown')
        const hasDeclined = localStorage.getItem('pwa-install-declined')
        
        if (!hasShownPrompt && !hasDeclined) {
          setShowInstallPrompt(true)
        }
      }, 2000) // Show after 2 seconds
    }

    // Listen for successful installation
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowInstallPrompt(false)
      setDeferredPrompt(null)
      localStorage.setItem('pwa-installed', 'true')
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    // Show the install prompt
    deferredPrompt.prompt()

    // Wait for user response
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      localStorage.setItem('pwa-install-accepted', 'true')
    } else {
      localStorage.setItem('pwa-install-declined', 'true')
    }

    setDeferredPrompt(null)
    setShowInstallPrompt(false)
    localStorage.setItem('pwa-install-prompt-shown', 'true')
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
    localStorage.setItem('pwa-install-prompt-shown', 'true')
    localStorage.setItem('pwa-install-declined', 'true')
  }

  // Don't show if already installed or no prompt available
  if (isInstalled || !showInstallPrompt || !deferredPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-fade-in-up md:left-auto md:right-4 md:w-96">
      <Card className="border-accent shadow-2xl bg-white/95 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-accent to-accent-blue rounded-lg">
                <Download className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Install KrishiMitra</CardTitle>
                <CardDescription className="text-sm">
                  Get the full app experience
                </CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-0 space-y-4">
          <div className="text-sm text-gray-600">
            Install KrishiMitra for faster access, offline functionality, and a better mobile experience.
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2 text-gray-600">
              <Smartphone className="h-4 w-4 text-accent" />
              <span>Mobile optimized</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Monitor className="h-4 w-4 text-accent-blue" />
              <span>Works offline</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleInstallClick}
              className="bg-gradient-to-r from-accent to-accent-blue hover:from-accent/90 hover:to-accent-blue/90 text-white px-6"
              size="sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Install App
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Hook for manual install trigger
export function useInstallPrompt() {
  const [canInstall, setCanInstall] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setCanInstall(true)
    }

    const handleAppInstalled = () => {
      setCanInstall(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const promptInstall = async () => {
    if (!deferredPrompt) return false

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    setDeferredPrompt(null)
    setCanInstall(false)
    
    return outcome === 'accepted'
  }

  return { canInstall, promptInstall }
}