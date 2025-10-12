'use client'

import { useState, useEffect } from 'react'
import { Wifi, WifiOff } from 'lucide-react'

interface OfflineDetectorProps {
  children?: React.ReactNode
}

export function OfflineDetector({ children }: OfflineDetectorProps) {
  const [isOnline, setIsOnline] = useState(true)
  const [showOfflineMessage, setShowOfflineMessage] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setShowOfflineMessage(false)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowOfflineMessage(true)
    }

    // Set initial state
    setIsOnline(navigator.onLine)

    // Add event listeners
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <>
      {children}
      
      {/* Offline Banner */}
      {showOfflineMessage && !isOnline && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white p-3 text-center animate-slide-down">
          <div className="flex items-center justify-center gap-2">
            <WifiOff className="h-4 w-4" />
            <span className="text-sm font-medium">
              You're offline. Some features may not be available.
            </span>
          </div>
        </div>
      )}

      {/* Back Online Banner */}
      {isOnline && showOfflineMessage && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-green-600 text-white p-3 text-center animate-slide-down">
          <div className="flex items-center justify-center gap-2">
            <Wifi className="h-4 w-4" />
            <span className="text-sm font-medium">
              You're back online!
            </span>
          </div>
        </div>
      )}
    </>
  )
}

// Hook for checking online status
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    setIsOnline(navigator.onLine)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOnline
}