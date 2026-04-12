import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Droplet, LogOut } from "lucide-react";
import { logout } from "@/features/auth/authSlice";
import { authApi } from "@/features/auth/authApi";
import { forumApi } from "@/features/forum/forumApi";
import { distributionApi } from "@/features/distribution/distributionApi";
import { beneficiaryApi } from "@/features/beneficiary/beneficiaryApi";
import type { AppDispatch } from "@/store";
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
import { memberMenu } from "./memberMenu";

export function MemberSidebar() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(authApi.util.resetApiState());
    dispatch(forumApi.util.resetApiState());
    dispatch(distributionApi.util.resetApiState());
    dispatch(beneficiaryApi.util.resetApiState());
    navigate('/', { replace: true });
  };

  return (
    <ShadcnSidebar collapsible="icon" className="bg-[#F3F4F6] border-r-0 [--sidebar-width-icon:4.5rem]">
      <SidebarHeader className="h-15 flex flex-row items-center px-3 group-data-[collapsible=icon]:px-1.5 group-data-[collapsible=icon]:justify-center justify-start border-none">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-secondary text-brand-primary shadow-sm hover:scale-105 transition-transform">
          <Droplet className="h-4 w-4" fill="currentColor" strokeWidth={1.5} />
        </div>
        <span className="text-[16px] font-bold text-brand-primary tracking-tight font-heading group-data-[collapsible=icon]:hidden whitespace-nowrap overflow-hidden transition-all duration-300 ml-2">SanityFlow</span>
      </SidebarHeader>

      <SidebarContent className="px-3 group-data-[collapsible=icon]:px-1.5 flex flex-col mt-2">
        <SidebarGroup className="p-0 group-data-[collapsible=icon]:p-1">
          <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-wider text-brand-gray px-3 py-4 group-data-[collapsible=icon]:opacity-0 transition-opacity">
            MEMBER MENU
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {memberMenu.map((item) => {
                const isActive = item.href === "/member/dashboard"
                  ? location.pathname === "/member/dashboard"
                  : location.pathname === item.href || location.pathname.startsWith(`${item.href}/`);

                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.name}
                      className={`transition-all group-data-[collapsible=icon]:mx-auto ${
                        isActive
                          ? "bg-white text-brand-primary shadow-sm font-semibold rounded-xl"
                          : "text-brand-gray hover:bg-brand-primary/5 hover:text-brand-primary font-medium rounded-xl"
                      }`}
                    >
                      <Link to={item.href} className="flex w-full items-center py-2.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:py-0">
                        <item.icon className="h-4.5 w-4.5 shrink-0" strokeWidth={isActive ? 2.4 : 2} />
                        <span className="text-[13px] ml-3 whitespace-nowrap overflow-hidden transition-all duration-300 group-data-[collapsible=icon]:hidden">{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto pb-5 px-1 group-data-[collapsible=icon]:px-0">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleLogout}
                tooltip="Logout"
                className="text-brand-gray hover:bg-brand-primary/5 hover:text-brand-primary font-medium rounded-xl py-3 w-full flex items-center justify-start group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:mx-auto transition-all"
              >
                <LogOut className="h-4.5 w-4.5 shrink-0" strokeWidth={2} />
                <span className="text-[13px] ml-3 whitespace-nowrap overflow-hidden transition-all duration-300 group-data-[collapsible=icon]:hidden">Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>
    </ShadcnSidebar>
  );
}
