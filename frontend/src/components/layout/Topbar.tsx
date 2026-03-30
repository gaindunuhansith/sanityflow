import { Search, Bell, Mail, ChevronDown } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Topbar() {
  return (
    <header className="h-20 shrink-0 border-b border-border bg-card flex items-center justify-between px-6 z-10 sticky top-0 shadow-sm">

      <div className="flex items-center gap-4 flex-1">
        {/* Toggle Sidebar for Mobile/Desktop */}
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />

        {/* Search Bar */}
        <div className="max-w-xl w-full relative group hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            type="text"
            placeholder="Search here..."
            className="w-full bg-background border-border rounded-full h-10 pl-10 pr-4 focus-visible:ring-primary/50 shadow-sm"
          />
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-2 sm:gap-6 ml-4">
        {/* Language / Region */}
        <Button variant="ghost" className="hidden sm:flex text-sm font-medium text-muted-foreground hover:text-foreground">
          ENG <ChevronDown className="w-4 h-4 ml-1" />
        </Button>

        {/* Notifications */}
        <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 border-l border-r border-border">
          <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground rounded-full">
            <Mail className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full"></span>
          </Button>
          <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground rounded-full">
             <Bell className="w-5 h-5" />
             <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full shadow-[0_0_0_2px_hsl(var(--background))]"></span>
          </Button>
        </div>

        {/* User Profile */}
        <Button variant="ghost" className="flex items-center gap-3 rounded-full pl-2 pr-4 py-1.5 h-auto hover:bg-card/50">
          <Avatar className="w-8 h-8 border-2 border-primary/20">
            <AvatarImage src="https://i.pravatar.cc/150?u=a04258a2462d826712d" alt="User avatar" />
            <AvatarFallback className="bg-primary text-primary-foreground font-bold">AD</AvatarFallback>
          </Avatar>
          <div className="text-left hidden sm:flex flex-col">
            <span className="text-sm font-semibold text-foreground leading-none">Grace Stanley</span>
            <span className="text-xs text-muted-foreground">Admin</span>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground hidden sm:block opacity-50 ml-1" />
        </Button>
      </div>

    </header>
  );
}