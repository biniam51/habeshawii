import Link from "next/link";
import { Crown } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-gold" />
              <span className="text-lg font-bold">
                <span className="text-gradient-gold">Habesha</span>Wii
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Premium entertainment platform with exclusive content, models, and a
              vibrant community.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Content</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/videos" className="text-sm text-muted-foreground hover:text-foreground">
                  Videos
                </Link>
              </li>
              <li>
                <Link href="/shorts" className="text-sm text-muted-foreground hover:text-foreground">
                  Shorts
                </Link>
              </li>
              <li>
                <Link href="/models" className="text-sm text-muted-foreground hover:text-foreground">
                  Models
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Membership</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/membership" className="text-sm text-muted-foreground hover:text-foreground">
                  Plans
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-sm text-muted-foreground hover:text-foreground">
                  Register
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Support</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-muted-foreground">
                  Contact: support@habeshawii.com
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border/40 pt-6 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} HabeshaWii. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
