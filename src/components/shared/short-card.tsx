"use client";

import { Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ShortCardProps {
  title: string;
  thumbnail?: string;
  isPremium?: boolean;
  isVIP?: boolean;
  views?: number;
  gradient?: string;
}

export function ShortCard({
  title,
  thumbnail,
  isPremium,
  isVIP,
  views,
  gradient = "from-rose-900/40 via-purple-900/40 to-indigo-900/40",
}: ShortCardProps) {
  return (
    <div className="group relative flex aspect-[9/16] w-36 shrink-0 cursor-pointer flex-col overflow-hidden rounded-xl border border-border/40 bg-card/40 backdrop-blur-sm transition-all duration-500 hover:border-gold/30 hover:shadow-2xl hover:shadow-gold/10 hover:-translate-y-0.5 sm:w-44">
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 group-hover:scale-110"
        style={
          thumbnail
            ? { backgroundImage: `url(${thumbnail})` }
            : undefined
        }
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

      {/* Badges */}
      {isPremium && (
        <div className="absolute right-2 top-2 z-10">
          <Badge className="border-0 bg-gradient-to-r from-gold to-amber-400 text-[10px] text-black shadow-lg shadow-gold/20">
            Premium
          </Badge>
        </div>
      )}
      {isVIP && (
        <div className="absolute right-2 top-2 z-10">
          <Badge className="border-0 bg-gradient-to-r from-vip to-purple-400 text-[10px] text-white shadow-lg shadow-vip/20">
            VIP
          </Badge>
        </div>
      )}

      {/* Play overlay */}
      <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold shadow-lg shadow-gold/30 transition-transform duration-300 group-hover:scale-110">
          <Play className="h-5 w-5 fill-black text-black" />
        </div>
      </div>

      {/* Title */}
      <div className="relative z-10 mt-auto p-3">
        <h3 className="line-clamp-2 text-xs font-medium text-white drop-shadow-lg">
          {title}
        </h3>
        {views !== undefined && (
          <p className="mt-1 text-[10px] text-white/50">
            {views.toLocaleString()} views
          </p>
        )}
      </div>

      {/* Glow on hover */}
      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute inset-0 bg-gradient-to-t from-gold/5 via-transparent to-transparent" />
      </div>
    </div>
  );
}
