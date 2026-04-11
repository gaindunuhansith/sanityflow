import { Header } from "./Header";
import { Footer } from "./Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Lock,
  Eye,
  Database,
  Users,
  FileText,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

export function PrivacyPolicyPage() {
  const sections = [
    {
      title: "Information We Collect",
      icon: <Database className="h-6 w-6" />,
      content: [
        "Personal information you provide (name, email, contact details)",
        "Water management data and sensor readings",
        "Usage analytics and system logs",
        "Device and browser information for security"
      ]
    },
    {
      title: "How We Use Your Information",
      icon: <Eye className="h-6 w-6" />,
      content: [
        "Provide and maintain our water management services",
        "Process transactions and send related information",
        "Send technical notices and support messages",
        "Improve our services through analytics"
      ]
    },
    {
      title: "Information Sharing",
      icon: <Users className="h-6 w-6" />,
      content: [
        "We do not sell your personal information to third parties",
        "Limited sharing with service providers for business operations",
        "Legal requirements and safety concerns",
        "Aggregated, anonymized data for research purposes"
      ]
    },
    {
      title: "Data Security",
      icon: <Lock className="h-6 w-6" />,
      content: [
        "Industry-standard encryption for data transmission",
        "Secure data centers with access controls",
        "Regular security audits and updates",
        "Employee training on data protection"
      ]
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-6">
              <Shield className="h-8 w-8 text-emerald-600" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Privacy <span className="text-emerald-600">Policy</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Your privacy is important to us. Learn how we collect, use, and protect your information.
            </p>
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
              Last updated: April 11, 2026
            </Badge>
          </div>
        </div>
      </section>

      {/* Privacy Overview */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Commitment to Privacy
            </h2>
            <p className="text-xl text-gray-600">
              We are committed to protecting your personal information and being transparent about our practices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <Card className="border-0 shadow-md">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <CheckCircle className="h-6 w-6 text-emerald-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Transparent Practices</h3>
                </div>
                <p className="text-gray-600">
                  We clearly explain what information we collect and how we use it.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <CheckCircle className="h-6 w-6 text-emerald-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Your Control</h3>
                </div>
                <p className="text-gray-600">
                  You have control over your data and can request access or deletion.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <CheckCircle className="h-6 w-6 text-emerald-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Security First</h3>
                </div>
                <p className="text-gray-600">
                  We implement robust security measures to protect your information.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <CheckCircle className="h-6 w-6 text-emerald-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">No Hidden Agendas</h3>
                </div>
                <p className="text-gray-600">
                  We don't sell your data or use it for unauthorized purposes.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Detailed Privacy Information */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {sections.map((section, index) => (
              <Card key={index} className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl text-gray-900">
                    <div className="p-2 bg-emerald-100 rounded-lg mr-3">
                      {section.icon}
                    </div>
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Questions About Privacy?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            If you have any questions about this Privacy Policy or our data practices,
            please don't hesitate to contact us.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="p-3 bg-blue-100 rounded-lg w-fit mx-auto mb-4">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Privacy Officer</h3>
                <p className="text-gray-600 text-sm">privacy@sanityflow.com</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="p-3 bg-green-100 rounded-lg w-fit mx-auto mb-4">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Data Protection</h3>
                <p className="text-gray-600 text-sm">dpo@sanityflow.com</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="p-3 bg-purple-100 rounded-lg w-fit mx-auto mb-4">
                  <AlertTriangle className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Report Concerns</h3>
                <p className="text-gray-600 text-sm">security@sanityflow.com</p>
              </CardContent>
            </Card>
          </div>

          <p className="text-sm text-gray-500">
            You can also reach us at: 123 Water Street, Clean City, CC 12345 | +1 (555) 123-4567
          </p>
        </div>
      </section>

      {/* Privacy Policy Image Placeholder */}
      <section className="py-24 bg-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="aspect-video bg-gradient-to-br from-white/10 to-white/5 rounded-lg flex items-center justify-center mb-8">
            <div className="text-center">
              <Lock className="h-24 w-24 text-white mx-auto mb-4" />
              <p className="text-white font-semibold text-lg">GDPR & SOC 2 Compliant</p>
              <p className="text-emerald-100 text-sm">Enterprise-grade security for sensitive water infrastructure data</p>
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Privacy is a Priority
          </h2>
          <p className="text-xl text-emerald-100">
            We believe in transparency, security, and giving you control over your data.
            Your trust is our most valuable asset.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}