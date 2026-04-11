import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search, Settings, HelpCircle } from "lucide-react";

export function Header() {
  return (
    <header className="flex h-[60px] shrink-0 items-center justify-between border-b border-border px-6 bg-background">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="-ml-2 text-brand-gray hover:text-brand-primary transition-colors" />
        <div className="flex flex-col justify-center">
          <h1 className="text-base font-semibold text-brand-primary leading-tight font-heading">Home</h1>
          <p className="text-[13px] text-brand-gray mt-0.5 font-alt">Sustainable Future with Quality Water</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-brand-gray" />
          <Input 
            type="text" 
            placeholder="Search anything" 
            className="pl-9 pr-14 rounded-lg bg-card border-border h-9 w-[280px] text-[13px] focus-visible:ring-brand-primary shadow-sm placeholder:text-brand-gray/70"
          />
          <div className="absolute right-2 flex items-center justify-center pointer-events-none">
            <kbd className="inline-flex items-center justify-center rounded border border-border bg-background px-1.5 font-sans text-[10px] font-medium text-brand-gray h-5">
              <span className="text-[10px] mr-0.5">⌘</span>F
            </kbd>
          </div>
        </div>

        <div className="flex items-center mx-1">
          <button className="p-1.5 text-brand-gray hover:text-brand-primary hover:bg-brand-secondary/20 rounded-lg transition-colors">
            <Settings className="w-[18px] h-[18px]" strokeWidth={2} />
          </button>
          <button className="p-1.5 text-brand-gray hover:text-brand-primary hover:bg-brand-secondary/20 rounded-lg transition-colors">
            <HelpCircle className="w-[18px] h-[18px]" strokeWidth={2} />
          </button>
        </div>

        <Avatar className="h-[34px] w-[34px] cursor-pointer ring-2 ring-brand-primary/10 hover:ring-brand-primary transition-all">
          <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
