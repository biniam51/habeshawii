"use client";

import { Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ModelCardProps {
  name: string;
  photo: string;
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
    <div className="group relative flex w-40 shrink-0 cursor-pointer flex-col items-center rounded-xl border border-border/50 bg-card p-4 transition-all hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5 sm:w-44">
      <div className="relative mb-3">
        <Avatar className="h-20 w-20 ring-2 ring-border ring-offset-2 ring-offset-background transition-all group-hover:ring-gold sm:h-24 sm:w-24">
          <AvatarImage src={photo} alt={name} />
          <AvatarFallback className="bg-gold/10 text-lg font-medium text-gold">
            {initials}
          </AvatarFallback>
        </Avatar>
        {isLocked && (
          <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-gold text-black">
            <Lock className="h-3 w-3" />
          </div>
        )}
      </div>
      <h3 className="text-center text-sm font-medium">{name}</h3>
      {(photosCount !== undefined || videosCount !== undefined) && (
        <p className="mt-1 text-xs text-muted-foreground">
          {photosCount !== undefined && `${photosCount} photos`}
          {photosCount !== undefined && videosCount !== undefined && " · "}
          {videosCount !== undefined && `${videosCount} videos`}
        </p>
      )}
      {isLocked && (
        <Badge
          variant="secondary"
          className="mt-2 bg-gold/10 text-[10px] text-gold"
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
