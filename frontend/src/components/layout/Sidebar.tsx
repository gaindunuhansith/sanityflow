import { NavLink } from "react-router-dom";
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
  return (
    <Sidebar className="border-r border-border/10">
      <SidebarHeader className="h-20 flex items-center justify-center border-b border-border/5">
        <div className="flex items-center gap-3 w-full px-4">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-md">
            <HeartPulse className="w-5 h-5 text-growth-lime" />
          </div>
          <h1 className="text-xl font-bold tracking-wider text-foreground">SanityFlow</h1>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground">Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild tooltip={item.name}>
                    <NavLink
                      to={item.href}
                      className={({ isActive }) =>
                        isActive 
                          ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground" 
                          : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      }
                    >
                      <item.icon />
                      <span>{item.name}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/5 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}