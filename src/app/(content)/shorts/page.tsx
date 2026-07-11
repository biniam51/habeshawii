"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Share2, Volume2, VolumeX, Lock, Play, ChevronUp, Crown, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/layout/auth-provider";
import { useMembership } from "@/components/layout/membership-provider";
import type { MembershipPlan } from "@/types";

const mockShorts = [
  { id: "1", title: "Behind the Scenes", gradient: "from-rose-900 via-purple-900 to-pink-900", isPremium: false, views: 12400, likes: 892 },
  { id: "2", title: "Quick Dance Tutorial", gradient: "from-blue-900 via-cyan-900 to-teal-900", isPremium: true, views: 8700, likes: 654 },
  { id: "3", title: "Daily Life Moments", gradient: "from-amber-900 via-orange-900 to-yellow-900", isPremium: false, views: 5600, likes: 423 },
  { id: "4", title: "Exclusive Gym Session", gradient: "from-emerald-900 via-green-900 to-teal-900", isPremium: true, views: 3400, likes: 289 },
  { id: "5", title: "Sunset Serenade", gradient: "from-indigo-900 via-violet-900 to-purple-900", isPremium: false, views: 21000, likes: 1520 },
  { id: "6", title: "VIP Lounge Access", gradient: "from-fuchsia-900 via-pink-900 to-rose-900", isVIP: true, views: 1800, likes: 234 },
  { id: "7", title: "Street Fashion", gradient: "from-orange-900 via-red-900 to-pink-900", isPremium: false, views: 9300, likes: 712 },
  { id: "8", title: "Premium Night Out", gradient: "from-violet-900 via-purple-900 to-fuchsia-900", isPremium: true, views: 6700, likes: 534 },
];

function formatCount(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1) + "K";
  return n.toString();
}

