"use client"

import type React from "react"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Leaf, Eye, EyeOff, ArrowRight, CheckCircle, Sprout, Sun, Droplets, Wind } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter() // Add this line
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    farmSize: "",
    location: "",
    primaryCrop: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!")
      return
    }

    if (!formData.agreeToTerms) {
      alert("Please agree to the terms and conditions")
      return
    }

    setIsLoading(true)

    // Supabase Auth sign up
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          firstName: formData.firstName,
          phone: formData.phone,
        },
      },
    })

    setIsLoading(false)

    // If registration is successful, insert profile data into users table
    if (!error && data?.user?.id) {
      await insertUserProfile(data.user.id)
    }

    if (error) {
      alert(error.message)
      return
    }

    // Redirect to dashboard after successful registration
    router.push("/dashboard")
  }

  // Helper to insert user profile data into users table
  async function insertUserProfile(userId: string) {
    const { error } = await supabase.from("users").insert([
      {
        id: userId,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        farm_size: formData.farmSize,
        location: formData.location,
        primary_crop: formData.primaryCrop,
      },
    ])
    if (error) {
      // Optionally handle error (e.g., show notification)
      console.error("Error saving user profile:", error.message)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        {/* Floating farming elements */}
        <div className="absolute top-20 left-10 w-8 h-8 text-green-500/30 animate-float">
          <Sprout className="w-full h-full" />
        </div>
        <div
          className="absolute top-40 right-20 w-6 h-6 text-yellow-400/40 animate-float"
          style={{ animationDelay: "1s" }}
        >
          <Sun className="w-full h-full" />
        </div>
        <div
          className="absolute top-60 left-1/4 w-5 h-5 text-blue-400/30 animate-float"
          style={{ animationDelay: "2s" }}
        >
          <Droplets className="w-full h-full" />
        </div>
        <div
          className="absolute bottom-40 right-1/3 w-7 h-7 text-green-400/25 animate-float"
          style={{ animationDelay: "0.5s" }}
        >
          <Wind className="w-full h-full" />
        </div>
        <div className="absolute bottom-20 left-10 w-10 h-10 text-green-600/20 animate-grow">
          <Leaf className="w-full h-full" />
        </div>

        {/* Additional farming animations */}
        <div
          className="absolute top-1/3 left-1/2 w-6 h-6 text-green-500/25 animate-bounce"
          style={{ animationDelay: "3s" }}
        >
          <Sprout className="w-full h-full" />
        </div>
        <div
          className="absolute bottom-1/3 right-10 w-8 h-8 text-yellow-500/30 animate-pulse"
          style={{ animationDelay: "1.5s" }}
        >
          <Sun className="w-full h-full" />
        </div>
        <div
          className="absolute top-1/2 right-1/4 w-4 h-4 text-blue-500/35 animate-ping"
          style={{ animationDelay: "2.5s" }}
        >
          <Droplets className="w-full h-full" />
        </div>

        {/* Animated background gradients */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-green-400/3 rounded-full blur-2xl animate-float"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-green-500/3 to-green-400/3 rounded-full blur-3xl animate-spin-slow"></div>
        </div>
      </div>

      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4 pt-20">
        <div className="w-full max-w-2xl animate-fade-in-up">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center space-x-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                <Leaf className="h-6 w-6 text-accent-foreground" />
              </div>
              <span className="text-2xl font-bold">KrishiMitra 2.0</span>
            </Link>
            <h1 className="text-2xl font-bold mb-2">Join KrishiMitra</h1>
            <p className="text-muted-foreground">Create your account and start your AI-powered farming journey</p>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-xl text-center">Create Account</CardTitle>
              <CardDescription className="text-center">Fill in your details to get started</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                </div>

                {/* Contact Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="farmer@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                </div>

                {/* Farm Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="farmSize">Farm Size (in acres)</Label>
                    <Input
                      id="farmSize"
                      type="number"
                      min={0}
                      step={1}
                      placeholder="Enter farm size"
                      value={formData.farmSize}
                      onChange={(e) => handleInputChange("farmSize", e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="City, State"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                </div>

                {/* Primary Crop */}
                <div className="space-y-2">
                  <Label htmlFor="primaryCrop">Primary Crop</Label>
                  <Select onValueChange={(value) => handleInputChange("primaryCrop", value)}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select your main crop" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wheat">Wheat</SelectItem>
                      <SelectItem value="rice">Rice</SelectItem>
                      <SelectItem value="corn">Corn</SelectItem>
                      <SelectItem value="cotton">Cotton</SelectItem>
                      <SelectItem value="sugarcane">Sugarcane</SelectItem>
                      <SelectItem value="vegetables">Vegetables</SelectItem>
                      <SelectItem value="fruits">Fruits</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        required
                        className="h-11 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        required
                        className="h-11 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Password Requirements */}
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Password must contain:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="h-3 w-3 text-accent" />
                      <span>At least 8 characters</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="h-3 w-3 text-accent" />
                      <span>One uppercase letter</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="h-3 w-3 text-accent" />
                      <span>One number</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="h-3 w-3 text-accent" />
                      <span>One special character</span>
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="flex justify-center">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                      className="mt-0.5"
                    />
                    <Label htmlFor="terms" className="text-sm leading-5">
                      I agree to the{" "}
                      <Link href="/terms" className="text-accent hover:text-accent/80 transition-colors">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-accent hover:text-accent/80 transition-colors">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full h-11" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      <span>Creating account...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>Create Account</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </Button>


              </form>
            </CardContent>
          </Card>

          {/* Sign In Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-accent hover:text-accent/80 font-medium transition-colors">
                Sign in here
              </Link>
            </p>
          </div>

          {/* Benefits */}
          <Card className="mt-4 border-accent/20 bg-accent/5">
            <CardContent className="pt-4">
              <div className="text-center">
                <p className="text-sm font-medium mb-2">What you'll get:</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center justify-center space-x-1">
                    <CheckCircle className="h-3 w-3 text-accent" />
                    <span>AI Crop Recommendations</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <CheckCircle className="h-3 w-3 text-accent" />
                    <span>Price Predictions</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <CheckCircle className="h-3 w-3 text-accent" />
                    <span>Disease Detection</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
