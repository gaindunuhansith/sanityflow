import { Home, MessageSquare, AlertTriangle, UserCircle, Users } from "lucide-react";

type MemberMenuItem = {
  name: string;
  href: string;
  icon: typeof Home;
};

export const memberMenu: MemberMenuItem[] = [
  { name: "Dashboard", href: "/member/dashboard", icon: Home },
  { name: "Submit Beneficiary", href: "/member/dashboard/beneficiaries", icon: Users },
  { name: "Forum", href: "/member/dashboard/forum", icon: MessageSquare },
  { name: "Issues", href: "/member/dashboard/issues", icon: AlertTriangle },
  { name: "Profile", href: "/member/dashboard/profile", icon: UserCircle },
];
