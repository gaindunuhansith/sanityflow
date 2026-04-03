import { Outlet } from "react-router-dom";

export function DashboardLayout() {
  return (
    <div className="flex h-screen w-full bg-background text-foreground">
      <Outlet />
    </div>
  );
}
