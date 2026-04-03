import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50/50 text-foreground">
      <Sidebar />
      <main className="ml-64 flex-1 flex-col p-8">
        <Outlet />
      </main>
    </div>
  );
}
