import { Link, useLocation } from "react-router-dom";
import {
  ChevronDown,
  HelpCircle,
  Home,
  BarChart2,
  ArrowRightLeft,
  Wallet,
  ClipboardList,
  PieChart,
  Settings,
  Feather,
  MessageSquare,
  Users,
  Truck,
  Package,
  Droplets,
  CloudSun
} from "lucide-react";

import { cn } from "../../lib/utils";

const mainMenu = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Blog", href: "/blog", icon: Feather },
  { name: "Forum", href: "/forum", icon: MessageSquare },
  { name: "Beneficiary", href: "/beneficiaries", icon: Users },
  { name: "Distribution", href: "/distributions", icon: Truck },
  { name: "Inventory", href: "/inventory", icon: Package },
  { name: "Water Source", href: "/water-sources", icon: Droplets },
  { name: "Weather", href: "/weather", icon: CloudSun },
];

const preferences = [
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Help Center", href: "/help", icon: HelpCircle },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-[#F3F4F6] px-4 py-6 text-sm">
      {/* Brand */}
      <div className="flex items-center gap-2 px-2 pb-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#A3F191] text-[#0A3622]">
          <Feather className="h-5 w-5" strokeWidth={2.5} />
        </div>
        <span className="text-[20px] font-bold text-[#0A3622] tracking-tight">SanityFlow</span>
      </div>

      {/* Profile Dropdown */}
      <div className="mb-6 flex items-center justify-between rounded-[14px] bg-white p-2 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <img
            src="https://github.com/shadcn.png"
            alt="Jenny Wilson"
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <span className="font-semibold text-gray-800 text-[13px]">Jenny Wilson</span>
            <span className="text-[12px] text-gray-500 font-medium">Personal Account</span>
          </div>
        </div>
        <ChevronDown className="h-4 w-4 text-gray-500 mr-1" />
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto no-scrollbar pb-6">
        {/* Main Menu */}
        <div className="mb-6">
          <h3 className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">MAIN MENU</h3>
          <nav className="flex flex-col gap-1">
            {mainMenu.map((item) => {
              // Exact match or active route base checking for styling
              const isActive = location.pathname === item.href || (location.pathname.startsWith(item.href) && item.href !== '/');
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200",
                    isActive
                      ? "bg-white text-gray-900 shadow-[0_2px_8px_rgb(0,0,0,0.04)] font-semibold"
                      : "text-gray-500 hover:bg-gray-200 hover:text-gray-700 font-medium"
                  )}
                >
                  <item.icon className={cn("h-[20px] w-[20px]", isActive ? "text-[#0A3622]" : "text-gray-500")} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[14px]">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Preferences */}
        <div className="mb-2">
          <h3 className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">PREFERENCE</h3>
          <nav className="flex flex-col gap-1">
            {preferences.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200",
                    isActive
                      ? "bg-white text-gray-900 shadow-[0_2px_8px_rgb(0,0,0,0.04)] font-semibold"
                      : "text-gray-500 hover:bg-gray-200 hover:text-gray-700 font-medium"
                  )}
                >
                  <item.icon className={cn("h-[20px] w-[20px]", isActive ? "text-[#0A3622]" : "text-gray-500")} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[14px]">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
}
