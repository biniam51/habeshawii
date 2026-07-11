"use client";

import { Play, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ShortCardProps {
  title: string;
  thumbnail: string;
  isPremium?: boolean;
  isVIP?: boolean;
  views?: number;
}

export function ShortCard({
  title,
  thumbnail,
  isPremium,
  isVIP,
  views,
}: ShortCardProps) {
  return (
    <div className="group relative flex aspect-[9/16] w-36 shrink-0 cursor-pointer flex-col overflow-hidden rounded-xl border border-border/50 bg-card transition-all hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5 sm:w-44">
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
        style={{ backgroundImage: `url(${thumbnail})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      {isPremium && (
        <div className="absolute right-2 top-2">
          <Badge className="bg-gold text-xs text-black">Premium</Badge>
        </div>
      )}
      {isVIP && (
        <div className="absolute right-2 top-2">
          <Badge className="bg-vip text-xs text-white">VIP</Badge>
        </div>
      )}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/90 text-black backdrop-blur-sm">
          <Play className="h-5 w-5 fill-current" />
        </div>
      </div>
      <div className="relative mt-auto p-3">
        <h3 className="line-clamp-2 text-xs font-medium text-white">{title}</h3>
        {views !== undefined && (
          <p className="mt-1 text-[10px] text-white/60">
            {views.toLocaleString()} views
          </p>
        )}
      </div>
    </div>
  );
}
