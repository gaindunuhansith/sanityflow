import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "./Header";
import { Footer } from "./Footer";
import {
  Droplets,
  AlertTriangle,
  BarChart3,
  Users,
  Truck,
  FileText,
  Shield,
  ArrowRight,
  CheckCircle,
  MapPin,
  Activity,
  Heart
} from "lucide-react";

export function HomePage() {
  const features = [
    {
      icon: <Droplets className="h-8 w-8 text-emerald-600" />,
      title: "Water Source Management",
      description: "Monitor and manage reservoirs, wells, and water infrastructure with real-time capacity tracking.",
      link: "/dashboard/water-sources"
    },
    {
      icon: <AlertTriangle className="h-8 w-8 text-emerald-600" />,
      title: "Issue Reporting",
      description: "Report and track infrastructure issues, water quality problems, and logistics challenges.",
      link: "/dashboard/issues"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-emerald-600" />,
      title: "Quality Monitoring",
      description: "Comprehensive water quality testing and compliance tracking with detailed analytics.",
      link: "/dashboard/water-tests"
    },
    {
      icon: <Truck className="h-8 w-8 text-emerald-600" />,
      title: "Distribution Management",
      description: "Efficient water distribution planning and execution with driver and beneficiary management.",
      link: "/dashboard/distributions"
    },
    {
      icon: <Users className="h-8 w-8 text-emerald-600" />,
      title: "Community Forum",
      description: "Connect with community members, share updates, and discuss water-related topics.",
      link: "/dashboard/forum"
    },
    {
      icon: <FileText className="h-8 w-8 text-emerald-600" />,
      title: "Blog & Updates",
      description: "Stay informed with the latest news, updates, and educational content about water management.",
      link: "/dashboard/blog"
    }
  ];

  const stats = [
    { number: "500+", label: "Water Sources" },
    { number: "10K+", label: "Beneficiaries" },
    { number: "50+", label: "Active Drivers" },
    { number: "99.9%", label: "Uptime" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/5 to-emerald-800/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <Badge variant="secondary" className="mb-4 bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
                <Shield className="h-4 w-4 mr-1" />
                Water Management Platform
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Sanity<span className="text-emerald-600">Flow</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
                Comprehensive water resource management system for communities.
                Monitor quality, track distribution, and ensure reliable access to clean water.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3">
                  <Link to="/login">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              {/* Hero Image Placeholder */}
              <div className="aspect-square bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center shadow-2xl">
                <div className="text-center">
                  <Droplets className="h-24 w-24 text-emerald-600 mx-auto mb-4" />
                  <p className="text-emerald-800 font-semibold text-lg">Real-Time Water Quality Monitoring</p>
                  <p className="text-emerald-700 text-sm">AI-powered analytics & predictive maintenance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-emerald-100 text-sm md:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Water Management
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage water resources efficiently and ensure community access to clean water.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:-translate-y-1">
                <CardHeader className="pb-4">
                  <div className="mb-4 p-3 bg-emerald-50 rounded-lg w-fit group-hover:bg-emerald-100 transition-colors">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl text-gray-900 group-hover:text-emerald-700 transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Graphics Section */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
                <MapPin className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Location Tracking</h3>
              <p className="text-gray-600">GPS-enabled monitoring of water sources and distribution points</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
                <Heart className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Community Focus</h3>
              <p className="text-gray-600">Dedicated to improving water access for underserved communities</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
                <Activity className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Analytics</h3>
              <p className="text-gray-600">Advanced reporting and insights for better decision making</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              {/* About Image Placeholder */}
              <div className="aspect-square bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center shadow-xl">
                <div className="text-center">
                  <Activity className="h-20 w-20 text-emerald-600 mx-auto mb-4" />
                  <p className="text-emerald-800 font-semibold text-lg">Real-time Monitoring</p>
                  <p className="text-emerald-700 text-sm">Advanced analytics & reporting</p>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Ensuring Clean Water Access for Communities
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                SanityFlow provides comprehensive tools for water resource management,
                from source monitoring to distribution tracking. Our platform helps communities
                maintain water quality standards and ensure reliable access to clean water.
              </p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mr-3" />
                  <span className="text-gray-700">Real-time monitoring and alerts</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mr-3" />
                  <span className="text-gray-700">Comprehensive quality testing</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mr-3" />
                  <span className="text-gray-700">Efficient distribution management</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mr-3" />
                  <span className="text-gray-700">Community engagement tools</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-24 bg-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Water Management?
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            Join thousands of communities using SanityFlow to ensure clean water access.
          </p>
          <Button asChild size="lg" className="bg-white text-emerald-600 hover:bg-gray-50 px-8 py-3">
            <Link to="/login">
              Start Managing Water Resources
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}