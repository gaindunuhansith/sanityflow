import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Truck, 
  Users, 
  Box,
  Droplet,
  LogOut,
  Settings,
  HeartPulse
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Distributions", href: "/distributions", icon: Box },
  { name: "Drivers", href: "/drivers", icon: Truck },
  { name: "Beneficiaries", href: "/beneficiaries", icon: Users },
  { name: "Water Sources", href: "/water-sources", icon: Droplet },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();
  
  return (
    <Sidebar className="border-r border-border bg-sidebar shadow-sm">
      <SidebarHeader className="h-20 flex items-center justify-center border-b border-border">
        <div className="flex items-center gap-3 w-full px-4">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-md">
            <HeartPulse className="w-5 h-5 text-growth-lime" />
          </div>
          <h1 className="text-xl font-bold tracking-wider text-sidebar-foreground">SanityFlow</h1>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 font-semibold">Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => {
                const isActive = location.pathname === item.href || (item.href !== "/" && location.pathname.startsWith(item.href));
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton 
                      asChild 
                      tooltip={item.name}
                      isActive={isActive}
                      className={isActive ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground font-medium" : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground font-medium"}
                    >
                      <Link to={item.href}>
                        <item.icon />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="text-sidebar-foreground/80 hover:bg-destructive/10 hover:text-destructive transition-colors font-medium">
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}