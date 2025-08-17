import Link from "next/link"
import { Leaf, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
                <Leaf className="h-5 w-5 text-accent-foreground" />
              </div>
              <span className="text-xl font-bold">KrishiMitra 2.0</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Empowering farmers with AI-driven insights for better crop management, price predictions, and disease
              detection.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-accent transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/explore" className="text-muted-foreground hover:text-accent transition-colors">
                  Explore Features
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-muted-foreground hover:text-accent transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-accent transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* AI Features */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">AI Features</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/dashboard?tab=crop-recommendations"
                  className="text-muted-foreground hover:text-accent transition-colors cursor-pointer"
                >
                  Crop Recommendations
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard?tab=price-predictions"
                  className="text-muted-foreground hover:text-accent transition-colors cursor-pointer"
                >
                  Price Predictions
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard?tab=disease-detection"
                  className="text-muted-foreground hover:text-accent transition-colors cursor-pointer"
                >
                  Disease Detection
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a
                  href="mailto:support@krishimitra.com"
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  support@krishimitra.com
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a href="tel:+919876543210" className="text-muted-foreground hover:text-accent transition-colors">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <a
                  href="https://maps.google.com/?q=New+Delhi,+India"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  New Delhi, India
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 KrishiMitra 2.0. All rights reserved. Built with AI for farmers.</p>
        </div>
      </div>
    </footer>
  )
}
