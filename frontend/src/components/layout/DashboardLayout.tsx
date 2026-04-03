import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";

export function DashboardLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50/50 text-foreground w-full">
        <Sidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center justify-between border-b px-6">
            <SidebarTrigger />
          </header>
          <main className="flex-1 flex-col p-6 overflow-auto">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
