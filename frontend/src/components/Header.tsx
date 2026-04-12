import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Droplets } from "lucide-react";

export function Header() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Droplets className="h-8 w-8 text-emerald-600" />
            <span className="text-xl font-bold text-gray-900">
              Sanity<span className="text-emerald-600">Flow</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                isActive("/")
                  ? "text-emerald-600 bg-emerald-50 rounded-md"
                  : "text-gray-700 hover:text-emerald-600"
              }`}
            >
              Home
            </Link>
            <Link
              to="/features"
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                isActive("/features")
                  ? "text-emerald-600 bg-emerald-50 rounded-md"
                  : "text-gray-700 hover:text-emerald-600"
              }`}
            >
              Features
            </Link>
            <Link
              to="/about"
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                isActive("/about")
                  ? "text-emerald-600 bg-emerald-50 rounded-md"
                  : "text-gray-700 hover:text-emerald-600"
              }`}
            >
              About
            </Link>
            <Link
              to="/forum"
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                isActive("/forum")
                  ? "text-emerald-600 bg-emerald-50 rounded-md"
                  : "text-gray-700 hover:text-emerald-600"
              }`}
            >
              Forum
            </Link>
            <Link
              to="/blog"
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                isActive("/blog")
                  ? "text-emerald-600 bg-emerald-50 rounded-md"
                  : "text-gray-700 hover:text-emerald-600"
              }`}
            >
              Blog
            </Link>
          </nav>

          {/* Login Button */}
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Link to="/login">
              Login
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}