"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import ReactMarkdown from "react-markdown"
import { supabase } from "@/lib/supabaseClient"
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

function AuthProtectedDashboard({ user, userProfile }: { user: any; userProfile: any }) {
  const [selectedLocation, setSelectedLocation] = useState("")
  const [selectedCrop, setSelectedCrop] = useState("")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [weatherData, setWeatherData] = useState<any>(null)
  const [weatherLoading, setWeatherLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("recommendations")
  const [showCamera, setShowCamera] = useState(false)
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  
  // Crop recommendation states
  const [cropFormData, setCropFormData] = useState({
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    temperature: '',
    humidity: '',
    ph: '',
    rainfall: ''
  })
  const [cropRecommendations, setCropRecommendations] = useState<string>("")
  const [cropLoading, setCropLoading] = useState(false)
  const [cropError, setCropError] = useState<string>("")
  
  // Disease detection states
  const [diseaseAnalysis, setDiseaseAnalysis] = useState<string>("")
  const [diseaseLoading, setDiseaseLoading] = useState(false)
  const [diseaseError, setDiseaseError] = useState<string>("")
  
  // Price prediction states
  const [pricePredictions, setPricePredictions] = useState<string>("")
  const [priceLoading, setPriceLoading] = useState(false)
  const [priceError, setPriceError] = useState<string>("")

  // Function to handle crop recommendation form input changes
  const handleCropInputChange = (field: string, value: string) => {
    setCropFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Function to clear form data
  const clearFormData = () => {
    setCropFormData({
      nitrogen: '',
      phosphorus: '',
      potassium: '',
      temperature: '',
      humidity: '',
      ph: '',
      rainfall: ''
    })
    setCropRecommendations("")
    setCropError("")
  }

  // Function to clear disease analysis
  const clearDiseaseAnalysis = () => {
    setDiseaseAnalysis("")
    setDiseaseError("")
    setUploadedImage(null)
  }

  // Function to clear price predictions
  const clearPricePredictions = () => {
    setPricePredictions("")
    setPriceError("")
    setSelectedCrop("")
    setSelectedLocation("")
  }

  // Function to get price predictions from AI
  const getPricePredictions = async () => {
    if (!selectedCrop || !selectedLocation) {
      setPriceError("Please select both crop and district")
      return
    }

    setPriceLoading(true)
    setPriceError("")
    setPricePredictions("")
    
    try {
      const response = await fetch('/api/price-predictions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          crop: selectedCrop,
          district: selectedLocation
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setPricePredictions(data.data.pricePredictions)
      } else {
        setPriceError(data.error || "Failed to get price predictions")
      }
    } catch (error) {
      console.error('Error getting price predictions:', error)
      setPriceError("Network error. Please try again.")
    } finally {
      setPriceLoading(false)
    }
  }

  // Function to analyze image for diseases using A4F API
  const analyzeImageForDiseases = async () => {
    if (!uploadedImage) {
      setDiseaseError("Please upload or capture an image first")
      return
    }

    setDiseaseLoading(true)
    setDiseaseError("")
    setDiseaseAnalysis("")
    
    try {
      const response = await fetch('/api/disease-detection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData: uploadedImage
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setDiseaseAnalysis(data.data.diseaseAnalysis)
      } else {
        setDiseaseError(data.error || "Failed to analyze image")
      }
    } catch (error) {
      console.error('Error analyzing image for diseases:', error)
      setDiseaseError("Network error. Please try again.")
    } finally {
      setDiseaseLoading(false)
    }
  }

  // Function to get crop recommendations from AI
  const getCropRecommendations = async () => {
    // Validate that all fields are filled
    const requiredFields = ['nitrogen', 'phosphorus', 'potassium', 'temperature', 'humidity', 'ph', 'rainfall']
    const emptyFields = requiredFields.filter(field => !cropFormData[field as keyof typeof cropFormData])
    
    if (emptyFields.length > 0) {
      setCropError(`Please fill in all required fields: ${emptyFields.join(', ')}`)
      return
    }

    setCropLoading(true)
    setCropError("")
    setCropRecommendations("")
    
    try {
      const response = await fetch('/api/crop-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cropFormData)
      })

      const data = await response.json()
      
      if (data.success) {
        setCropRecommendations(data.data.aiRecommendations)
      } else {
        setCropError(data.error || "Failed to get recommendations")
      }
    } catch (error) {
      console.error('Error getting crop recommendations:', error)
      setCropError("Network error. Please try again.")
    } finally {
      setCropLoading(false)
    }
  }

  // Function to fetch weather data
  const fetchWeatherData = async (location: string) => {
    if (!location) return
    
    setWeatherLoading(true)
    try {
      const response = await fetch(`/api/weather?location=${encodeURIComponent(location)}`)

      if (response.ok) {
        const data = await response.json()
        // Transform the data to match our expected format
        const transformedData = {
          temperature: data.current?.temp_c,
          condition: data.current?.condition?.text,
          humidity: data.current?.humidity,
          wind_speed: data.current?.wind_kph,
          feels_like: data.current?.feelslike_c,
          rain_chance: data.forecast?.forecastday?.[0]?.day?.daily_chance_of_rain || 0,
          location: data.location?.name,
          region: data.location?.region,
          country: data.location?.country
        }
        setWeatherData(transformedData)
        // Store weather data in localStorage with timestamp for 24-hour caching
        localStorage.setItem('weatherData', JSON.stringify({
          data: transformedData,
          timestamp: Date.now(),
          location: location
        }))
      } else {
        console.error('Weather API error:', response.statusText)
      }
    } catch (error) {
      console.error('Error fetching weather data:', error)
    } finally {
      setWeatherLoading(false)
    }
  }

  // Load weather data on component mount and when userProfile changes
  useEffect(() => {
    if (userProfile?.location) {
      // Check if we have cached weather data for this location
      const cachedWeather = localStorage.getItem('weatherData')
      if (cachedWeather) {
        const { data, timestamp, location } = JSON.parse(cachedWeather)
        const is5MinutesOld = Date.now() - timestamp > 5 * 60 * 1000 // 5 minutes in milliseconds
        
        if (location === userProfile.location && !is5MinutesOld) {
          setWeatherData(data)
          return
        }
      }
      
      // Fetch fresh weather data
      fetchWeatherData(userProfile.location)
    }
  }, [userProfile?.location])



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

  // Open camera and show preview
  const handleTakePhoto = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      setCameraStream(stream)
      setShowCamera(true)
    } catch (error) {
      console.error("Error accessing camera:", error)
      document.getElementById("image-upload")?.click()
    }
  }

  // Attach stream to video element
  useEffect(() => {
    if (showCamera && videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream
      videoRef.current.play()
    }
    return () => {
      // Stop camera when closing preview
      if (!showCamera && cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop())
        setCameraStream(null)
      }
    }
  }, [showCamera, cameraStream])

  // Capture image from video
  const handleCapture = () => {
    if (videoRef.current) {
      const video = videoRef.current
      const canvas = document.createElement("canvas")
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const context = canvas.getContext("2d")
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height)
        const imageDataUrl = canvas.toDataURL("image/jpeg")
        setUploadedImage(imageDataUrl)
        setShowCamera(false)
      }
    }
  }

  // Helper function to get weather icon based on condition
  const getWeatherIcon = (condition: string) => {
    const conditionLower = condition?.toLowerCase()
    if (conditionLower?.includes('sunny') || conditionLower?.includes('clear') || conditionLower?.includes('partly cloudy')) {
      return <Sun className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
    } else if (conditionLower?.includes('cloudy') || conditionLower?.includes('overcast') || conditionLower?.includes('mist')) {
      return <Sun className="h-8 w-8 text-gray-500 mx-auto mb-2" />
    } else if (conditionLower?.includes('rain') || conditionLower?.includes('drizzle') || conditionLower?.includes('shower')) {
      return <Droplets className="h-8 w-8 text-blue-500 mx-auto mb-2" />
    } else if (conditionLower?.includes('storm') || conditionLower?.includes('thunder') || conditionLower?.includes('lightning')) {
      return <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
    } else if (conditionLower?.includes('snow') || conditionLower?.includes('sleet')) {
      return <Droplets className="h-8 w-8 text-blue-300 mx-auto mb-2" />
    } else if (conditionLower?.includes('fog') || conditionLower?.includes('haze')) {
      return <Wind className="h-8 w-8 text-gray-400 mx-auto mb-2" />
    } else {
      return <Sun className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
    }
  }

  return (
    <main className="flex-1 bg-muted/30 pt-20">
      <div className="container px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
            <div>
              <h1 className="text-3xl font-bold">
                Welcome back,{" "}
                <span className="bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                  {userProfile?.first_name || user?.email?.split('@')[0] || 'Farmer'}!
                </span>
              </h1>
              <p className="text-muted-foreground">Here's what's happening with your farm today.</p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-2 sm:mt-0">
              <MapPin className="h-4 w-4" />
              <span className="truncate max-w-[120px] sm:max-w-none">{userProfile?.location || 'Location not set'}</span>
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
                  <p className="text-2xl font-bold">{userProfile?.farm_size || '25'} acres</p>
                </div>
                <Target className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Primary Crop</p>
                  <p className="text-2xl font-bold">{userProfile?.primary_crop || 'Wheat'}</p>
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
                  <p className="text-2xl font-bold">3 Insights</p>
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
               <span>Current Weather - {weatherData?.location || userProfile?.location || 'Location not set'}</span>
             </CardTitle>
           </CardHeader>
          <CardContent>
            {weatherLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
                <span className="ml-2 text-muted-foreground">Loading weather data...</span>
              </div>
            ) : weatherData ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-center mx-auto">
                <div className="text-center">
                  {getWeatherIcon(weatherData.condition)}
                  <p className="text-lg font-semibold">{weatherData.condition || 'Clear'}</p>
                  <p className="text-sm text-muted-foreground">Condition</p>
                </div>
                <div className="text-center">
                  <Droplets className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                  <p className="text-lg font-semibold">{weatherData.humidity || '65'}%</p>
                  <p className="text-sm text-muted-foreground">Humidity</p>
                </div>
                <div className="text-center">
                  <Wind className="h-6 w-6 text-gray-500 mx-auto mb-2" />
                  <p className="text-lg font-semibold">{weatherData.wind_speed || '12'} km/h</p>
                  <p className="text-sm text-muted-foreground">Wind</p>
                </div>
                <div className="text-center">
                  <Thermometer className="h-6 w-6 text-red-500 mx-auto mb-2" />
                  <p className="text-lg font-semibold">{weatherData.temperature || '25'}°C</p>
                  <p className="text-sm text-muted-foreground">Temp</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Sun className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Weather data unavailable</p>
                {userProfile?.location && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => fetchWeatherData(userProfile.location)}
                    className="mt-2"
                  >
                    Retry
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

                 {/* AI Features Tabs */}
         <Tabs value={activeTab} onValueChange={setActiveTab} className="animate-fade-in-up">
           {/* Mobile: Vertical tabs, Desktop: Horizontal tabs */}
           <div className="block sm:hidden mb-6">
             {/* Mobile Vertical Navigation */}
             <div className="space-y-3">
               <button
                 onClick={() => setActiveTab("recommendations")}
                 className={`w-full flex items-center gap-3 p-4 rounded-lg border transition-all ${
                   activeTab === "recommendations" 
                     ? "bg-accent/10 border-accent/20" 
                     : "bg-muted/50 border-muted/30 hover:bg-muted/70"
                 }`}
               >
                 <span className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full ${
                   activeTab === "recommendations" ? "bg-accent/20" : "bg-muted"
                 }`}>
                   <Brain className={`h-5 w-5 ${
                     activeTab === "recommendations" ? "text-accent" : "text-muted-foreground"
                   }`} />
                 </span>
                 <div className="text-left">
                   <div className="font-semibold text-sm">Crop Recommendations</div>
                   <div className="text-xs text-muted-foreground">AI-powered crop suggestions</div>
                 </div>
               </button>
               
               <button
                 onClick={() => setActiveTab("predictions")}
                 className={`w-full flex items-center gap-3 p-4 rounded-lg border transition-all ${
                   activeTab === "predictions" 
                     ? "bg-accent/10 border-accent/20" 
                     : "bg-muted/50 border-muted/30 hover:bg-muted/70"
                 }`}
               >
                 <span className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full ${
                   activeTab === "predictions" ? "bg-accent/20" : "bg-muted"
                 }`}>
                   <TrendingUp className={`h-5 w-5 ${
                     activeTab === "predictions" ? "text-accent" : "text-muted-foreground"
                   }`} />
                 </span>
                 <div className="text-left">
                   <div className="font-semibold text-sm">Price Predictions</div>
                   <div className="text-xs text-muted-foreground">Market forecasting tools</div>
                 </div>
               </button>
               
               <button
                 onClick={() => setActiveTab("detection")}
                 className={`w-full flex items-center gap-3 p-4 rounded-lg border transition-all ${
                   activeTab === "detection" 
                     ? "bg-accent/10 border-accent/20" 
                     : "bg-muted/50 border-muted/30 hover:bg-muted/70"
                 }`}
               >
                 <span className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full ${
                   activeTab === "detection" ? "bg-accent/20" : "bg-muted"
                 }`}>
                   <Shield className={`h-5 w-5 ${
                     activeTab === "detection" ? "text-accent" : "text-muted-foreground"
                   }`} />
                 </span>
                 <div className="text-left">
                   <div className="font-semibold text-sm">Disease Detection</div>
                   <div className="text-xs text-muted-foreground">AI-powered crop analysis</div>
                 </div>
               </button>
             </div>
           </div>

           {/* Desktop: Horizontal tabs */}
           <TabsList
             className="hidden sm:flex w-full flex-nowrap overflow-x-auto gap-3 mb-8 bg-transparent border-none shadow-none px-0 scrollbar-thin scrollbar-thumb-accent/30"
             style={{
               WebkitOverflowScrolling: "touch",
               scrollbarWidth: "thin",
               scrollbarColor: "#bbf7d0 #f0fdf4",
             }}
           >
             <TabsTrigger
               value="recommendations"
               className="flex items-center gap-2 px-6 py-3 text-sm sm:text-base whitespace-nowrap rounded-lg transition-all min-w-[200px] sm:min-w-[220px]"
               style={{ flex: "0 0 auto" }}
               data-value="recommendations"
             >
               <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7">
                 <Brain className="h-5 w-5 sm:h-6 sm:w-6" />
               </span>
               <span className="font-semibold text-xs sm:text-sm">Crop Recommendations</span>
             </TabsTrigger>
             <TabsTrigger
               value="predictions"
               className="flex items-center gap-2 px-6 py-3 text-sm sm:text-base whitespace-nowrap rounded-lg transition-all min-w-[180px] sm:min-w-[200px]"
               style={{ flex: "0 0 auto" }}
               data-value="predictions"
             >
               <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7">
                 <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />
               </span>
               <span className="text-xs sm:text-sm">Price Predictions</span>
             </TabsTrigger>
             <TabsTrigger
               value="detection"
               className="flex items-center gap-2 px-6 py-3 text-sm sm:text-base whitespace-nowrap rounded-lg transition-all min-w-[180px] sm:min-w-[200px]"
               style={{ flex: "0 0 auto" }}
               data-value="detection"
             >
               <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7">
                 <Shield className="h-5 w-5 sm:h-6 sm:w-6" />
               </span>
               <span className="text-xs sm:text-sm">Disease Detection</span>
             </TabsTrigger>
           </TabsList>

          {/* Crop Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Get Crop Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nitrogen">Nitrogen (N) mg/kg</Label>
                    <input
                      type="number"
                      id="nitrogen"
                      value={cropFormData.nitrogen}
                      onChange={(e) => handleCropInputChange('nitrogen', e.target.value)}
                      placeholder="Enter Nitrogen (N)"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phosphorus">Phosphorus (P) mg/kg</Label>
                    <input
                      type="number"
                      id="phosphorus"
                      value={cropFormData.phosphorus}
                      onChange={(e) => handleCropInputChange('phosphorus', e.target.value)}
                      placeholder="Enter Phosphorus (P)"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="potassium">Potassium (K) mg/kg</Label>
                    <input
                      type="number"
                      id="potassium"
                      value={cropFormData.potassium}
                      onChange={(e) => handleCropInputChange('potassium', e.target.value)}
                      placeholder="Enter Potassium (K)"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="temperature">Temperature (°C)</Label>
                    <input
                      type="number"
                      id="temperature"
                      value={cropFormData.temperature}
                      onChange={(e) => handleCropInputChange('temperature', e.target.value)}
                      placeholder="Enter Temperature (°C)"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="humidity">Humidity (%)</Label>
                    <input
                      type="number"
                      id="humidity"
                      value={cropFormData.humidity}
                      onChange={(e) => handleCropInputChange('humidity', e.target.value)}
                      placeholder="Enter Humidity (%)"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ph">pH</Label>
                    <input
                      type="number"
                      id="ph"
                      value={cropFormData.ph}
                      onChange={(e) => handleCropInputChange('ph', e.target.value)}
                      placeholder="Enter pH"
                      step="0.1"
                      min="0"
                      max="14"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rainfall">Rainfall (mm)</Label>
                    <input
                      type="number"
                      id="rainfall"
                      value={cropFormData.rainfall}
                      onChange={(e) => handleCropInputChange('rainfall', e.target.value)}
                      placeholder="Enter Rainfall (mm)"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={getCropRecommendations}
                    disabled={cropLoading}
                  >
                    {cropLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Getting AI Recommendations...
                      </>
                    ) : (
                      <>
                        <Brain className="mr-2 h-4 w-4" />
                        Get AI Recommendations
                      </>
                    )}
                  </Button>
                  
                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={clearFormData}
                      className="flex-1"
                    >
                      Clear Form
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>AI Crop Recommendations</CardTitle>
                  <CardDescription>AI-powered suggestions based on your input</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cropError && (
                    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <p className="text-destructive text-sm">{cropError}</p>
                    </div>
                  )}
                  
                  {cropLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
                        <p className="text-muted-foreground">AI is analyzing your farm conditions...</p>
                        <p className="text-xs text-muted-foreground mt-2">This may take a few moments</p>
                      </div>
                    </div>
                  ) : cropRecommendations ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
                        <h4 className="font-semibold text-accent mb-2">AI Analysis Results:</h4>
                        <div className="bg-white p-4 rounded border text-sm leading-relaxed">
                          <ReactMarkdown>{cropRecommendations}</ReactMarkdown>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={() => setCropRecommendations("")}
                        className="w-full"
                      >
                        Clear Results
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-2">No recommendations yet</p>
                      <p className="text-sm text-muted-foreground">
                        Fill in the form and click "Get AI Recommendations" to get started
                      </p>
                    </div>
                  )}
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
                        <SelectItem value="jowar">Jowar</SelectItem>
                        <SelectItem value="bajra">Bajra</SelectItem>
                        <SelectItem value="tur">Tur</SelectItem>
                        <SelectItem value="moong">Moong</SelectItem>
                        <SelectItem value="urad">Urad</SelectItem>
                        <SelectItem value="soyabean">Soyabean</SelectItem>
                        <SelectItem value="groundnut">Groundnut</SelectItem>
                        <SelectItem value="sunflower">Sunflower</SelectItem>
                        <SelectItem value="onion">Onion</SelectItem>
                        <SelectItem value="potato">Potato</SelectItem>
                        <SelectItem value="tomato">Tomato</SelectItem>
                        <SelectItem value="chillies">Chillies</SelectItem>
                        <SelectItem value="banana">Banana</SelectItem>
                        <SelectItem value="grapes">Grapes</SelectItem>
                        <SelectItem value="pomegranate">Pomegranate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="district">District</Label>
                    <Select onValueChange={setSelectedLocation}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select District"/>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ahmednagar">Ahmednagar</SelectItem>
                        <SelectItem value="akola">Akola</SelectItem>
                        <SelectItem value="amravati">Amravati</SelectItem>
                        <SelectItem value="aurangabad">Aurangabad</SelectItem>
                        <SelectItem value="beed">Beed</SelectItem>
                        <SelectItem value="bhandara">Bhandara</SelectItem>
                        <SelectItem value="buldhana">Buldhana</SelectItem>
                        <SelectItem value="chandrapur">Chandrapur</SelectItem>
                        <SelectItem value="dhule">Dhule</SelectItem>
                        <SelectItem value="gadchiroli">Gadchiroli</SelectItem>
                        <SelectItem value="gondia">Gondia</SelectItem>
                        <SelectItem value="hingoli">Hingoli</SelectItem>
                        <SelectItem value="jalgaon">Jalgaon</SelectItem>
                        <SelectItem value="jalna">Jalna</SelectItem>
                        <SelectItem value="kolhapur">Kolhapur</SelectItem>
                        <SelectItem value="latur">Latur</SelectItem>
                        <SelectItem value="mumbai city">Mumbai City</SelectItem>
                        <SelectItem value="mumbai suburban">Mumbai Suburban</SelectItem>
                        <SelectItem value="nagpur">Nagpur</SelectItem>
                        <SelectItem value="nanded">Nanded</SelectItem>
                        <SelectItem value="nandurbar">Nandurbar</SelectItem>
                        <SelectItem value="nashik">Nashik</SelectItem>
                        <SelectItem value="osmanabad">Osmanabad</SelectItem>
                        <SelectItem value="parbhani">Parbhani</SelectItem>
                        <SelectItem value="pune">Pune</SelectItem>
                        <SelectItem value="raigad">Raigad</SelectItem>
                        <SelectItem value="ratnagiri">Ratnagiri</SelectItem>
                        <SelectItem value="sangli">Sangli</SelectItem>
                        <SelectItem value="satara">Satara</SelectItem>
                        <SelectItem value="sindhudurg">Sindhudurg</SelectItem>
                        <SelectItem value="solapur">Solapur</SelectItem>
                        <SelectItem value="thane">Thane</SelectItem>
                        <SelectItem value="wardha">Wardha</SelectItem>
                        <SelectItem value="washim">Washim</SelectItem>
                        <SelectItem value="yavatmal">Yavatmal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={getPricePredictions}
                    disabled={priceLoading}
                  >
                    {priceLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating AI Forecast...
                      </>
                    ) : (
                      <>
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Generate AI Forecast
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearPricePredictions}
                    className="w-full"
                  >
                    Clear Form
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>AI Price Predictions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {priceError && (
                    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <p className="text-destructive text-sm">{priceError}</p>
                    </div>
                  )}
                  
                  {priceLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
                        <p className="text-muted-foreground">AI is analyzing market trends...</p>
                        <p className="text-xs text-muted-foreground mt-2">This may take a few moments</p>
                      </div>
                    </div>
                  ) : pricePredictions ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
                        <h4 className="font-semibold text-accent mb-2">AI Market Analysis:</h4>
                        <div className="bg-white p-4 rounded border text-sm leading-relaxed">
                          <ReactMarkdown>{pricePredictions}</ReactMarkdown>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={() => setPricePredictions("")}
                        className="w-full"
                      >
                        Clear Results
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-2">No predictions yet</p>
                      <p className="text-sm text-muted-foreground">
                        Select crop and district, then click "Generate AI Forecast" to get started
                      </p>
                    </div>
                  )}
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
                    {showCamera ? (
                      <div className="space-y-4">
                        <video
                          ref={videoRef}
                          className="mx-auto rounded-lg max-h-64"
                          autoPlay
                          playsInline
                          style={{ width: "100%", maxWidth: 400, background: "#000" }}
                        />
                        <div className="flex justify-center gap-2">
                          <Button onClick={handleCapture}>
                            <Camera className="mr-2 h-4 w-4" />
                            Capture
                          </Button>
                          <Button variant="outline" onClick={() => setShowCamera(false)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : uploadedImage ? (
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
                    <div className="space-y-2">
                      <Button 
                        className="w-full" 
                        onClick={analyzeImageForDiseases}
                        disabled={diseaseLoading}
                      >
                        {diseaseLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Analyzing Image...
                          </>
                        ) : (
                          <>
                            <Shield className="mr-2 h-4 w-4" />
                            Analyze for Diseases
                          </>
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={clearDiseaseAnalysis}
                        className="w-full"
                      >
                        Clear Image & Results
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>AI Disease Analysis Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {diseaseError && (
                    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <p className="text-destructive text-sm">{diseaseError}</p>
                    </div>
                  )}
                  
                  {diseaseLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
                        <p className="text-muted-foreground">AI is analyzing your crop image...</p>
                        <p className="text-xs text-muted-foreground mt-2">This may take a few moments</p>
                      </div>
                    </div>
                  ) : diseaseAnalysis ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
                        <h4 className="font-semibold text-accent mb-2">AI Analysis Results:</h4>
                        <div className="bg-white p-4 rounded border text-sm leading-relaxed">
                          <ReactMarkdown>{diseaseAnalysis}</ReactMarkdown>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={() => setDiseaseAnalysis("")}
                        className="w-full"
                      >
                        Clear Results
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-2">No analysis results yet</p>
                      <p className="text-sm text-muted-foreground">
                        Upload or capture an image and click "Analyze for Diseases" to get started
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

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
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<any>(null)

  useEffect(() => {
    // Check current auth state
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setIsAuthenticated(!!user)
      
      // If user is authenticated, fetch their profile from users table
      if (user) {
        await fetchUserProfile(user.id)
      }
    }

    checkAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      setIsAuthenticated(!!session?.user)
      
      // If user is authenticated, fetch their profile from users table
      if (session?.user) {
        await fetchUserProfile(session.user.id)
      } else {
        setUserProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Function to fetch user profile from users table
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error)
        return
      }

      setUserProfile(data)
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

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

      {isAuthenticated ? <AuthProtectedDashboard user={user} userProfile={userProfile} /> : <LoginPrompt />}

      <Footer />
    </div>
  )
}
