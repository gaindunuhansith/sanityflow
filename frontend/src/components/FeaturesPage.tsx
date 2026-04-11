import { Header } from "./Header";
import { Footer } from "./Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Droplets,
  AlertTriangle,
  BarChart3,
  Users,
  Truck,
  FileText,
  Shield,
  Zap,
  CheckCircle,
  MapPin,
  Activity,
  Heart,
  Star,
  TrendingUp
} from "lucide-react";

export function FeaturesPage() {
  const features = [
    {
      icon: <Droplets className="h-8 w-8 text-emerald-600" />,
      title: "Water Source Management",
      description: "Monitor and manage reservoirs, wells, and water infrastructure with real-time capacity tracking.",
      benefits: ["Real-time monitoring", "Capacity alerts", "Historical data", "Predictive analytics"],
      category: "Core Features"
    },
    {
      icon: <AlertTriangle className="h-8 w-8 text-emerald-600" />,
      title: "Issue Reporting",
      description: "Report and track infrastructure issues, water quality problems, and logistics challenges.",
      benefits: ["Automated alerts", "Priority classification", "Resolution tracking", "Team collaboration"],
      category: "Core Features"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-emerald-600" />,
      title: "Quality Monitoring",
      description: "Comprehensive water quality testing and compliance tracking with detailed analytics.",
      benefits: ["Multi-parameter testing", "Compliance reporting", "Trend analysis", "Regulatory alerts"],
      category: "Core Features"
    },
    {
      icon: <Truck className="h-8 w-8 text-emerald-600" />,
      title: "Distribution Management",
      description: "Efficient water distribution planning and execution with driver and beneficiary management.",
      benefits: ["Route optimization", "Delivery tracking", "Inventory management", "Schedule planning"],
      category: "Operations"
    },
    {
      icon: <Users className="h-8 w-8 text-emerald-600" />,
      title: "Community Forum",
      description: "Connect with community members, share updates, and discuss water-related topics.",
      benefits: ["Discussion threads", "Expert Q&A", "Resource sharing", "Community events"],
      category: "Community"
    },
    {
      icon: <FileText className="h-8 w-8 text-emerald-600" />,
      title: "Blog & Updates",
      description: "Stay informed with the latest news, updates, and educational content about water management.",
      benefits: ["Industry news", "Educational content", "Best practices", "Case studies"],
      category: "Resources"
    }
  ];

  const stats = [
    { number: "500+", label: "Water Sources Monitored", icon: <Droplets className="h-6 w-6" /> },
    { number: "10K+", label: "Beneficiaries Served", icon: <Users className="h-6 w-6" /> },
    { number: "50+", label: "Active Drivers", icon: <Truck className="h-6 w-6" /> },
    { number: "99.9%", label: "Uptime Guarantee", icon: <Shield className="h-6 w-6" /> }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Water District Manager",
      content: "SanityFlow has transformed how we manage our water infrastructure. The real-time monitoring and automated alerts have significantly improved our response times.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Environmental Engineer",
      content: "The quality monitoring features are exceptional. We've achieved 95% compliance improvement since implementing SanityFlow.",
      rating: 5
    },
    {
      name: "Dr. Maria Rodriguez",
      role: "Public Health Officer",
      content: "As a community health advocate, I appreciate how SanityFlow ensures clean water access for underserved populations.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/5 to-emerald-800/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Powerful <span className="text-emerald-600">Features</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Discover all the tools and capabilities that make SanityFlow the leading
              water management platform for communities worldwide.
            </p>
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 text-lg px-4 py-2">
              <Zap className="h-5 w-5 mr-2" />
              Enterprise-Grade Water Management
            </Badge>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center mb-2">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-emerald-100 text-sm md:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Feature Set
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to manage water resources effectively and ensure community health.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:-translate-y-1">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors">
                      {feature.icon}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {feature.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl text-gray-900 group-hover:text-emerald-700 transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 mb-4 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                  <div className="space-y-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-emerald-600 mr-2 flex-shrink-0" />
                        {benefit}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Advanced Capabilities
            </h2>
            <p className="text-xl text-gray-600">
              Cutting-edge features that set SanityFlow apart from traditional water management systems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
                <MapPin className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">GPS Location Tracking</h3>
              <p className="text-gray-600">Real-time GPS tracking of water sources, delivery vehicles, and infrastructure assets.</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
                <Activity className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Predictive Analytics</h3>
              <p className="text-gray-600">AI-powered predictions for maintenance needs, water demand, and quality trends.</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
                <Heart className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Community Integration</h3>
              <p className="text-gray-600">Seamless integration with community systems and stakeholder communication platforms.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Water Management Professionals
            </h2>
            <p className="text-xl text-gray-600">
              See what industry experts say about SanityFlow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-md">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-gray-600 mb-6 italic">
                    "{testimonial.content}"
                  </blockquote>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Image Placeholder */}
      <section className="py-24 bg-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="aspect-video bg-gradient-to-br from-white/10 to-white/5 rounded-lg flex items-center justify-center mb-8">
            <div className="text-center">
              <TrendingUp className="h-24 w-24 text-white mx-auto mb-4" />
              <p className="text-white font-semibold text-lg">Proven Results: 99.9% System Reliability</p>
              <p className="text-emerald-100 text-sm">Serving 500+ communities with zero downtime incidents</p>
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Experience These Features?
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            Join thousands of organizations already using SanityFlow to transform their water management operations.
          </p>
          <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-50">
            Start Your Free Trial
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}