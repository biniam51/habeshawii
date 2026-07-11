"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Clapperboard, Play, Users, Crown } from "lucide-react";

const mobileLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/videos", label: "Videos", icon: Clapperboard },
  { href: "/shorts", label: "Shorts", icon: Play },
  { href: "/models", label: "Models", icon: Users },
  { href: "/membership", label: "Premium", icon: Crown },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/40 bg-background/95 backdrop-blur-xl md:hidden">
      <div className="flex items-center justify-around py-2">
        {mobileLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] font-medium transition-colors ${
                isActive ? "text-gold" : "text-muted-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
