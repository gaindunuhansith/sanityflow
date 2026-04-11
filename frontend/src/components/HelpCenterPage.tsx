import { Link } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Search,
  HelpCircle,
  MessageSquare,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Users
} from "lucide-react";

export function HelpCenterPage() {
  const faqs = [
    {
      question: "How do I set up my first water source?",
      answer: "To set up your first water source, navigate to the Water Sources section in your dashboard, click 'Add New Source', and follow the step-by-step wizard. You'll need to provide location details, capacity information, and monitoring preferences."
    },
    {
      question: "What should I do if water quality readings are abnormal?",
      answer: "If you notice abnormal water quality readings, first check your sensor calibration. If the issue persists, create an issue report in the Issues section and our team will investigate. You can also set up automated alerts for critical parameters."
    },
    {
      question: "How do I add new team members to my organization?",
      answer: "Organization administrators can add new team members through the User Management section. Click 'Invite User', enter their email address, and assign appropriate roles and permissions. Invited users will receive an email with setup instructions."
    },
    {
      question: "Can I export my data for external analysis?",
      answer: "Yes, you can export your data in various formats including CSV, Excel, and JSON. Go to the Reports section, select your desired date range and data types, then choose your preferred export format. Large datasets may take a few minutes to process."
    },
    {
      question: "How do I set up automated alerts?",
      answer: "Automated alerts can be configured in the Settings section. Choose the parameter you want to monitor, set threshold values, and select notification methods (email, SMS, or in-app notifications). You can also create custom alert rules based on multiple conditions."
    }
  ];

  const supportOptions = [
    {
      title: "Live Chat",
      description: "Get instant help from our support team",
      icon: <MessageSquare className="h-6 w-6" />,
      availability: "Available 24/7",
      response: "< 2 minutes"
    },
    {
      title: "Email Support",
      description: "Send us a detailed message about your issue",
      icon: <Mail className="h-6 w-6" />,
      availability: "Mon-Fri, 9AM-6PM EST",
      response: "< 4 hours"
    },
    {
      title: "Phone Support",
      description: "Speak directly with our technical experts",
      icon: <Phone className="h-6 w-6" />,
      availability: "Mon-Fri, 9AM-6PM EST",
      response: "Immediate"
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
              Help <span className="text-emerald-600">Center</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Find answers to your questions and get the support you need.
              We're here to help you succeed with SanityFlow.
            </p>

            {/* Search Bar */}
            <div className="max-w-md mx-auto relative mb-8">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search for help..."
                className="pl-10 pr-4 py-3 text-lg"
              />
            </div>

            {/* Browse Documentation Button */}
            <div className="flex justify-center">
              <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3">
                <Link to="/documentation">
                  Browse Documentation
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How Can We Help You?
            </h2>
            <p className="text-xl text-gray-600">
              Choose the support option that works best for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {supportOptions.map((option, index) => (
              <Card key={index} className="text-center border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
                    {option.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{option.title}</h3>
                  <p className="text-gray-600 mb-4">{option.description}</p>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center justify-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {option.availability}
                    </div>
                    <div className="flex items-center justify-center text-sm text-emerald-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Response: {option.response}
                    </div>
                  </div>
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                    Get Help
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Quick answers to common questions about SanityFlow.
            </p>
          </div>

          <Card className="border-0 shadow-md">
            <CardContent className="p-8">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Quick Help Topics */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Help Topics
            </h2>
            <p className="text-xl text-gray-600">
              Browse our most requested help articles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="p-3 bg-blue-100 rounded-lg w-fit mb-4">
                  <HelpCircle className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Getting Started</h3>
                <p className="text-sm text-gray-600 mb-4">New to SanityFlow? Start here.</p>
                <Button variant="ghost" size="sm" className="p-0 h-auto text-blue-600">
                  Learn more →
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="p-3 bg-green-100 rounded-lg w-fit mb-4">
                  <AlertCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Troubleshooting</h3>
                <p className="text-sm text-gray-600 mb-4">Common issues and solutions.</p>
                <Button variant="ghost" size="sm" className="p-0 h-auto text-green-600">
                  Learn more →
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="p-3 bg-purple-100 rounded-lg w-fit mb-4">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Account & Billing</h3>
                <p className="text-sm text-gray-600 mb-4">Manage your account settings.</p>
                <Button variant="ghost" size="sm" className="p-0 h-auto text-purple-600">
                  Learn more →
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="p-3 bg-orange-100 rounded-lg w-fit mb-4">
                  <Lightbulb className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Best Practices</h3>
                <p className="text-sm text-gray-600 mb-4">Tips for optimal usage.</p>
                <Button variant="ghost" size="sm" className="p-0 h-auto text-orange-600">
                  Learn more →
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Help Center Image Placeholder */}
      <section className="py-24 bg-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="aspect-video bg-gradient-to-br from-white/10 to-white/5 rounded-lg flex items-center justify-center mb-8">
            <div className="text-center">
              <HelpCircle className="h-24 w-24 text-white mx-auto mb-4" />
              <p className="text-white font-semibold text-lg">Average Response Time: 2 Hours</p>
              <p className="text-emerald-100 text-sm">Dedicated support team with water management expertise</p>
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Still Need Help?
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            Our comprehensive help center has everything you need, but if you can't find what you're looking for, we're just a click away.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-50">
              Contact Support
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-emerald-600">
              Browse Documentation
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}