import { Header } from "./Header";
import { Footer } from "./Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Book,
  FileText,
  Video,
  Download,
  ExternalLink,
  ChevronRight,
  Lightbulb,
  Settings,
  BarChart3
} from "lucide-react";

export function DocumentationPage() {
  const quickStartGuides = [
    {
      title: "Getting Started",
      description: "Learn the basics of SanityFlow and set up your first water management project.",
      icon: <Lightbulb className="h-6 w-6" />,
      time: "10 min read"
    },
    {
      title: "Water Source Setup",
      description: "Configure and monitor your water sources with step-by-step instructions.",
      icon: <Settings className="h-6 w-6" />,
      time: "15 min read"
    },
    {
      title: "Quality Testing",
      description: "Set up automated water quality testing and compliance monitoring.",
      icon: <BarChart3 className="h-6 w-6" />,
      time: "12 min read"
    }
  ];

  const documentationSections = [
    {
      title: "User Guides",
      description: "Step-by-step guides for using SanityFlow features",
      icon: <Book className="h-8 w-8" />,
      articles: 24,
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "API Reference",
      description: "Complete API documentation for developers",
      icon: <FileText className="h-8 w-8" />,
      articles: 18,
      color: "bg-green-100 text-green-600"
    },
    {
      title: "Video Tutorials",
      description: "Visual guides and walkthroughs",
      icon: <Video className="h-8 w-8" />,
      articles: 12,
      color: "bg-purple-100 text-purple-600"
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
              Documentation
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Everything you need to know about using SanityFlow effectively.
              From setup to advanced features, we've got you covered.
            </p>

            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search documentation..."
                className="pl-10 pr-4 py-3 text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Quick Start Guides
            </h2>
            <p className="text-xl text-gray-600">
              Get up and running with SanityFlow in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {quickStartGuides.map((guide, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:-translate-y-1">
                <CardHeader className="pb-4">
                  <div className="p-3 bg-emerald-50 rounded-lg w-fit mb-4 group-hover:bg-emerald-100 transition-colors">
                    {guide.icon}
                  </div>
                  <CardTitle className="text-xl text-gray-900 group-hover:text-emerald-700 transition-colors">
                    {guide.title}
                  </CardTitle>
                  <Badge variant="secondary" className="w-fit">
                    {guide.time}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 mb-4 leading-relaxed">
                    {guide.description}
                  </CardDescription>
                  <Button variant="ghost" className="p-0 h-auto text-emerald-600 hover:text-emerald-700 hover:bg-transparent">
                    Read Guide
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Documentation Sections */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Browse Documentation
            </h2>
            <p className="text-xl text-gray-600">
              Explore our comprehensive documentation library.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {documentationSections.map((section, index) => (
              <Card key={index} className="text-center border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${section.color} rounded-full mb-4`}>
                    {section.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{section.title}</h3>
                  <p className="text-gray-600 mb-4">{section.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{section.articles} articles</Badge>
                    <Button variant="ghost" size="sm">
                      Browse
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Topics */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Topics
            </h2>
            <p className="text-xl text-gray-600">
              Frequently accessed documentation and guides.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Download className="h-5 w-5 mr-2 text-emerald-600" />
                  Downloads & Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center justify-between">
                    <span className="text-gray-700">SanityFlow API Documentation</span>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-gray-700">Mobile App User Guide</span>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-gray-700">Integration Templates</span>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ExternalLink className="h-5 w-5 mr-2 text-emerald-600" />
                  External Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center justify-between">
                    <span className="text-gray-700">Water Quality Standards</span>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-gray-700">Industry Best Practices</span>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-gray-700">Regulatory Compliance Guide</span>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Documentation Image Placeholder */}
      <section className="py-24 bg-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="aspect-video bg-gradient-to-br from-white/10 to-white/5 rounded-lg flex items-center justify-center mb-8">
            <div className="text-center">
              <Book className="h-24 w-24 text-white mx-auto mb-4" />
              <p className="text-white font-semibold text-lg">Complete Implementation Guides</p>
              <p className="text-emerald-100 text-sm">Step-by-step deployment, API references, & best practices</p>
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Need More Help?
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-50">
            Contact Support
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}