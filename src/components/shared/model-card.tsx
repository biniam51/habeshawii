"use client";

import { Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ModelCardProps {
  name: string;
  photo?: string;
  photosCount?: number;
  videosCount?: number;
  requiredMembership?: string;
}

export function ModelCard({
  name,
  photo,
  photosCount,
  videosCount,
  requiredMembership,
}: ModelCardProps) {
  const isLocked = requiredMembership && requiredMembership !== "free";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="group relative flex w-40 shrink-0 cursor-pointer flex-col items-center rounded-xl border border-border/40 bg-card/40 p-4 backdrop-blur-sm transition-all duration-500 hover:border-gold/30 hover:shadow-2xl hover:shadow-gold/10 hover:-translate-y-1 sm:w-44">
      <div className="relative mb-3">
        <div className="rounded-full p-[2px] bg-gradient-to-br from-gold/50 via-transparent to-transparent transition-all duration-500 group-hover:from-gold group-hover:to-amber-400">
          <Avatar className="h-20 w-20 ring-2 ring-background sm:h-24 sm:w-24">
            <AvatarImage src={photo} alt={name} />
            <AvatarFallback className="bg-gradient-to-br from-gold/20 to-amber-400/20 text-lg font-medium text-gold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
        {isLocked && (
          <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-gold shadow-lg shadow-gold/30">
            <Lock className="h-3 w-3 text-black" />
          </div>
        )}
      </div>
      <h3 className="text-center text-sm font-medium transition-colors group-hover:text-gold">
        {name}
      </h3>
      {(photosCount !== undefined || videosCount !== undefined) && (
        <p className="mt-1 text-xs text-muted-foreground/70">
          {photosCount !== undefined && `${photosCount} photos`}
          {photosCount !== undefined && videosCount !== undefined && " · "}
          {videosCount !== undefined && `${videosCount} videos`}
        </p>
      )}
      {isLocked && (
        <Badge
          variant="secondary"
          className="mt-2 border-0 bg-gold/10 text-[10px] text-gold"
        >
          {requiredMembership === "silver"
            ? "Silver+"
            : requiredMembership === "gold"
              ? "Gold"
              : requiredMembership}
        </Badge>
      )}
    </div>
  );
}
