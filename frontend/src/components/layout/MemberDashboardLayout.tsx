import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { MemberSidebar } from "./MemberSidebar";
import { MemberHeader } from "./MemberHeader";

export function MemberDashboardLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50/50 text-foreground w-full">
        <MemberSidebar />
        <SidebarInset>
          <MemberHeader />
          <main className="flex-1 flex-col p-6 overflow-auto bg-[#f8fafc]">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