export default function ShortsPage() {
  const { user } = useAuth();
  const { canAccess } = useMembership();
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [showInfo, setShowInfo] = useState(false);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const index = Math.round(
      containerRef.current.scrollTop / containerRef.current.clientHeight
    );
    setCurrentIndex(index);
  }, []);

  const navigate = useCallback((direction: "up" | "down") => {
    if (!containerRef.current) return;
    const next =
      direction === "down"
        ? Math.min(currentIndex + 1, mockShorts.length - 1)
        : Math.max(currentIndex - 1, 0);
    containerRef.current.children[next]?.scrollIntoView({ behavior: "smooth" });
    setCurrentIndex(next);
  }, [currentIndex]);

  const toggleLike = (id: string) => {
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const currentShort = mockShorts[currentIndex];
  const requiredPlan: MembershipPlan | null = currentShort?.isVIP
    ? "gold"
    : currentShort?.isPremium
      ? "bronze"
      : null;
  const isLocked = requiredPlan && !canAccess(requiredPlan);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") navigate("down");
      if (e.key === "ArrowUp") navigate("up");
      if (e.key === "m") setMuted((p) => !p);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [navigate]);

  // Reset info on short change
  useEffect(() => {
    setShowInfo(false);
  }, [currentIndex]);

  return (
    <div className="fixed inset-0 top-16 bottom-16 md:bottom-0 bg-black">
      {/* Scrollable container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar"
      >
        {mockShorts.map((short, index) => {
          const isActive = index === currentIndex;
          const shortRequiredPlan: MembershipPlan | null = short.isVIP
            ? "gold"
            : short.isPremium
              ? "bronze"
              : null;
          const shortIsLocked = shortRequiredPlan && !canAccess(shortRequiredPlan);

          return (
            <div
              key={short.id}
              className="relative h-full w-full snap-start snap-always flex-shrink-0"
            >
              {/* Gradient background as video placeholder */}
              <div className={`absolute inset-0 bg-gradient-to-br ${short.gradient}`}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
              </div>

              {/* Subtle moving pattern */}
              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 20% 50%, white 1px, transparent 1px)",
                  backgroundSize: "30px 30px",
                }}
              />

              {/* Lock overlay */}
              {shortIsLocked && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gold/20 backdrop-blur-sm">
                      <Lock className="h-8 w-8 text-gold" />
                    </div>
                    <p className="text-lg font-bold text-white">
                      {short.isVIP ? "Gold Exclusive" : "Premium Content"}
                    </p>
                    <p className="text-sm text-white/60">
                      {short.isVIP
                        ? "Upgrade to Gold to watch"
                        : "Join to unlock this short"}
                    </p>
                    <Link href={user ? "/membership" : "/register"}>
                      <Button className="bg-gold text-black hover:bg-gold-dark">
                        <Crown className="mr-2 h-4 w-4" />
                        {user ? "Upgrade Now" : "Join Now"}
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {/* Play icon hint */}
              {isActive && (
                <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                    <Play className="h-8 w-8 fill-white text-white" />
                  </div>
                </div>
              )}

              {/* Bottom info overlay */}
              <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 pt-20">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-bold text-white drop-shadow-lg">
                      {short.title}
                    </h2>
                    <div className="mt-1 flex items-center gap-3 text-sm text-white/60">
                      <span>{formatCount(short.views)} views</span>
                      {short.isPremium && (
                        <Badge className="bg-gold/90 text-[10px] text-black border-0">
                          Premium
                        </Badge>
                      )}
                      {short.isVIP && (
                        <Badge className="bg-vip/90 text-[10px] text-white border-0">
                          VIP
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side action buttons */}
              <div className="absolute right-4 bottom-24 z-10 flex flex-col items-center gap-5">
                <button
                  onClick={() => toggleLike(short.id)}
                  className="flex flex-col items-center gap-1 transition-transform active:scale-125"
                >
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-full backdrop-blur-sm transition-colors ${
                      liked.has(short.id)
                        ? "bg-gold text-black"
                        : "bg-white/10 text-white"
                    }`}
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        liked.has(short.id) ? "fill-current" : ""
                      }`}
                    />
                  </div>
                  <span className="text-[10px] text-white/70">
                    {formatCount(
                      short.likes + (liked.has(short.id) ? 1 : 0)
                    )}
                  </span>
                </button>

                <button className="flex flex-col items-center gap-1">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-colors hover:bg-white/20">
                    <MessageCircle className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-[10px] text-white/70">0</span>
                </button>

                <button className="flex flex-col items-center gap-1">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-colors hover:bg-white/20">
                    <Share2 className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-[10px] text-white/70">Share</span>
                </button>
              </div>

              {/* Sound toggle */}
              <button
                onClick={() => setMuted(!muted)}
                className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                {muted ? (
                  <VolumeX className="h-4 w-4 text-white" />
                ) : (
                  <Volume2 className="h-4 w-4 text-white" />
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Progress indicator */}
      <div className="absolute right-2 top-1/2 z-10 -translate-y-1/2 flex flex-col gap-1">
        {mockShorts.map((_, i) => (
          <div
            key={i}
            className={`w-1 rounded-full transition-all duration-300 ${
              i === currentIndex
                ? "h-6 bg-gold"
                : "h-1.5 bg-white/30"
            }`}
          />
        ))}
      </div>

      {/* Current position counter */}
      <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2">
        <div className="flex items-center gap-2 rounded-full bg-black/50 px-3 py-1 text-[11px] text-white/60 backdrop-blur-sm">
          <Play className="h-3 w-3" />
          {currentIndex + 1} / {mockShorts.length}
        </div>
      </div>

      {/* Tap zones for navigation */}
      {currentIndex > 0 && (
        <button
          onClick={() => navigate("up")}
          className="absolute left-1/2 top-4 z-10 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm transition-colors hover:bg-black/60"
        >
          <ChevronUp className="h-4 w-4 text-white/70" />
        </button>
      )}
    </div>
  );
}
