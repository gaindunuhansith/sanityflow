import {
  Home,
  Feather,
  MessageSquare,
  Users,
  Truck,
  Package,
  Droplet,
  AlertTriangle,
  ShieldCheck,
  Boxes,
  Store,
} from "lucide-react";
import type { UserRole } from "@/features/auth/authSlice";

type MenuItem = {
  name: string;
  href: string;
  icon: typeof Home;
  roles: UserRole[];
};

export const mainMenu: MenuItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: Home, roles: ["admin", "member", "driver"] },
  { name: "Blog", href: "/dashboard/blog", icon: Feather, roles: ["admin", "member"] },
  { name: "Forum", href: "/dashboard/forum", icon: MessageSquare, roles: ["admin", "member"] },
  { name: "Issues", href: "/dashboard/issues", icon: AlertTriangle, roles: ["admin", "member"] },
  { name: "Beneficiary", href: "/dashboard/beneficiaries", icon: Users, roles: ["admin", "member"] },
  { name: "Drivers", href: "/dashboard/drivers", icon: Users, roles: ["admin", "member"] },
  { name: "Distribution", href: "/dashboard/distributions", icon: Truck, roles: ["admin", "member", "driver"] },
  { name: "Resources", href: "/dashboard/resources", icon: Boxes, roles: ["admin", "member"] },
  { name: "Supplier", href: "/dashboard/suppliers", icon: Store, roles: ["admin", "member"] },
  { name: "Inventory Transactions", href: "/dashboard/inventory-transactions", icon: Package, roles: ["admin", "member"] },
  { name: "Water Source", href: "/dashboard/water-sources", icon: Droplet, roles: ["admin", "member"] },
  { name: "Water Quality", href: "/dashboard/water-tests", icon: ShieldCheck, roles: ["admin", "member"] },
];
