import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ArrowRight, Brain, TrendingUp, Shield, Leaf, Users, Award, Sprout, Sun, Droplets, Wind } from "lucide-react"

export default function HomePage() {
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

      <main className="flex-1 pt-14 sm:pt-16">
        {/* Hero Section */}
        <section className="relative py-12 sm:py-16 lg:py-20 xl:py-32 overflow-hidden">
          <div className="container px-3 sm:px-4">
            <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight mb-4 sm:mb-6 leading-tight">
                AI-Powered Agriculture
                <span className="block bg-gradient-to-r from-green-500 to-green-400 bg-clip-text text-transparent">
                  Solutions
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-2">
                Revolutionize your farming with intelligent crop recommendations, accurate price predictions, and
                instant disease detection powered by advanced AI technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
                <Button
                  size="lg"
                  asChild
                  className="text-base sm:text-lg w-52 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-white hover:from-green-600 hover:to-green-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-0 text-black font-semibold h-12 sm:h-auto"
                >
                  <Link href="/register">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  asChild
                  className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-400 to-white hover:from-green-500 hover:to-green-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-0 text-black font-semibold h-12 sm:h-auto"
                >
                  <Link href="/explore">Explore Features</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-muted/30 to-accent-blue/5">
          <div className="container px-3 sm:px-4">
            <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 px-2">
                Three Powerful AI Features
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
                Our advanced AI algorithms help you make informed decisions at every stage of your farming journey.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
              {/* Crop Recommendations */}
              <Card className="group hover:shadow-2xl transition-all duration-500 animate-slide-in-left border-0 bg-gradient-to-br from-card to-accent/5 hover:from-accent/5 hover:to-accent/10 transform hover:scale-105">
                <CardHeader className="text-center pb-4 px-4 sm:px-6">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-accent/20 to-accent-blue/20 rounded-2xl flex items-center justify-center group-hover:from-accent/30 group-hover:to-accent-blue/30 transition-all duration-300 animate-pulse-green">
                    <Brain className="h-8 w-8 sm:h-10 sm:w-10 text-accent animate-wave" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl font-bold">Smart Crop Recommendations</CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Get personalized crop suggestions based on soil conditions, climate data, and market trends.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center px-4 sm:px-6">
                  <ul className="text-sm text-muted-foreground space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                    <li className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0"></div>
                      <span>Soil analysis integration</span>
                    </li>
                    <li className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-accent-blue rounded-full flex-shrink-0"></div>
                      <span>Weather pattern analysis</span>
                    </li>
                    <li className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0"></div>
                      <span>Market demand insights</span>
                    </li>
                    <li className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-accent-blue rounded-full flex-shrink-0"></div>
                      <span>Seasonal optimization</span>
                    </li>
                  </ul>
                  <Button
                    variant="outline"
                    className="w-full bg-black text-white hover:bg-gray-800 border-black hover:border-gray-800 transition-all duration-300 transform hover:scale-105 h-10 sm:h-auto"
                  >
                    Learn More
                  </Button>
                </CardContent>
              </Card>

              {/* Price Predictions */}
              <Card
                className="group hover:shadow-2xl transition-all duration-500 animate-slide-in-left border-0 bg-gradient-to-br from-card to-accent-blue/5 hover:from-accent-blue/5 hover:to-accent-blue/10 transform hover:scale-105"
                style={{ animationDelay: "0.1s" }}
              >
                <CardHeader className="text-center pb-4 px-4 sm:px-6">
                  <div
                    className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-accent-blue/20 to-accent/20 rounded-2xl flex items-center justify-center group-hover:from-accent-blue/30 group-hover:to-accent/30 transition-all duration-300 animate-pulse-green"
                    style={{ animationDelay: "0.5s" }}
                  >
                    <TrendingUp className="h-8 w-8 sm:h-10 sm:w-10 text-accent-blue animate-wave" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl font-bold">Price Prediction</CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Forecast crop prices using historical data and market analysis to maximize your profits.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center px-4 sm:px-6">
                  <ul className="text-sm text-muted-foreground space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                    <li className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-accent-blue rounded-full flex-shrink-0"></div>
                      <span>Historical trend analysis</span>
                    </li>
                    <li className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0"></div>
                      <span>Market volatility tracking</span>
                    </li>
                    <li className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-accent-blue rounded-full flex-shrink-0"></div>
                      <span>Seasonal price patterns</span>
                    </li>
                    <li className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0"></div>
                      <span>Predictive insights</span>
                    </li>
                  </ul>
                  <Button
                    variant="outline"
                    className="w-full bg-black text-white hover:bg-gray-800 border-black hover:border-gray-800 transition-all duration-300 transform hover:scale-105 h-10 sm:h-auto"
                  >
                    Learn More
                  </Button>
                </CardContent>
              </Card>

              {/* Disease Detection */}
              <Card
                className="group hover:shadow-2xl transition-all duration-500 animate-slide-in-left border-0 bg-gradient-to-br from-card to-accent/5 hover:from-accent/5 hover:to-accent/10 transform hover:scale-105"
                style={{ animationDelay: "0.2s" }}
              >
                <CardHeader className="text-center pb-4 px-4 sm:px-6">
                  <div
                    className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-accent/20 to-accent-blue/20 rounded-2xl flex items-center justify-center group-hover:from-accent/30 group-hover:to-accent-blue/30 transition-all duration-300 animate-pulse-green"
                    style={{ animationDelay: "1s" }}
                  >
                    <Shield className="h-8 w-8 sm:h-10 sm:w-10 text-accent animate-wave" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl font-bold">Disease Detection</CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Instantly identify crop diseases through image analysis and get treatment recommendations.
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center px-4 sm:px-6">
                  <ul className="text-sm text-muted-foreground space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                    <li className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0"></div>
                      <span>Image-based diagnosis</span>
                    </li>
                    <li className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-accent-blue rounded-full flex-shrink-0"></div>
                      <span>Treatment suggestions</span>
                    </li>
                    <li className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0"></div>
                      <span>Prevention strategies</span>
                    </li>
                    <li className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-accent-blue rounded-full flex-shrink-0"></div>
                      <span>AI consultation</span>
                    </li>
                  </ul>
                  <Button
                    variant="outline"
                    className="w-full bg-black text-white hover:bg-gray-800 border-black hover:border-gray-800 transition-all duration-300 transform hover:scale-105 h-10 sm:h-auto"
                  >
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Enhanced Stats Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-accent/5 to-accent-blue/5">
          <div className="container px-3 sm:px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 max-w-4xl mx-auto text-center">
              <div className="animate-fade-in-up group">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-accent to-accent-blue bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                  10K+
                </div>
                <div className="text-xs sm:text-sm font-medium text-muted-foreground">Active Farmers</div>
              </div>
              <div className="animate-fade-in-up group" style={{ animationDelay: "0.1s" }}>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-accent-blue to-accent bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                  95%
                </div>
                <div className="text-xs sm:text-sm font-medium text-muted-foreground">Accuracy Rate</div>
              </div>
              <div className="animate-fade-in-up group" style={{ animationDelay: "0.2s" }}>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-accent to-accent-blue bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                  50+
                </div>
                <div className="text-xs sm:text-sm font-medium text-muted-foreground">Crop Types</div>
              </div>
              <div className="animate-fade-in-up group" style={{ animationDelay: "0.3s" }}>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-accent-blue to-accent bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                  24/7
                </div>
                <div className="text-xs sm:text-sm font-medium text-muted-foreground">AI Support</div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-muted/30 to-accent/5">
          <div className="container px-3 sm:px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12 sm:mb-16">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 px-2">
                  Why Choose KrishiMitra 2.0?
                </h2>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
                  Join thousands of farmers who have transformed their agricultural practices with our AI solutions.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                <div className="text-center animate-fade-in-up group px-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-accent/20 to-accent-blue/20 rounded-2xl flex items-center justify-center group-hover:from-accent/30 group-hover:to-accent-blue/30 transition-all duration-300 transform group-hover:scale-110">
                    <Leaf className="h-8 w-8 sm:h-10 sm:w-10 text-accent animate-wave" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Sustainable Farming</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    Promote eco-friendly practices with AI-driven insights that optimize resource usage and reduce
                    environmental impact.
                  </p>
                </div>

                <div className="text-center animate-fade-in-up group px-4" style={{ animationDelay: "0.1s" }}>
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-accent-blue/20 to-accent/20 rounded-2xl flex items-center justify-center group-hover:from-accent-blue/30 group-hover:to-accent/30 transition-all duration-300 transform group-hover:scale-110">
                    <Users className="h-8 w-8 sm:h-10 sm:w-10 text-accent-blue animate-wave" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Community Support</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    Connect with fellow farmers, share experiences, and learn from a growing community of agricultural
                    innovators.
                  </p>
                </div>

                <div className="text-center animate-fade-in-up group px-4" style={{ animationDelay: "0.2s" }}>
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-accent/20 to-accent-blue/20 rounded-2xl flex items-center justify-center group-hover:from-accent/30 group-hover:to-accent-blue/30 transition-all duration-300 transform group-hover:scale-110">
                    <Award className="h-8 w-8 sm:h-10 sm:w-10 text-accent animate-wave" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Proven Results</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    Increase your crop yield by up to 30% and reduce losses with our scientifically-backed AI
                    recommendations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-green-50 to-green-100">
          <div className="container px-3 sm:px-4">
            <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 px-2">
                Ready to Transform Your Farming?
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
                Join the agricultural revolution today. Get started with KrishiMitra 2.0 and experience the power of AI
                in farming.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
                <Button
                  size="lg"
                  asChild
                  className="text-base sm:text-lg w-52 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-white hover:from-green-600 hover:to-green-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-0 text-black font-semibold h-12 sm:h-auto"
                >
                  <Link href="/register">
                    Start Now
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
