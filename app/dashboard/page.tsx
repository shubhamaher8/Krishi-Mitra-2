"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import {
  Brain,
  TrendingUp,
  Shield,
  Camera,
  Upload,
  MapPin,
  Calendar,
  Thermometer,
  Droplets,
  Sun,
  Wind,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  Leaf,
  DollarSign,
  Target,
  Sprout,
  Lock,
  User,
} from "lucide-react"
import Link from "next/link"

function AuthProtectedDashboard() {
  const [selectedLocation, setSelectedLocation] = useState("")
  const [selectedCrop, setSelectedCrop] = useState("")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleTakePhoto = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })

      const video = document.createElement("video")
      video.srcObject = stream
      video.play()

      const canvas = document.createElement("canvas")
      const context = canvas.getContext("2d")

      video.onloadedmetadata = () => {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        setTimeout(() => {
          if (context) {
            context.drawImage(video, 0, 0)
            const imageDataUrl = canvas.toDataURL("image/jpeg")
            setUploadedImage(imageDataUrl)
          }

          stream.getTracks().forEach((track) => track.stop())
        }, 3000)
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      document.getElementById("image-upload")?.click()
    }
  }

  return (
    <main className="flex-1 bg-muted/30 pt-20">
      <div className="container px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">
                Welcome back,{" "}
                <span className="bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                  John!
                </span>
              </h1>
              <p className="text-muted-foreground">Here's what's happening with your farm today.</p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Punjab, India</span>
              <Calendar className="h-4 w-4 ml-4" />
              <span>Dec 13, 2024</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-slide-in-left">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Farm Area</p>
                  <p className="text-2xl font-bold">25 acres</p>
                </div>
                <Target className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Crops</p>
                  <p className="text-2xl font-bold">3 types</p>
                </div>
                <Leaf className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Est. Revenue</p>
                  <p className="text-2xl font-bold">₹8.5L</p>
                </div>
                <DollarSign className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">AI Insights</p>
                  <p className="text-2xl font-bold">12 new</p>
                </div>
                <Brain className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weather Widget */}
        <Card className="mb-8 animate-fade-in-up">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sun className="h-5 w-5 text-accent" />
              <span>Current Weather</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <Sun className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">28°C</p>
                <p className="text-sm text-muted-foreground">Sunny</p>
              </div>
              <div className="text-center">
                <Droplets className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                <p className="text-lg font-semibold">65%</p>
                <p className="text-sm text-muted-foreground">Humidity</p>
              </div>
              <div className="text-center">
                <Wind className="h-6 w-6 text-gray-500 mx-auto mb-2" />
                <p className="text-lg font-semibold">12 km/h</p>
                <p className="text-sm text-muted-foreground">Wind</p>
              </div>
              <div className="text-center">
                <Thermometer className="h-6 w-6 text-red-500 mx-auto mb-2" />
                <p className="text-lg font-semibold">32°C</p>
                <p className="text-sm text-muted-foreground">Feels like</p>
              </div>
              <div className="text-center">
                <Droplets className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <p className="text-lg font-semibold">0%</p>
                <p className="text-sm text-muted-foreground">Rain chance</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Features Tabs */}
        <Tabs defaultValue="recommendations" className="animate-fade-in-up">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="recommendations" className="flex items-center space-x-2">
              <Brain className="h-4 w-4" />
              <span>Crop Recommendations</span>
            </TabsTrigger>
            <TabsTrigger value="predictions" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Price Predictions</span>
            </TabsTrigger>
            <TabsTrigger value="detection" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Disease Detection</span>
            </TabsTrigger>
          </TabsList>

          {/* Crop Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Get Crop Recommendations</CardTitle>
                  <CardDescription>Enter your farm details to get AI-powered crop suggestions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Farm Location</Label>
                    <Select onValueChange={setSelectedLocation}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="punjab">Punjab</SelectItem>
                        <SelectItem value="haryana">Haryana</SelectItem>
                        <SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
                        <SelectItem value="maharashtra">Maharashtra</SelectItem>
                        <SelectItem value="gujarat">Gujarat</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="season">Season</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select season" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kharif">Kharif (Monsoon)</SelectItem>
                        <SelectItem value="rabi">Rabi (Winter)</SelectItem>
                        <SelectItem value="zaid">Zaid (Summer)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="soil">Soil Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select soil type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="alluvial">Alluvial</SelectItem>
                        <SelectItem value="clay">Clay</SelectItem>
                        <SelectItem value="sandy">Sandy</SelectItem>
                        <SelectItem value="loamy">Loamy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full">
                    <Brain className="mr-2 h-4 w-4" />
                    Get Recommendations
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommended Crops</CardTitle>
                  <CardDescription>Based on your current conditions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-accent/10 rounded-lg border border-accent/20">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                          <Leaf className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Wheat (HD-2967)</h3>
                          <p className="text-sm text-muted-foreground">Winter crop</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary" className="bg-accent/20 text-accent">
                          95% Match
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">₹45,000/acre</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                          <Leaf className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Mustard</h3>
                          <p className="text-sm text-muted-foreground">Oil seed</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">88% Match</Badge>
                        <p className="text-sm text-muted-foreground mt-1">₹32,000/acre</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                          <Leaf className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Barley</h3>
                          <p className="text-sm text-muted-foreground">Cereal grain</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">82% Match</Badge>
                        <p className="text-sm text-muted-foreground mt-1">₹28,000/acre</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Price Predictions Tab */}
          <TabsContent value="predictions" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Price Forecast</CardTitle>
                  <CardDescription>Select a crop to view price predictions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="crop">Select Crop</Label>
                    <Select onValueChange={setSelectedCrop}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose crop for prediction" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wheat">Wheat</SelectItem>
                        <SelectItem value="rice">Rice</SelectItem>
                        <SelectItem value="corn">Corn</SelectItem>
                        <SelectItem value="cotton">Cotton</SelectItem>
                        <SelectItem value="sugarcane">Sugarcane</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="market">Market</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select market" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="local">Local Market</SelectItem>
                        <SelectItem value="mandi">Mandi</SelectItem>
                        <SelectItem value="export">Export Market</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Generate Forecast
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Wheat Price Trend</CardTitle>
                  <CardDescription>6-month price forecast</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-accent/10 rounded-lg">
                        <p className="text-sm text-muted-foreground">Current Price</p>
                        <p className="text-2xl font-bold text-accent">₹2,450</p>
                        <p className="text-xs text-muted-foreground">per quintal</p>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Predicted (3M)</p>
                        <p className="text-2xl font-bold">₹2,680</p>
                        <p className="text-xs text-green-600">+9.4% ↗</p>
                      </div>
                    </div>

                    <div className="h-48 bg-gradient-to-r from-accent/10 to-accent/5 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="h-12 w-12 text-accent mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Interactive Price Chart</p>
                        <p className="text-xs text-muted-foreground mt-1">Historical & Predicted Data</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Market Confidence</span>
                        <span className="text-accent font-medium">High (85%)</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Key Factors:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Favorable weather conditions</li>
                        <li>• Increased export demand</li>
                        <li>• Government support policies</li>
                        <li>• Seasonal price patterns</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Disease Detection Tab */}
          <TabsContent value="detection" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Crop Image</CardTitle>
                  <CardDescription>Take or upload a photo of your crop for AI analysis</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-accent/20 rounded-lg p-8 text-center">
                    {uploadedImage ? (
                      <div className="space-y-4">
                        <img
                          src={uploadedImage || "/placeholder.svg"}
                          alt="Uploaded crop"
                          className="max-h-48 mx-auto rounded-lg"
                        />
                        <Button variant="outline" onClick={() => setUploadedImage(null)}>
                          Upload Different Image
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Camera className="h-12 w-12 text-accent mx-auto" />
                        <div>
                          <p className="text-sm font-medium">Upload crop image</p>
                          <p className="text-xs text-muted-foreground">Supports JPG, PNG up to 10MB</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 justify-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleTakePhoto}
                            className="hover:bg-black hover:text-white hover:border-black transition-all duration-300 bg-transparent"
                          >
                            <Camera className="mr-2 h-4 w-4" />
                            Take Photo
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="hover:bg-black hover:text-white hover:border-black transition-all duration-300 bg-transparent"
                          >
                            <label htmlFor="image-upload" className="cursor-pointer">
                              <Upload className="mr-2 h-4 w-4" />
                              Upload Image
                            </label>
                          </Button>
                        </div>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </div>
                    )}
                  </div>

                  {uploadedImage && (
                    <Button className="w-full">
                      <Shield className="mr-2 h-4 w-4" />
                      Analyze for Diseases
                    </Button>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Disease Analysis Results</CardTitle>
                  <CardDescription>AI-powered crop health assessment</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        <div>
                          <h4 className="font-medium">Leaf Blight</h4>
                          <p className="text-sm text-muted-foreground">Fungal infection</p>
                        </div>
                      </div>
                      <Badge variant="destructive">High Risk</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-yellow-600" />
                        <div>
                          <h4 className="font-medium">Powdery Mildew</h4>
                          <p className="text-sm text-muted-foreground">Early stage</p>
                        </div>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">Medium Risk</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-accent/10 rounded-lg border border-accent/20">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-accent" />
                        <div>
                          <h4 className="font-medium">Root Health</h4>
                          <p className="text-sm text-muted-foreground">No issues detected</p>
                        </div>
                      </div>
                      <Badge className="bg-accent/20 text-accent">Healthy</Badge>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t">
                    <h4 className="font-medium">Treatment Recommendations:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                        <p>Apply copper-based fungicide immediately</p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                        <p>Improve air circulation around plants</p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                        <p>Reduce watering frequency</p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                        <p>Monitor weekly for progress</p>
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full bg-transparent">
                    Get Expert Consultation
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Recent Activity */}
        <Card className="mt-8 animate-fade-in-up">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest farming insights and actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg">
                <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                  <Brain className="h-5 w-5 text-accent" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">New crop recommendations available</p>
                  <p className="text-sm text-muted-foreground">Based on updated weather data</p>
                </div>
                <span className="text-xs text-muted-foreground">2 hours ago</span>
              </div>

              <div className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Wheat prices expected to rise</p>
                  <p className="text-sm text-muted-foreground">+12% increase predicted for next month</p>
                </div>
                <span className="text-xs text-muted-foreground">1 day ago</span>
              </div>

              <div className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Shield className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Disease scan completed</p>
                  <p className="text-sm text-muted-foreground">No major issues detected in Field A</p>
                </div>
                <span className="text-xs text-muted-foreground">3 days ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

function LoginPrompt() {
  return (
    <main className="flex-1 bg-muted/30 pt-20">
      <div className="container px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="p-8 bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg">
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                  <Lock className="h-10 w-10 text-accent" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">Dashboard Access Required</h1>
                  <p className="text-muted-foreground text-lg">
                    Please log in to access your personalized farming dashboard and AI-powered features.
                  </p>
                </div>
              </div>

              <div className="space-y-4 py-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
                    <Brain className="h-6 w-6 text-accent flex-shrink-0" />
                    <div>
                      <p className="font-medium">AI Crop Recommendations</p>
                      <p className="text-muted-foreground">Get personalized suggestions</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-accent flex-shrink-0" />
                    <div>
                      <p className="font-medium">Price Predictions</p>
                      <p className="text-muted-foreground">Market forecasting tools</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
                    <Shield className="h-6 w-6 text-accent flex-shrink-0" />
                    <div>
                      <p className="font-medium">Disease Detection</p>
                      <p className="text-muted-foreground">AI-powered crop analysis</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    asChild
                    className="bg-black hover:bg-gray-800 text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                  >
                    <Link href="/login">
                      <User className="mr-2 h-4 w-4" />
                      Login to Dashboard
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className="bg-black hover:bg-gray-800 text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                  >
                    <Link href="/register">Create Account</Link>
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link href="/register" className="text-accent hover:underline font-medium">
                    Sign up for free
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    // For demo purposes, we'll simulate checking authentication
    const checkAuth = () => {
      // Simulate checking if user is logged in
      // In a real app, this would check localStorage, cookies, or auth provider
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
      setIsAuthenticated(isLoggedIn)
    }

    checkAuth()
  }, [])

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
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

          <Header />
          <main className="flex-1 bg-muted/30 pt-20 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading dashboard...</p>
            </div>
          </main>
          <Footer />
        </div>
      </div>
    )
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

      {isAuthenticated ? <AuthProtectedDashboard /> : <LoginPrompt />}

      <Footer />
    </div>
  )
}
