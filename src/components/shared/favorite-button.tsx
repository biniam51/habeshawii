"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/components/layout/auth-provider";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";

interface FavoriteButtonProps {
  itemType: "video" | "short" | "model";
  itemId: string;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  count?: number;
  className?: string;
}

export function FavoriteButton({
  itemType,
  itemId,
  size = "sm",
  showCount,
  count: externalCount,
  className = "",
}: FavoriteButtonProps) {
  const { user } = useAuth();
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    supabase.from("favorites").select("id").eq("user_id", user.id).eq("item_type", itemType).eq("item_id", itemId).maybeSingle().then(({ data }) => {
      setIsFav(!!data);
      setLoading(false);
    });
  }, [user, itemType, itemId]);

  async function toggle() {
    if (!user) { router.push("/login"); return; }
    if (isFav) {
      await supabase.from("favorites").delete().eq("user_id", user.id).eq("item_type", itemType).eq("item_id", itemId);
      setIsFav(false);
    } else {
      await supabase.from("favorites").insert({ user_id: user.id, item_type: itemType, item_id: itemId });
      setIsFav(true);
    }
  }

  const dims = size === "lg" ? "h-11 w-11" : size === "md" ? "h-9 w-9" : "h-8 w-8";
  const iconSize = size === "lg" ? "h-5 w-5" : "h-4 w-4";

  return (
    <button
      onClick={toggle}
      className={`${dims} flex items-center justify-center rounded-full backdrop-blur-sm transition-all active:scale-125 disabled:opacity-50 ${className} ${
        isFav ? "bg-gold text-black" : "bg-white/10 text-white hover:bg-white/20"
      }`}
      disabled={loading}
    >
      <Heart className={`${iconSize} ${isFav ? "fill-current" : ""}`} />
    </button>
  );
}
