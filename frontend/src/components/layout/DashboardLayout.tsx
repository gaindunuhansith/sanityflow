import { Outlet } from "react-router-dom";
import { AppSidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export function DashboardLayout() {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
        {/* Shadcn Sidebar */}
        <AppSidebar />

        <SidebarInset className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background">
          {/* Topbar with SidebarTrigger */}
          <Topbar />
          
          {/* Scrollable Dashboard Content */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
            <div className="mx-auto max-w-7xl h-full">
              <Outlet />
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
