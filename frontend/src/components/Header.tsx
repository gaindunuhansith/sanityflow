import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Droplets, LogOut, User as UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/features/auth/authSlice";
import { getDefaultDashboardPath } from "@/features/auth/redirects";
import type { AppDispatch, RootState } from "@/store";
import { authApi } from "@/features/auth/authApi";
import { forumApi } from "@/features/forum/forumApi";
import { distributionApi } from "@/features/distribution/distributionApi";
import { beneficiaryApi } from "@/features/beneficiary/beneficiaryApi";

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const authUser = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(authApi.util.resetApiState());
    dispatch(forumApi.util.resetApiState());
    dispatch(distributionApi.util.resetApiState());
    dispatch(beneficiaryApi.util.resetApiState());
    navigate("/", { replace: true });
  };

  const getDashboardHome = () => {
    if (!authUser) {
      return "/dashboard";
    }

    return getDefaultDashboardPath(authUser.role);
  };

  const getProfilePath = () => {
    if (authUser?.role === "member") {
      return "/member/dashboard/profile";
    }
    return "/dashboard/profile";
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

          {isAuthenticated && authUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-8.5 w-8.5 cursor-pointer ring-2 ring-emerald-600/20 hover:ring-emerald-600 transition-all select-none">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${authUser.email || "User"}`}
                    alt={authUser.name || "User"}
                  />
                  <AvatarFallback>{authUser.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-gray-900">{authUser.name || "SanityFlow User"}</p>
                    <p className="text-xs leading-none text-gray-500">{authUser.email}</p>
                    <p className="text-[10px] font-semibold tracking-wider text-emerald-700 mt-1 uppercase">{authUser.role}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate(getDashboardHome())} className="cursor-pointer">
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Go to Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate(getProfilePath())} className="cursor-pointer">
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-700 cursor-pointer focus:bg-red-50">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" asChild>
                <Link to="/signup">Signup</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}