"use client";

import { Play, Clock, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface VideoCardProps {
  title: string;
  thumbnail?: string;
  duration: string;
  category: string;
  isPremium?: boolean;
  isVIP?: boolean;
  views?: number;
  gradient?: string;
}

export function VideoCard({
  title,
  thumbnail,
  duration,
  category,
  isPremium,
  isVIP,
  views,
  gradient = "from-indigo-900/40 via-purple-900/40 to-pink-900/40",
}: VideoCardProps) {
  return (
    <div className="group relative cursor-pointer overflow-hidden rounded-xl border border-border/40 bg-card/40 backdrop-blur-sm transition-all duration-500 hover:border-gold/30 hover:shadow-2xl hover:shadow-gold/10 hover:-translate-y-0.5">
      <div className="relative aspect-video overflow-hidden">
        <div
          className="h-full w-full bg-cover bg-center transition-all duration-700 group-hover:scale-110"
          style={
            thumbnail
              ? { backgroundImage: `url(${thumbnail})` }
              : undefined
          }
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient} transition-opacity duration-500`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-60" />
        </div>

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold shadow-lg shadow-gold/30 transition-transform duration-300 group-hover:scale-110">
            <Play className="h-5 w-5 fill-black text-black" />
          </div>
        </div>

        {/* Badges */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
          <Badge
            variant="secondary"
            className="border-0 bg-black/50 text-[11px] text-white/90 backdrop-blur-sm"
          >
            <Clock className="mr-1 h-3 w-3" />
            {duration}
          </Badge>
          <Badge
            variant="secondary"
            className="border-0 bg-black/50 text-[11px] text-white/90 backdrop-blur-sm"
          >
            {category}
          </Badge>
        </div>

        {/* Premium/VIP badge */}
        {isVIP && (
          <div className="absolute right-2 top-2">
            <Badge className="border-0 bg-gradient-to-r from-vip to-purple-400 text-[10px] text-white shadow-lg shadow-vip/20">
              VIP
            </Badge>
          </div>
        )}
        {isPremium && !isVIP && (
          <div className="absolute right-2 top-2">
            <Badge className="border-0 bg-gradient-to-r from-gold to-amber-400 text-[10px] text-black shadow-lg shadow-gold/20">
              Premium
            </Badge>
          </div>
        )}

        {/* Hover glow */}
        <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div className="absolute inset-0 bg-gradient-to-t from-gold/5 via-transparent to-transparent" />
        </div>
      </div>

      <div className="p-3">
        <h3 className="line-clamp-1 text-sm font-medium transition-colors group-hover:text-gold">
          {title}
        </h3>
        <div className="mt-1 flex items-center gap-2">
          {views !== undefined && (
            <p className="text-xs text-muted-foreground/70">
              {views.toLocaleString()} views
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
