import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ChevronDown,
  HelpCircle,
  Home,
  Feather,
  MessageSquare,
  Users,
  Truck,
  Package,
  Droplets,
  CloudSun,
  Settings,
  AlertTriangle,
  ShieldCheck,
  LogOut
} from "lucide-react";
import { logout } from "@/features/auth/authSlice";
import { authApi } from "@/features/auth/authApi";
import { forumApi } from "@/features/forum/forumApi";
import { distributionApi } from "@/features/distribution/distributionApi";
import type { AppDispatch, RootState } from "@/store";

import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const mainMenu = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Blog", href: "/blog", icon: Feather },
  { name: "Forum", href: "/forum", icon: MessageSquare },
  { name: "Issues", href: "/issues", icon: AlertTriangle },
  { name: "Beneficiary", href: "/beneficiaries", icon: Users },
  { name: "Drivers", href: "/drivers", icon: Users },
  { name: "Distribution", href: "/distributions", icon: Truck },
  { name: "Inventory", href: "/inventory", icon: Package },
  { name: "Water Source", href: "/water-sources", icon: Droplets },
  { name: "Water Quality", href: "/water-tests", icon: ShieldCheck },
  { name: "Weather", href: "/weather", icon: CloudSun },
];

const preferences = [
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Help Center", href: "/help", icon: HelpCircle },
];

export function Sidebar() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const authUser = useSelector((state: RootState) => state.auth.user);

  const savedUser = localStorage.getItem("user");
  const fallbackUser = savedUser ? (JSON.parse(savedUser) as { name?: string; email?: string; role?: string }) : null;
  const displayName = authUser?.name ?? fallbackUser?.name ?? "Unknown User";
  const displayEmail = authUser?.email ?? fallbackUser?.email ?? "No email";
  const displayRole = (authUser?.role ?? fallbackUser?.role ?? "member").toUpperCase();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(authApi.util.resetApiState());
    dispatch(forumApi.util.resetApiState());
    dispatch(distributionApi.util.resetApiState());
    navigate('/login', { replace: true });
  };

  return (
    <ShadcnSidebar className="bg-[#F3F4F6]">
      <SidebarHeader className="p-4 pb-2">
        {/* Brand */}
        <div className="flex items-center gap-2 px-2 pb-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#A3F191] text-[#0A3622]">
            <Feather className="h-5 w-5" strokeWidth={2.5} />
          </div>
          <span className="text-[20px] font-bold text-[#0A3622] tracking-tight">SanityFlow</span>
        </div>

        {/* Profile */}
        <div className="mb-2 flex items-center justify-between rounded-[14px] bg-white p-2 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <img
              src="https://github.com/shadcn.png"
              alt={displayName}
              className="h-10 w-10 rounded-full object-cover"
            />
            <div className="flex flex-col">
              <span className="font-semibold text-gray-800 text-[13px]">{displayName}</span>
              <span className="text-[12px] text-gray-500 font-medium">{displayRole} • {displayEmail}</span>
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-500 mr-1" />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 flex flex-col">
        {/* Main Menu */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 px-2 py-4">
            MAIN MENU
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenu.map((item) => {
                const isActive = location.pathname === item.href || (location.pathname.startsWith(item.href) && item.href !== '/');
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={isActive ? "bg-white text-gray-900 shadow-[0_2px_8px_rgb(0,0,0,0.04)] font-semibold rounded-xl py-5" : "text-gray-500 hover:bg-gray-200 hover:text-gray-700 font-medium rounded-xl py-5"}
                    >
                      <Link to={item.href}>
                        <item.icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
                        <span className="text-[14px]">{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Preferences */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 px-2 py-4 text-left">
            PREFERENCE
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {preferences.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={isActive ? "bg-white text-gray-900 shadow-[0_2px_8px_rgb(0,0,0,0.04)] font-semibold rounded-xl py-5" : "text-gray-500 hover:bg-gray-200 hover:text-gray-700 font-medium rounded-xl py-5"}
                    >
                      <Link to={item.href}>
                        <item.icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
                        <span className="text-[14px]">{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto pb-3">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 rounded-[12px] border border-gray-200 bg-white px-3 py-2 text-[13px] font-semibold text-gray-700 hover:bg-gray-50"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </SidebarContent>
    </ShadcnSidebar>
  );
}
