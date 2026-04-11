import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search, HelpCircle, LogOut, User as UserIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/features/auth/authSlice";
import { authApi } from "@/features/auth/authApi";
import { forumApi } from "@/features/forum/forumApi";
import { distributionApi } from "@/features/distribution/distributionApi";
import { beneficiaryApi } from "@/features/beneficiary/beneficiaryApi";
import type { AppDispatch, RootState } from "@/store";
import { memberMenu } from "./memberMenu";

export function MemberHeader() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const authUser = useSelector((state: RootState) => state.auth.user);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "f" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        searchInputRef.current?.focus();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(authApi.util.resetApiState());
    dispatch(forumApi.util.resetApiState());
    dispatch(distributionApi.util.resetApiState());
    dispatch(beneficiaryApi.util.resetApiState());
    navigate('/login', { replace: true });
  };

  const filteredMenu = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return memberMenu;
    }

    return memberMenu.filter((item) => item.name.toLowerCase().includes(normalizedQuery));
  }, [searchQuery]);

  const goToMenuItem = (href: string) => {
    navigate(href);
    setSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <header className="flex h-15 shrink-0 items-center justify-between px-6 bg-[#F3F4F6]">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="ml-0 rounded-lg text-brand-gray hover:text-brand-primary hover:bg-brand-primary/5 transition-colors" />
        <div className="flex flex-col justify-center">
          <h1 className="text-base font-semibold text-brand-primary leading-tight font-heading">Member Dashboard</h1>
          <p className="text-[13px] text-brand-gray mt-0.5 font-alt">Track updates, discussions, and your account</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray pointer-events-none" />
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Search pages"
            value={searchQuery}
            onFocus={() => setSearchOpen(true)}
            onBlur={() => setTimeout(() => setSearchOpen(false), 100)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchOpen(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && filteredMenu.length > 0) {
                goToMenuItem(filteredMenu[0].href);
              }
            }}
            className="pl-9 pr-14 rounded-lg bg-card border-border h-9 w-70 text-[13px] focus-visible:ring-brand-primary shadow-sm placeholder:text-brand-gray/70"
          />

          {searchOpen && (
            <div className="absolute top-11 left-0 z-50 w-70 overflow-hidden rounded-lg border border-border bg-popover shadow-lg">
              {filteredMenu.length > 0 ? (
                <ul className="max-h-64 overflow-auto py-1">
                  {filteredMenu.map((item) => (
                    <li key={item.href}>
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          goToMenuItem(item.href);
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-brand-primary hover:bg-brand-primary/5"
                      >
                        <item.icon className="h-4 w-4 text-brand-gray" />
                        <span>{item.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-3 py-2 text-sm text-brand-gray">No menu items found.</div>
              )}
            </div>
          )}
        </div>

        <button className="p-1.5 text-brand-gray hover:text-brand-primary hover:bg-brand-secondary/20 rounded-lg transition-colors">
          <HelpCircle className="w-4.5 h-4.5" strokeWidth={2} />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-8.5 w-8.5 cursor-pointer ring-2 ring-brand-primary/10 hover:ring-brand-primary transition-all select-none">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${authUser?.email || 'User'}`} alt={authUser?.name || 'User'} />
              <AvatarFallback>{authUser?.name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-2">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-brand-primary">
                  {authUser?.name || 'SanityFlow Member'}
                </p>
                <p className="text-xs leading-none text-brand-gray">
                  {authUser?.email || 'member@sanityflow.com'}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/member/dashboard/profile')} className="text-brand-gray cursor-pointer focus:text-brand-primary focus:bg-brand-primary/5">
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Profile Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-600 focus:text-red-700 cursor-pointer focus:bg-red-50"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
