"use client";

import { useEffect } from "react";
import { useAuth } from "@/components/layout/auth-provider";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AdminMessages() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    if (user.email !== "biniyammulat51@gmail.com") { router.push("/"); return; }
    router.push("/chat");
  }, [user]);

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
    </div>
  );
}
