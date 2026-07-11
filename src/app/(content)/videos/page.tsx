"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Clock, TrendingUp, Eye, Lock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { VideoCard } from "@/components/shared/video-card";
import { useAuth } from "@/components/layout/auth-provider";
import { useMembership } from "@/components/layout/membership-provider";
import type { MembershipPlan } from "@/types";

type SortMode = "latest" | "trending" | "views";

const categories = [
  { name: "All", slug: null },
  { name: "Entertainment", slug: "entertainment" },
  { name: "Music", slug: "music" },
  { name: "Fashion", slug: "fashion" },
  { name: "Art", slug: "art" },
  { name: "Sports", slug: "sports" },
  { name: "Lifestyle", slug: "lifestyle" },
  { name: "Exclusive", slug: "exclusive" },
];

const mockVideos = [
  { id: "1", title: "Summer Special 2026", duration: "12:34", category: "Entertainment", slug: "entertainment", gradient: "from-sky-900/50 via-blue-900/50 to-indigo-900/50", isPremium: false, views: 45200, featured: true },
  { id: "2", title: "Exclusive Interview", duration: "24:15", category: "Music", slug: "music", gradient: "from-violet-900/50 via-purple-900/50 to-fuchsia-900/50", isPremium: true, views: 28900 },
  { id: "3", title: "Fashion Week Highlights", duration: "8:42", category: "Fashion", slug: "fashion", gradient: "from-pink-900/50 via-rose-900/50 to-red-900/50", isPremium: false, views: 37100 },
  { id: "4", title: "Premium Night Show", duration: "45:00", category: "Exclusive", slug: "exclusive", gradient: "from-amber-900/50 via-yellow-900/50 to-orange-900/50", isPremium: true, views: 12300 },
  { id: "5", title: "Workout Routine", duration: "18:20", category: "Sports", slug: "sports", gradient: "from-emerald-900/50 via-green-900/50 to-teal-900/50", isPremium: false, views: 19800 },
  { id: "6", title: "VIP After Party", duration: "32:10", category: "VIP", slug: "vip", gradient: "from-fuchsia-900/50 via-pink-900/50 to-rose-900/50", isVIP: true, views: 8900 },
  { id: "7", title: "Art Exhibition Tour", duration: "15:30", category: "Art", slug: "art", gradient: "from-indigo-900/50 via-violet-900/50 to-purple-900/50", isPremium: false, views: 15400 },
  { id: "8", title: "Music Festival Recap", duration: "28:00", category: "Music", slug: "music", gradient: "from-purple-900/50 via-fuchsia-900/50 to-pink-900/50", isPremium: true, views: 31200 },
  { id: "9", title: "Lifestyle Daily Vlog", duration: "10:15", category: "Lifestyle", slug: "lifestyle", gradient: "from-teal-900/50 via-cyan-900/50 to-sky-900/50", isPremium: false, views: 8700 },
  { id: "10", title: "Gold Members Special", duration: "42:00", category: "VIP", slug: "vip", gradient: "from-gold/30 via-amber-800/40 to-yellow-900/40", isVIP: true, views: 5600 },
  { id: "11", title: "Behind the Music", duration: "20:45", category: "Music", slug: "music", gradient: "from-rose-900/50 via-pink-900/50 to-fuchsia-900/50", isPremium: false, views: 22100 },
  { id: "12", title: "Fashion Designer Spotlight", duration: "14:30", category: "Fashion", slug: "fashion", gradient: "from-orange-900/50 via-amber-900/50 to-yellow-900/50", isPremium: true, views: 16300 },
];

export default function VideosPage() {
  const { user } = useAuth();
  const { canAccess } = useMembership();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sort, setSort] = useState<SortMode>("latest");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = [...mockVideos];

    // Filter by category
    if (activeCategory) {
      result = result.filter((v) => v.slug === activeCategory);
    }

    // Filter by search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((v) => v.title.toLowerCase().includes(q));
    }

    // Sort
    switch (sort) {
      case "latest":
        result = result.sort((a, b) => (a.featured ? -1 : 1));
        break;
      case "trending":
        result = result.sort((a, b) => b.views - a.views);
        break;
      case "views":
        result = result.sort((a, b) => b.views - a.views);
        break;
    }

    return result;
  }, [activeCategory, search, sort]);

  const requiresMembership = (video: typeof mockVideos[0]) => {
    if (video.isVIP) return "gold" as MembershipPlan;
    if (video.isPremium) return "bronze" as MembershipPlan;
    return null;
  };

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="border-b border-border/40 bg-card/20 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold">Videos</h1>
            <p className="mt-1 text-muted-foreground/70">
              Browse our collection of premium content
            </p>
          </motion.div>

          {/* Search + Sort */}
          <motion.div
            className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
              <Input
                placeholder="Search videos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-background pl-9"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="flex gap-2">
              {[
                { value: "latest" as const, label: "Latest", icon: Clock },
                { value: "trending" as const, label: "Trending", icon: TrendingUp },
                { value: "views" as const, label: "Most Viewed", icon: Eye },
              ].map((opt) => (
                <Button
                  key={opt.value}
                  variant={sort === opt.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSort(opt.value)}
                  className={sort === opt.value ? "bg-gold text-black hover:bg-gold-dark" : ""}
                >
                  <opt.icon className="mr-1.5 h-3.5 w-3.5" />
                  {opt.label}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Category tabs */}
          <motion.div
            className="mt-4 flex gap-2 overflow-x-auto no-scrollbar pb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.slug)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  activeCategory === cat.slug
                    ? "bg-gold text-black"
                    : "bg-card/50 text-muted-foreground hover:text-foreground border border-border/50"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Video Grid */}
      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search className="mb-4 h-12 w-12 text-muted-foreground/20" />
            <h3 className="text-lg font-medium">No videos found</h3>
            <p className="text-sm text-muted-foreground/70">
              Try adjusting your search or filters
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                setSearch("");
                setActiveCategory(null);
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filtered.map((video, i) => {
              const requiredPlan = requiresMembership(video);
              const isLocked = requiredPlan && !canAccess(requiredPlan);

              return (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 12) * 0.05, duration: 0.4 }}
                  className="relative"
                >
                  <VideoCard
                    title={video.title}
                    duration={video.duration}
                    category={video.category}
                    gradient={video.gradient}
                    isPremium={video.isPremium}
                    isVIP={video.isVIP}
                    views={video.views}
                  />
                  {isLocked && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/40 backdrop-blur-[2px]">
                      <div className="flex flex-col items-center gap-1.5">
                        <Lock className="h-5 w-5 text-gold" />
                        <span className="text-[10px] font-medium text-gold">
                          {requiredPlan === "gold" ? "Gold Only" : "Premium"}
                        </span>
                        <Link href={user ? "/membership" : "/register"}>
                          <Button
                            size="sm"
                            className="h-6 text-[10px] bg-gold text-black hover:bg-gold-dark px-3"
                          >
                            {user ? "Upgrade" : "Join"}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Count */}
        <div className="mt-6 text-center text-xs text-muted-foreground/50">
          Showing {filtered.length} of {mockVideos.length} videos
        </div>
      </section>
    </div>
  );
}
