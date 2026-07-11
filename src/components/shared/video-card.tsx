"use client";

import { Play, Lock, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface VideoCardProps {
  title: string;
  thumbnail: string;
  duration: string;
  category: string;
  isPremium?: boolean;
  isVIP?: boolean;
  views?: number;
}

export function VideoCard({
  title,
  thumbnail,
  duration,
  category,
  isPremium,
  isVIP,
  views,
}: VideoCardProps) {
  return (
    <div className="group relative cursor-pointer overflow-hidden rounded-xl border border-border/50 bg-card transition-all hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5">
      <div className="relative aspect-video overflow-hidden bg-muted">
        <div
          className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url(${thumbnail})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-2 left-2 flex items-center gap-2">
          <Badge
            variant="secondary"
            className="bg-black/60 text-xs text-white backdrop-blur-sm"
          >
            <Clock className="mr-1 h-3 w-3" />
            {duration}
          </Badge>
          {category && (
            <Badge
              variant="secondary"
              className="bg-black/60 text-xs text-white backdrop-blur-sm"
            >
              {category}
            </Badge>
          )}
        </div>
        {isVIP && (
          <div className="absolute right-2 top-2">
            <Badge className="bg-vip text-xs text-white">VIP</Badge>
          </div>
        )}
        {isPremium && !isVIP && (
          <div className="absolute right-2 top-2">
            <Badge className="bg-gold text-xs text-black">Premium</Badge>
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/90 text-black backdrop-blur-sm">
            <Play className="h-5 w-5 fill-current" />
          </div>
        </div>
      </div>
      <div className="p-3">
        <h3 className="line-clamp-1 text-sm font-medium">{title}</h3>
        {views !== undefined && (
          <p className="mt-1 text-xs text-muted-foreground">
            {views.toLocaleString()} views
          </p>
        )}
      </div>
    </div>
  );
}
