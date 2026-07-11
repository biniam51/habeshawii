"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Sparkles, Play, Users, Lock, TrendingUp, Tv, Film, Music, Palette, Dumbbell, Globe } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { VideoCard } from "@/components/shared/video-card";
import { ShortCard } from "@/components/shared/short-card";
import { ModelCard } from "@/components/shared/model-card";
import { ScrollableRow } from "@/components/shared/scrollable-row";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6 },
};

const stagger = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.4, staggerChildren: 0.1 },
};

const mockShorts = [
  { title: "Behind the Scenes", thumbnail: "/placeholder.svg", isPremium: false, views: 12400 },
  { title: "Quick Tutorial", thumbnail: "/placeholder.svg", isPremium: true, views: 8700 },
  { title: "Daily Vlog", thumbnail: "/placeholder.svg", isPremium: false, views: 5600 },
  { title: "Exclusive Preview", thumbnail: "/placeholder.svg", isPremium: true, views: 3400 },
  { title: "Moments", thumbnail: "/placeholder.svg", isPremium: false, views: 21000 },
  { title: "VIP Content Sneak", thumbnail: "/placeholder.svg", isVIP: true, views: 1800 },
];

const mockModels = [
  { name: "Sara H.", photo: "", photosCount: 25, videosCount: 12, requiredMembership: "silver" },
  { name: "Meron T.", photo: "", photosCount: 18, videosCount: 8, requiredMembership: "silver" },
  { name: "Bethlehem A.", photo: "", photosCount: 32, videosCount: 15, requiredMembership: "gold" },
  { name: "Tsion W.", photo: "", photosCount: 20, videosCount: 10, requiredMembership: "free" },
  { name: "Hanna K.", photo: "", photosCount: 15, videosCount: 6, requiredMembership: "silver" },
  { name: "Selam M.", photo: "", photosCount: 28, videosCount: 14, requiredMembership: "gold" },
];

const mockVideos = [
  { title: "Summer Special 2026", thumbnail: "/placeholder.svg", duration: "12:34", category: "Entertainment", isPremium: false, views: 45200 },
  { title: "Exclusive Interview", thumbnail: "/placeholder.svg", duration: "24:15", category: "Music", isPremium: true, views: 28900 },
  { title: "Fashion Week Highlights", thumbnail: "/placeholder.svg", duration: "8:42", category: "Fashion", isPremium: false, views: 37100 },
  { title: "Premium Night Show", thumbnail: "/placeholder.svg", duration: "45:00", category: "Exclusive", isPremium: true, views: 12300 },
  { title: "Workout Routine", thumbnail: "/placeholder.svg", duration: "18:20", category: "Sports", isPremium: false, views: 19800 },
  { title: "VIP After Party", thumbnail: "/placeholder.svg", duration: "32:10", category: "VIP", isVIP: true, views: 8900 },
];

const mockPremium = [
  { title: "Gold Exclusive Content", thumbnail: "/placeholder.svg", duration: "15:00", category: "VIP", isVIP: true, views: 5600 },
  { title: "Members Only Special", thumbnail: "/placeholder.svg", duration: "22:30", category: "Premium", isPremium: true, views: 11200 },
  { title: "VIP Behind the Scenes", thumbnail: "/placeholder.svg", duration: "10:45", category: "VIP", isVIP: true, views: 4300 },
  { title: "Premium Gallery Tour", thumbnail: "/placeholder.svg", duration: "18:00", category: "Premium", isPremium: true, views: 7800 },
];

