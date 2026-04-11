import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { SidebarTrigger } from "@/components/ui/sidebar";
import type { RootState } from "@/store";
import { UserCircle } from "lucide-react";

export function Topbar() {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <header className="h-20 shrink-0 border-b border-border bg-card flex items-center justify-between px-6 z-10 sticky top-0 shadow-sm">
      <div className="flex items-center gap-4 flex-1">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
      </div>
      <div className="flex items-center gap-2 sm:gap-6 ml-4">
        <Link to="/profile" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <UserCircle className="h-6 w-6" />
          <span className="hidden sm:inline">{user?.name ?? user?.email}</span>
        </Link>
      </div>
    </header>
  );
}
