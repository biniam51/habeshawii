"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, X, Users, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ModelCard } from "@/components/shared/model-card";

const mockModels = [
  { id: "1", name: "Sara H.", gradient: "from-rose-500/20 via-pink-500/20 to-purple-500/20", photosCount: 25, videosCount: 12, requiredMembership: "silver", featured: true },
  { id: "2", name: "Meron T.", gradient: "from-blue-500/20 via-cyan-500/20 to-teal-500/20", photosCount: 18, videosCount: 8, requiredMembership: "silver" },
  { id: "3", name: "Bethlehem A.", gradient: "from-amber-500/20 via-orange-500/20 to-yellow-500/20", photosCount: 32, videosCount: 15, requiredMembership: "gold", featured: true },
  { id: "4", name: "Tsion W.", gradient: "from-green-500/20 via-emerald-500/20 to-teal-500/20", photosCount: 20, videosCount: 10, requiredMembership: "free" },
  { id: "5", name: "Hanna K.", gradient: "from-purple-500/20 via-fuchsia-500/20 to-pink-500/20", photosCount: 15, videosCount: 6, requiredMembership: "silver" },
  { id: "6", name: "Selam M.", gradient: "from-indigo-500/20 via-violet-500/20 to-purple-500/20", photosCount: 28, videosCount: 14, requiredMembership: "gold", featured: true },
  { id: "7", name: "Ruth D.", gradient: "from-red-500/20 via-rose-500/20 to-pink-500/20", photosCount: 22, videosCount: 9, requiredMembership: "silver" },
  { id: "8", name: "Lydia K.", gradient: "from-teal-500/20 via-cyan-500/20 to-sky-500/20", photosCount: 16, videosCount: 7, requiredMembership: "free" },
  { id: "9", name: "Makeda S.", gradient: "from-violet-500/20 via-purple-500/20 to-fuchsia-500/20", photosCount: 30, videosCount: 18, requiredMembership: "gold" },
  { id: "10", name: "Frehiwot G.", gradient: "from-sky-500/20 via-blue-500/20 to-indigo-500/20", photosCount: 12, videosCount: 5, requiredMembership: "silver" },
  { id: "11", name: "Azeb T.", gradient: "from-pink-500/20 via-rose-500/20 to-red-500/20", photosCount: 24, videosCount: 11, requiredMembership: "free" },
  { id: "12", name: "Hiwot A.", gradient: "from-lime-500/20 via-green-500/20 to-emerald-500/20", photosCount: 19, videosCount: 8, requiredMembership: "silver" },
];

const membershipFilters = [
  { value: null, label: "All" },
  { value: "free", label: "Free" },
  { value: "silver", label: "Silver+" },
  { value: "gold", label: "Gold" },
];

export default function ModelsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = [...mockModels];
    if (filter) {
      result = result.filter((m) => m.requiredMembership === filter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((m) => m.name.toLowerCase().includes(q));
    }
    return result;
  }, [filter, search]);

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="border-b border-border/40 bg-card/20 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-gold" />
              <h1 className="text-3xl font-bold">Models</h1>
            </div>
            <p className="mt-1 text-muted-foreground/70">
              Explore our exclusive model profiles
            </p>
          </motion.div>

          <motion.div
            className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
              <Input
                placeholder="Search models..."
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
          </motion.div>

          {/* Membership filter */}
          <motion.div
            className="mt-4 flex gap-2 overflow-x-auto no-scrollbar pb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {membershipFilters.map((f) => (
              <button
                key={f.value || "all"}
                onClick={() => setFilter(f.value)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  filter === f.value
                    ? "bg-gold text-black"
                    : "bg-card/50 text-muted-foreground hover:text-foreground border border-border/50"
                }`}
              >
                {f.label}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Users className="mb-4 h-12 w-12 text-muted-foreground/20" />
            <h3 className="text-lg font-medium">No models found</h3>
            <p className="text-sm text-muted-foreground/70">
              Try adjusting your search or filters
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => { setSearch(""); setFilter(null); }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {filtered.map((model, i) => (
              <motion.div
                key={model.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 12) * 0.04, duration: 0.4 }}
              >
                <Link href={`/models/${model.id}`} className="block">
                  <ModelCard
                    name={model.name}
                    photo=""
                    photosCount={model.photosCount}
                    videosCount={model.videosCount}
                    requiredMembership={model.requiredMembership}
                  />
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-6 text-center text-xs text-muted-foreground/50">
          Showing {filtered.length} of {mockModels.length} models
        </div>
      </section>
    </div>
  );
}
