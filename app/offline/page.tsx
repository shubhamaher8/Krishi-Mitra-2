'use client'

import { WifiOff, Leaf, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function OfflinePage() {
  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-green-500/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-green-400/5 rounded-full blur-3xl animate-float"></div>
      </div>

      <div className="max-w-md w-full text-center animate-fade-in-up">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-blue animate-pulse-green">
            <Leaf className="h-9 w-9 text-white animate-wave" />
          </div>
        </div>

        {/* Main Card */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <WifiOff className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              You're Offline
            </CardTitle>
            <CardDescription className="text-gray-600">
              No internet connection detected. Some features may not be available.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Offline features available */}
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h3 className="font-semibold text-green-800 mb-2">Available Offline:</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• View cached crop recommendations</li>
                <li>• Browse previous analyses</li>
                <li>• Access saved farming tips</li>
                <li>• View historical data</li>
              </ul>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleRefresh}
                className="w-full bg-accent hover:bg-accent/90 text-white"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              
              <Link href="/" className="block">
                <Button variant="outline" className="w-full">
                  <Home className="h-4 w-4 mr-2" />
                  Go to Homepage
                </Button>
              </Link>
            </div>

            {/* Tips */}
            <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
              <p className="font-medium mb-1">Tips:</p>
              <p>• Check your internet connection</p>
              <p>• Try refreshing the page</p>
              <p>• Some content may be available from cache</p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-xs text-gray-500 mt-6">
          KrishiMitra 2.0 - Working even when you're offline
        </p>
      </div>
    </div>
  )
}