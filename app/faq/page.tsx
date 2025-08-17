"use client"
import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  ChevronDown,
  ChevronUp,
  Search,
  MessageCircle,
  Phone,
  Mail,
  Sprout,
  Sun,
  Droplets,
  Wind,
  Leaf,
} from "lucide-react"

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  const faqCategories = [
    {
      title: "Getting Started",
      faqs: [
        {
          question: "What is KrishiMitra 2.0?",
          answer:
            "KrishiMitra 2.0 is an advanced AI-powered agricultural platform that helps farmers make data-driven decisions through crop recommendations, price predictions, and disease detection capabilities.",
        },
        {
          question: "How do I create an account?",
          answer:
            "Click on 'Get Started' or 'Register' button, fill in your details including farm information, and verify your email address. You'll have immediate access to all AI features.",
        },
        {
          question: "Is KrishiMitra free to use?",
          answer:
            "We offer a free tier with basic features and limited API calls. Premium plans provide unlimited access, advanced analytics, and priority support.",
        },
      ],
    },
    {
      title: "AI Features",
      faqs: [
        {
          question: "How accurate are the crop recommendations?",
          answer:
            "Our AI model has 92% accuracy based on soil conditions, weather patterns, and regional data. Recommendations are updated in real-time using satellite imagery and local weather stations.",
        },
        {
          question: "Can I upload images for disease detection?",
          answer:
            "Yes! You can upload photos of affected crops or use your device camera. Our AI analyzes the images and provides disease identification with treatment recommendations within seconds.",
        },
        {
          question: "How far ahead can you predict crop prices?",
          answer:
            "Our price prediction model forecasts up to 6 months ahead with 85% accuracy, analyzing market trends, weather patterns, and historical data.",
        },
      ],
    },
    {
      title: "Technical Support",
      faqs: [
        {
          question: "What devices are supported?",
          answer:
            "KrishiMitra works on all modern web browsers, smartphones, and tablets. We also have mobile apps for iOS and Android coming soon.",
        },
        {
          question: "Do I need internet connection?",
          answer:
            "Yes, internet connection is required for AI processing and real-time data updates. However, we're working on offline capabilities for basic features.",
        },
        {
          question: "How do I integrate with my existing farm management system?",
          answer:
            "We provide REST APIs and webhooks for seamless integration. Contact our technical team for custom integration support.",
        },
      ],
    },
    {
      title: "Account & Billing",
      faqs: [
        {
          question: "How can I upgrade my plan?",
          answer:
            "Go to your dashboard settings and click 'Upgrade Plan'. You can choose from our flexible monthly or annual subscription options.",
        },
        {
          question: "Can I cancel my subscription anytime?",
          answer:
            "Yes, you can cancel anytime from your account settings. You'll continue to have access until the end of your billing period.",
        },
        {
          question: "Do you offer refunds?",
          answer:
            "We offer a 30-day money-back guarantee for all paid plans. Contact support if you're not satisfied with our service.",
        },
      ],
    },
  ]

  const filteredFAQs = faqCategories
    .map((category) => ({
      ...category,
      faqs: category.faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    }))
    .filter((category) => category.faqs.length > 0)

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

      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="py-20 lg:py-32">
          <div className="container px-4">
            <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
              <Badge variant="secondary" className="mb-4">
                Help Center
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6">
                Frequently Asked
                <span className="block bg-gradient-to-r from-green-500 to-green-400 bg-clip-text text-transparent">
                  Questions
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                Find quick answers to common questions about KrishiMitra 2.0. Can't find what you're looking for?
                Contact our support team.
              </p>

              {/* Search Bar */}
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search FAQs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-20">
          <div className="container px-4">
            <div className="max-w-4xl mx-auto">
              {filteredFAQs.length === 0 ? (
                <Card className="text-center p-8">
                  <CardContent>
                    <p className="text-muted-foreground mb-4">No FAQs found matching your search.</p>
                    <Button
                      variant="outline"
                      onClick={() => setSearchTerm("")}
                      className="hover:bg-black hover:text-white transition-colors duration-200"
                    >
                      Clear Search
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-8">
                  {filteredFAQs.map((category, categoryIndex) => (
                    <div key={categoryIndex} className="animate-fade-in-up">
                      <h2 className="text-2xl font-bold mb-6 text-center">{category.title}</h2>
                      <div className="space-y-4">
                        {category.faqs.map((faq, faqIndex) => {
                          const globalIndex = categoryIndex * 100 + faqIndex
                          const isOpen = openItems.includes(globalIndex)

                          return (
                            <Card key={faqIndex} className="overflow-hidden">
                              <CardHeader
                                className="cursor-pointer hover:bg-muted/50 transition-colors"
                                onClick={() => toggleItem(globalIndex)}
                              >
                                <div className="flex items-center justify-between">
                                  <CardTitle className="text-lg text-left">{faq.question}</CardTitle>
                                  {isOpen ? (
                                    <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                  ) : (
                                    <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                  )}
                                </div>
                              </CardHeader>
                              {isOpen && (
                                <CardContent className="pt-0">
                                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                                </CardContent>
                              )}
                            </Card>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Contact Support */}
        <section className="py-20 bg-muted/30">
          <div className="container px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Still Need Help?</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Our support team is here to help you with any questions not covered in our FAQ.
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6 text-center">
                    <MessageCircle className="h-8 w-8 text-accent mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Live Chat</h3>
                    <p className="text-sm text-muted-foreground mb-4">Chat with our support team</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="hover:bg-black hover:text-white transition-colors duration-200 bg-transparent"
                    >
                      Start Chat
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Mail className="h-8 w-8 text-accent mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Email Support</h3>
                    <p className="text-sm text-muted-foreground mb-4">Get help via email</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="hover:bg-black hover:text-white transition-colors duration-200 bg-transparent"
                      onClick={() => (window.location.href = "mailto:support@krishimitra.com")}
                    >
                      Send Email
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Phone className="h-8 w-8 text-accent mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Phone Support</h3>
                    <p className="text-sm text-muted-foreground mb-4">Call us directly</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="hover:bg-black hover:text-white transition-colors duration-200 bg-transparent"
                      onClick={() => (window.location.href = "tel:+919876543210")}
                    >
                      Call Now
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
