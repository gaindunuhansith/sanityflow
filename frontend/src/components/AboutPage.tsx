import { Header } from "./Header";
import { Footer } from "./Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Target,
  Globe,
  Heart,
  CheckCircle,
  Shield,
  Lightbulb,
  HandHeart,
  Droplets
} from "lucide-react";

export function AboutPage() {
  const values = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Reliability",
      description: "We ensure consistent, dependable water management solutions that communities can count on."
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Community Focus",
      description: "Every decision we make prioritizes the health and well-being of the communities we serve."
    },
    {
      icon: <Lightbulb className="h-8 w-8" />,
      title: "Innovation",
      description: "We continuously evolve our technology to meet the changing needs of water management."
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Sustainability",
      description: "We promote responsible water usage and environmental stewardship in all our operations."
    }
  ];

  const milestones = [
    {
      year: "2020",
      title: "Company Founded",
      description: "SanityFlow was established with a mission to revolutionize water management through technology."
    },
    {
      year: "2021",
      title: "First Major Deployment",
      description: "Successfully implemented our platform in 50+ communities across three states."
    },
    {
      year: "2022",
      title: "Industry Recognition",
      description: "Received multiple awards for innovation in water technology and community impact."
    },
    {
      year: "2023",
      title: "Global Expansion",
      description: "Extended our services to international markets, helping communities worldwide."
    },
    {
      year: "2024",
      title: "AI Integration",
      description: "Launched advanced AI-powered analytics for predictive water management."
    },
    {
      year: "2026",
      title: "Future Vision",
      description: "Continuing to innovate and expand our impact on global water management."
    }
  ];

  const team = [
    {
      name: "Dr. Sarah Chen",
      role: "CEO & Co-Founder",
      expertise: "Environmental Engineering",
      image: "👩‍🔬"
    },
    {
      name: "Marcus Johnson",
      role: "CTO & Co-Founder",
      expertise: "Software Architecture",
      image: "👨‍💻"
    },
    {
      name: "Dr. Maria Rodriguez",
      role: "Chief Scientist",
      expertise: "Water Quality Research",
      image: "👩‍⚕️"
    },
    {
      name: "David Kim",
      role: "VP of Operations",
      expertise: "Project Management",
      image: "👨‍💼"
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
            <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-6">
              <Droplets className="h-10 w-10 text-emerald-600" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              About <span className="text-emerald-600">SanityFlow</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              We're on a mission to ensure clean, reliable water access for communities worldwide
              through innovative technology and unwavering commitment to public health.
            </p>
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 text-lg px-4 py-2">
              <Target className="h-5 w-5 mr-2" />
              Mission-Driven Technology
            </Badge>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                To empower communities with technology that ensures clean, reliable water access
                for every person, everywhere. We believe that access to safe drinking water is a
                fundamental human right, and we're committed to making it a reality through
                innovative solutions and collaborative partnerships.
              </p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mr-3" />
                  <span className="text-gray-700">Ensure water quality compliance</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mr-3" />
                  <span className="text-gray-700">Optimize resource distribution</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mr-3" />
                  <span className="text-gray-700">Prevent water-related health issues</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mr-3" />
                  <span className="text-gray-700">Promote sustainable water usage</span>
                </div>
              </div>
            </div>
            <div className="relative">
              {/* Mission Image Placeholder */}
              <div className="aspect-square bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center shadow-xl">
                <div className="text-center">
                  <Target className="h-20 w-20 text-emerald-600 mx-auto mb-4" />
                  <p className="text-emerald-800 font-semibold text-lg">Impact: 10M+ People Served</p>
                  <p className="text-emerald-700 text-sm">500+ communities, 99.9% uptime reliability</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600">
              The principles that guide everything we do.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600">
              Key milestones in our mission to transform water management.
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-emerald-200 hidden md:block"></div>

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}>
                    <Card className="border-0 shadow-md">
                      <CardContent className="p-6">
                        <Badge className="mb-3 bg-emerald-600">{milestone.year}</Badge>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{milestone.title}</h3>
                        <p className="text-gray-600">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="hidden md:block w-4 h-4 bg-emerald-600 rounded-full border-4 border-white shadow-md mx-4"></div>
                  <div className="w-full md:w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600">
              Experts dedicated to advancing water management technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center border-0 shadow-md">
                <CardContent className="p-8">
                  <div className="text-6xl mb-4">{member.image}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-emerald-600 font-medium mb-2">{member.role}</p>
                  <p className="text-sm text-gray-500">{member.expertise}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-24 bg-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our Impact
            </h2>
            <p className="text-xl text-emerald-100">
              Real results from our commitment to clean water access.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">500+</div>
              <div className="text-emerald-100">Communities Served</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">10M+</div>
              <div className="text-emerald-100">People with Clean Water</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">99.9%</div>
              <div className="text-emerald-100">System Reliability</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">24/7</div>
              <div className="text-emerald-100">Monitoring & Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Image Placeholder */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="aspect-video bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg flex items-center justify-center mb-8">
            <div className="text-center">
              <HandHeart className="h-24 w-24 text-emerald-600 mx-auto mb-4" />
              <p className="text-emerald-800 font-semibold text-lg">Global Water Crisis Solutions</p>
              <p className="text-emerald-700 text-sm">Technology-driven approach to sustainable water management</p>
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Join Our Mission
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Help us ensure that every community has access to clean, reliable water.
            Together, we can make a lasting impact on global water management.
          </p>
          <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
            Get Involved
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}