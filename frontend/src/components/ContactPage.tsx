import { Header } from "./Header";
import { Footer } from "./Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Users,
  Headphones
} from "lucide-react";

export function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/5 to-emerald-800/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Contact <span className="text-emerald-600">Us</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Get in touch with our team. We're here to help you with your water management needs.
          </p>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Get In Touch</h2>

              <div className="space-y-6">
                <Card className="border-0 shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-emerald-100 rounded-lg mr-4">
                        <Mail className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Email Us</h3>
                        <p className="text-gray-600">support@sanityflow.com</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-emerald-100 rounded-lg mr-4">
                        <Phone className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Call Us</h3>
                        <p className="text-gray-600">+1 (555) 123-4567</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-emerald-100 rounded-lg mr-4">
                        <MapPin className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Visit Us</h3>
                        <p className="text-gray-600">123 Water Street, Clean City, CC 12345</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="p-3 bg-emerald-100 rounded-lg mr-4">
                        <Clock className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Business Hours</h3>
                        <p className="text-gray-600">Mon-Fri: 9AM-6PM EST</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Image Placeholder */}
              <div className="mt-8">
                <div className="aspect-video bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="h-16 w-16 text-emerald-600 mx-auto mb-4" />
                    <p className="text-emerald-800 font-semibold">Expert Water Management Support</p>
                    <p className="text-emerald-700 text-sm">24/7 technical assistance & implementation guidance</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-900">Send us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="John" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Doe" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john@example.com" />
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="How can we help you?" />
                  </div>

                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your water management needs..."
                      rows={5}
                    />
                  </div>

                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Other Ways to Get Help
            </h2>
            <p className="text-xl text-gray-600">
              Explore additional resources and support options.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
                  <Users className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Forum</h3>
                <p className="text-gray-600 mb-4">
                  Connect with other users and share experiences in our community forum.
                </p>
                <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                  Visit Forum
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
                  <Headphones className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Live Chat</h3>
                <p className="text-gray-600 mb-4">
                  Get instant help from our support team through live chat.
                </p>
                <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                  Start Chat
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
                  <MessageSquare className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Documentation</h3>
                <p className="text-gray-600 mb-4">
                  Browse our comprehensive documentation and guides.
                </p>
                <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                  View Docs
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}