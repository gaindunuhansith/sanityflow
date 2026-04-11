import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Header } from "./Header";

export function DashboardLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50/50 text-foreground w-full">
        <Sidebar />
        <SidebarInset>
          <Header />
          <main className="flex-1 flex-col p-6 overflow-auto bg-[#f8fafc]">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
