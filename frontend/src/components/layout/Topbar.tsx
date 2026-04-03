import { SidebarTrigger } from "@/components/ui/sidebar";

export function Topbar() {
  return (
    <header className="h-20 shrink-0 border-b border-border bg-card flex items-center justify-between px-6 z-10 sticky top-0 shadow-sm">
      <div className="flex items-center gap-4 flex-1">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
      </div>
      <div className="flex items-center gap-2 sm:gap-6 ml-4">
        {/* Boilerplate Topbar Actions */}
      </div>
    </header>
  );
}
