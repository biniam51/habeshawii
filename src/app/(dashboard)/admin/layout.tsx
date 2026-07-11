"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Video,
  Clapperboard,
  Users,
  MessageCircle,
  UserCircle,
  Crown,
  DollarSign,
} from "lucide-react";

const adminLinks = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/videos", label: "Videos", icon: Video },
  { href: "/admin/shorts", label: "Shorts", icon: Clapperboard },
  { href: "/admin/models", label: "Models", icon: UserCircle },
  { href: "/admin/payments", label: "Payments", icon: DollarSign },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/messages", label: "Messages", icon: MessageCircle },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <aside className="w-64 border-r border-zinc-800 bg-zinc-900/50 hidden lg:block flex-shrink-0">
        <div className="p-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-500" />
            <span className="text-sm font-semibold">Admin Panel</span>
          </div>
        </div>
        <nav className="p-2 space-y-1">
          {adminLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-amber-600/10 text-amber-500 font-medium"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                }`}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