const categories = [
  { name: "Entertainment", icon: Tv, color: "from-blue-500/20 to-blue-600/10" },
  { name: "Music", icon: Music, color: "from-purple-500/20 to-purple-600/10" },
  { name: "Fashion", icon: Sparkles, color: "from-pink-500/20 to-pink-600/10" },
  { name: "Art", icon: Palette, color: "from-amber-500/20 to-amber-600/10" },
  { name: "Sports", icon: Dumbbell, color: "from-green-500/20 to-green-600/10" },
  { name: "Lifestyle", icon: Globe, color: "from-teal-500/20 to-teal-600/10" },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Banner */}
      <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/15 via-transparent to-transparent" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "radial-gradient(circle at 25% 25%, gold 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }} />

        <motion.div
          className="relative z-10 mx-auto max-w-4xl px-4 text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-4 py-1.5 text-sm text-gold"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <Sparkles className="h-4 w-4" />
            Premium Entertainment Platform
          </motion.div>

          <motion.h1
            className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Welcome to{" "}
            <span className="text-gradient-gold">HabeshaWii</span>
          </motion.h1>

          <motion.p
            className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Discover exclusive videos, trending shorts, stunning models, and premium
            content. Join the ultimate entertainment experience.
          </motion.p>

          <motion.div
            className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Link href="/register">
              <Button size="lg" className="w-full bg-gold text-black hover:bg-gold-dark sm:w-auto">
                Get Started Free
              </Button>
            </Link>
            <Link href="/videos">
              <Button
                size="lg"
                variant="outline"
                className="w-full border-gold/30 text-gold hover:bg-gold/10 sm:w-auto"
              >
                <Play className="mr-2 h-4 w-4" />
                Browse Videos
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <TrendingUp className="h-5 w-5 text-muted-foreground/50" />
        </motion.div>
      </section>

      {/* Trending Shorts */}
      <motion.section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6" {...fadeUp}>
        <SectionHeader title="Trending Shorts" href="/shorts" />
        <ScrollableRow>
          {mockShorts.map((short, i) => (
            <motion.div
              key={short.title}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <ShortCard {...short} />
            </motion.div>
          ))}
        </ScrollableRow>
      </motion.section>

      {/* Featured Models */}
      <motion.section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6" {...fadeUp}>
        <SectionHeader title="Featured Models" href="/models" />
        <ScrollableRow>
          {mockModels.map((model, i) => (
            <motion.div
              key={model.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <ModelCard {...model} />
            </motion.div>
          ))}
        </ScrollableRow>
      </motion.section>

      {/* Latest Videos */}
      <motion.section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6" {...fadeUp}>
        <SectionHeader title="Latest Videos" href="/videos" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {mockVideos.map((video, i) => (
            <motion.div
              key={video.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <VideoCard {...video} />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Premium Content */}
      <section className="border-t border-border/40 bg-gradient-to-b from-background via-gold/[0.02] to-background py-16">
        <motion.div className="mx-auto max-w-7xl px-4 sm:px-6" {...fadeUp}>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-4 py-1.5 text-sm text-gold">
            <Crown className="h-4 w-4" />
            Premium Access
          </div>
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">Premium Content</h2>
              <p className="mt-1 text-muted-foreground">
                Unlock exclusive videos and VIP experiences
              </p>
            </div>
            <Link href="/membership">
              <Button variant="outline" size="sm" className="border-gold/30 text-gold hover:bg-gold/10">
                <Crown className="mr-2 h-4 w-4" />
                Upgrade
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {mockPremium.map((video, i) => (
              <motion.div
                key={video.title}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <VideoCard {...video} />
                <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/40 backdrop-blur-[2px]">
                  <div className="flex flex-col items-center gap-2">
                    <Lock className="h-6 w-6 text-gold" />
                    <span className="text-xs font-medium text-gold">
                      {video.isVIP ? "Gold Only" : "Premium"}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Categories */}
      <motion.section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6" {...fadeUp}>
        <SectionHeader title="Browse by Category" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href="/videos"
                  className={`group relative flex h-32 flex-col items-center justify-center gap-3 overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br ${cat.color} transition-all hover:border-gold/50 hover:shadow-lg hover:shadow-gold/5`}
                >
                  <Icon className="h-6 w-6 text-muted-foreground transition-colors group-hover:text-gold" />
                  <span className="text-sm font-medium text-muted-foreground transition-colors group-hover:text-gold">
                    {cat.name}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Membership Plans */}
      <section className="border-t border-border/40 bg-gradient-to-b from-background via-gold/[0.02] to-background py-16">
        <motion.div className="mx-auto max-w-7xl px-4 text-center sm:px-6" {...fadeUp}>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-4 py-1.5 text-sm text-gold">
            <Crown className="h-4 w-4" />
            Membership Plans
          </div>
          <h2 className="mb-4 text-3xl font-bold">Choose Your Plan</h2>
          <p className="mb-12 text-muted-foreground">
            Unlock exclusive content and features with our premium membership tiers.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                name: "Bronze",
                price: "9.99",
                gradient: "from-amber-700 to-amber-600",
                border: "border-amber-700/30",
                bg: "bg-amber-700/10",
                badge: "bg-amber-600",
                features: ["Premium Videos", "Premium Shorts", "HD Streaming"],
                locked: ["Model Chat", "Premium Galleries", "VIP Content"],
              },
              {
                name: "Silver",
                price: "19.99",
                gradient: "from-gray-400 to-gray-300",
                border: "border-gray-400/30",
                bg: "bg-gray-400/10",
                badge: "bg-gray-400",
                popular: true,
                features: [
                  "Everything in Bronze",
                  "Model Profiles",
                  "Premium Galleries",
                  "Model Chat",
                ],
                locked: ["VIP Content"],
              },
              {
                name: "Gold",
                price: "39.99",
                gradient: "from-gold to-amber-400",
                border: "border-gold/30",
                bg: "bg-gold/10",
                badge: "bg-gold",
                features: [
                  "Everything in Silver",
                  "VIP Videos",
                  "VIP Shorts",
                  "VIP Galleries",
                  "Exclusive Content",
                ],
                locked: [],
              },
            ].map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div
                  className={`relative rounded-2xl border ${plan.border} bg-card p-8 text-left transition-all hover:border-gold/50 ${
                    plan.popular ? "ring-1 ring-gold shadow-lg shadow-gold/5" : ""
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold px-4 py-1 text-xs font-bold text-black">
                      Most Popular
                    </span>
                  )}
                  <h3 className="mb-2 text-xl font-bold">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <div className="mb-8 space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Included
                    </p>
                    {plan.features.map((f) => (
                      <div key={f} className="flex items-center gap-2 text-sm">
                        <Crown className="h-4 w-4 shrink-0 text-gold" />
                        {f}
                      </div>
                    ))}
                    {plan.locked.length > 0 && (
                      <>
                        <p className="pt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Not included
                        </p>
                        {plan.locked.map((f) => (
                          <div key={f} className="flex items-center gap-2 text-sm text-muted-foreground/60">
                            <Lock className="h-4 w-4 shrink-0" />
                            {f}
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                  <Link href="/membership">
                    <Button
                      className={`w-full bg-gradient-to-r ${plan.gradient} text-white hover:opacity-90`}
                    >
                      Get {plan.name}
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <motion.section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6" {...fadeUp}>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Play,
              title: "Premium Videos",
              desc: "High-quality videos in HD streaming. Access exclusive content with your membership.",
            },
            {
              icon: Users,
              title: "Model Profiles",
              desc: "Explore detailed model profiles with photos, videos, and personal bios.",
            },
            {
              icon: Crown,
              title: "VIP Experience",
              desc: "Upgrade to Gold for the ultimate VIP experience with exclusive content.",
            },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group rounded-xl border border-border/50 bg-card p-6 transition-all hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gold/10 text-gold transition-colors group-hover:bg-gold group-hover:text-black">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
