import { Link } from "react-router-dom";
import { Droplets, Mail, Phone, MapPin, ExternalLink, MessageCircle, Globe, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Droplets className="h-8 w-8 text-emerald-400" />
              <span className="text-xl font-bold">
                Sanity<span className="text-emerald-400">Flow</span>
              </span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Empowering communities with technology that ensures clean, reliable water access for every person, everywhere.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                <Globe className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                <MessageCircle className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                <Heart className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                <ExternalLink className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/" className="block text-gray-300 hover:text-emerald-400 transition-colors text-sm">
                Home
              </Link>
              <Link to="/features" className="block text-gray-300 hover:text-emerald-400 transition-colors text-sm">
                Features
              </Link>
              <Link to="/about" className="block text-gray-300 hover:text-emerald-400 transition-colors text-sm">
                About Us
              </Link>
              <Link to="/documentation" className="block text-gray-300 hover:text-emerald-400 transition-colors text-sm">
                Documentation
              </Link>
              <Link to="/help" className="block text-gray-300 hover:text-emerald-400 transition-colors text-sm">
                Help Center
              </Link>
              <Link to="/forum" className="block text-gray-300 hover:text-emerald-400 transition-colors text-sm">
                Community Forum
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Support</h3>
            <div className="space-y-2">
              <Link to="/contact" className="block text-gray-300 hover:text-emerald-400 transition-colors text-sm">
                Contact Us
              </Link>
              <Link to="/help" className="block text-gray-300 hover:text-emerald-400 transition-colors text-sm">
                FAQ
              </Link>
              <Link to="/privacy" className="block text-gray-300 hover:text-emerald-400 transition-colors text-sm">
                Privacy Policy
              </Link>
              <a href="#" className="block text-gray-300 hover:text-emerald-400 transition-colors text-sm">
                Terms of Service
              </a>
              <a href="#" className="block text-gray-300 hover:text-emerald-400 transition-colors text-sm">
                Status
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 text-sm">
                  123 Water Street<br />
                  Clean City, CC 12345
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                <span className="text-gray-300 text-sm">support@sanityflow.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 SanityFlow. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                Privacy
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                Terms
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}