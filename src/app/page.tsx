"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Crown,
  Sparkles,
  Play,
  Users,
  Lock,
  TrendingUp,
  Tv,
  Music,
  Palette,
  Dumbbell,
  Globe,
  ArrowRight,
  Star,
  Shield,
  Zap,
} from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { VideoCard } from "@/components/shared/video-card";
import { ShortCard } from "@/components/shared/short-card";
import { ModelCard } from "@/components/shared/model-card";
import { ScrollableRow } from "@/components/shared/scrollable-row";

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.7, ease: "easeOut" as const },
};

const staggerItem = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

const mockShorts = [
  { title: "Behind the Scenes", gradient: "from-rose-900/50 via-purple-900/50 to-pink-900/50", isPremium: false, views: 12400 },
  { title: "Quick Tutorial", gradient: "from-blue-900/50 via-cyan-900/50 to-teal-900/50", isPremium: true, views: 8700 },
  { title: "Daily Vlog", gradient: "from-amber-900/50 via-orange-900/50 to-yellow-900/50", isPremium: false, views: 5600 },
  { title: "Exclusive Preview", gradient: "from-emerald-900/50 via-green-900/50 to-teal-900/50", isPremium: true, views: 3400 },
  { title: "Moments", gradient: "from-indigo-900/50 via-violet-900/50 to-purple-900/50", isPremium: false, views: 21000 },
  { title: "VIP Content Sneak", gradient: "from-fuchsia-900/50 via-pink-900/50 to-rose-900/50", isVIP: true, views: 1800 },
];

const mockModels = [
  { name: "Sara H.", photosCount: 25, videosCount: 12, requiredMembership: "silver" },
  { name: "Meron T.", photosCount: 18, videosCount: 8, requiredMembership: "silver" },
  { name: "Bethlehem A.", photosCount: 32, videosCount: 15, requiredMembership: "gold" },
  { name: "Tsion W.", photosCount: 20, videosCount: 10, requiredMembership: "free" },
  { name: "Hanna K.", photosCount: 15, videosCount: 6, requiredMembership: "silver" },
  { name: "Selam M.", photosCount: 28, videosCount: 14, requiredMembership: "gold" },
];

const mockVideos = [
  { title: "Summer Special 2026", duration: "12:34", category: "Entertainment", gradient: "from-sky-900/40 via-blue-900/40 to-indigo-900/40", isPremium: false, views: 45200 },
  { title: "Exclusive Interview", duration: "24:15", category: "Music", gradient: "from-violet-900/40 via-purple-900/40 to-fuchsia-900/40", isPremium: true, views: 28900 },
  { title: "Fashion Week Highlights", duration: "8:42", category: "Fashion", gradient: "from-pink-900/40 via-rose-900/40 to-red-900/40", isPremium: false, views: 37100 },
  { title: "Premium Night Show", duration: "45:00", category: "Exclusive", gradient: "from-amber-900/40 via-yellow-900/40 to-orange-900/40", isPremium: true, views: 12300 },
  { title: "Workout Routine", duration: "18:20", category: "Sports", gradient: "from-emerald-900/40 via-green-900/40 to-teal-900/40", isPremium: false, views: 19800 },
  { title: "VIP After Party", duration: "32:10", category: "VIP", gradient: "from-fuchsia-900/40 via-pink-900/40 to-rose-900/40", isVIP: true, views: 8900 },
];

const mockPremium = [
  { title: "Gold Exclusive Content", duration: "15:00", category: "VIP", gradient: "from-fuchsia-900/40 via-purple-900/40 to-violet-900/40", isVIP: true, views: 5600 },
  { title: "Members Only Special", duration: "22:30", category: "Premium", gradient: "from-amber-900/40 via-orange-900/40 to-yellow-900/40", isPremium: true, views: 11200 },
  { title: "VIP Behind the Scenes", duration: "10:45", category: "VIP", gradient: "from-rose-900/40 via-pink-900/40 to-fuchsia-900/40", isVIP: true, views: 4300 },
  { title: "Premium Gallery Tour", duration: "18:00", category: "Premium", gradient: "from-gold/30 via-amber-800/40 to-yellow-900/40", isPremium: true, views: 7800 },
];

const categories = [
  { name: "Entertainment", icon: Tv, gradient: "from-blue-500/10 to-indigo-600/10", hover: "group-hover:from-blue-500/20 group-hover:to-indigo-600/20" },
  { name: "Music", icon: Music, gradient: "from-purple-500/10 to-pink-600/10", hover: "group-hover:from-purple-500/20 group-hover:to-pink-600/20" },
  { name: "Fashion", icon: Sparkles, gradient: "from-pink-500/10 to-rose-600/10", hover: "group-hover:from-pink-500/20 group-hover:to-rose-600/20" },
  { name: "Art", icon: Palette, gradient: "from-amber-500/10 to-orange-600/10", hover: "group-hover:from-amber-500/20 group-hover:to-orange-600/20" },
  { name: "Sports", icon: Dumbbell, gradient: "from-green-500/10 to-emerald-600/10", hover: "group-hover:from-green-500/20 group-hover:to-emerald-600/20" },
  { name: "Lifestyle", icon: Globe, gradient: "from-teal-500/10 to-cyan-600/10", hover: "group-hover:from-teal-500/20 group-hover:to-cyan-600/20" },
];

function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[
        "top-1/4 left-1/4 w-72 h-72 bg-gold/5 blur-3xl rounded-full",
        "top-1/3 right-1/4 w-96 h-96 bg-amber-500/5 blur-3xl rounded-full",
        "bottom-1/4 left-1/3 w-80 h-80 bg-yellow-500/5 blur-3xl rounded-full",
      ].map((cls, i) => (
        <motion.div
          key={i}
          className={`absolute ${cls}`}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function AnimatedGrid() {
  return (
    <div className="absolute inset-0 opacity-[0.02]">
      <div
        className="h-full w-full"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="flex flex-col bg-noise">
      {/* Hero Banner */}
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/95" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold/8 via-amber-500/5 to-transparent" />
        <FloatingOrbs />
        <AnimatedGrid />

        <motion.div
          className="relative z-10 mx-auto max-w-4xl px-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-5 py-2 text-sm text-gold backdrop-blur-sm"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Sparkles className="h-4 w-4" />
            Premium Entertainment Platform
          </motion.div>

          <motion.h1
            className="mb-6 text-5xl font-bold tracking-tight sm:text-7xl lg:text-8xl leading-[1.1]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            Welcome to{" "}
            <span className="text-gradient-gold">HabeshaWii</span>
          </motion.h1>

          <motion.p
            className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground/80 sm:text-xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            Discover exclusive videos, trending shorts, stunning models, and premium
            content. Join the ultimate entertainment experience.
          </motion.p>

          <motion.div
            className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <Link href="/register">
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-gold to-amber-400 text-black font-semibold hover:from-gold-dark hover:to-amber-500 shadow-lg shadow-gold/25 hover:shadow-xl hover:shadow-gold/30 transition-all duration-300 sm:w-auto px-8 h-12"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/videos">
              <Button
                size="lg"
                variant="outline"
                className="w-full border-gold/20 text-gold hover:bg-gold/10 hover:text-gold sm:w-auto px-8 h-12 backdrop-blur-sm"
              >
                <Play className="mr-2 h-4 w-4" />
                Browse Videos
              </Button>
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div
            className="mt-16 flex justify-center gap-8 sm:gap-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            {[
              { value: "500+", label: "Videos" },
              { value: "200+", label: "Models" },
              { value: "10K+", label: "Members" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold text-gradient-gold sm:text-3xl">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground/60 sm:text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] text-muted-foreground/30 uppercase tracking-widest">
              Scroll
            </span>
            <TrendingUp className="h-4 w-4 text-muted-foreground/30" />
          </div>
        </motion.div>
      </section>

      {/* Trending Shorts */}
      <motion.section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6" {...fadeUp}>
        <SectionHeader title="Trending Shorts" href="/shorts" />
        <ScrollableRow>
          {mockShorts.map((short, i) => (
            <motion.div
              key={short.title}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
            >
              <ShortCard {...short} />
            </motion.div>
          ))}
        </ScrollableRow>
      </motion.section>

      {/* Featured Models */}
      <motion.section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6" {...fadeUp}>
        <SectionHeader title="Featured Models" href="/models" />
        <ScrollableRow>
          {mockModels.map((model, i) => (
            <motion.div
              key={model.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
            >
              <ModelCard {...model} />
            </motion.div>
          ))}
        </ScrollableRow>
      </motion.section>

      {/* Latest Videos */}
      <motion.section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6" {...fadeUp}>
        <SectionHeader title="Latest Videos" href="/videos" />
        <div className="grid grid-cols-2 gap-4 sm:gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {mockVideos.map((video, i) => (
            <motion.div
              key={video.title}
              {...staggerItem}
              transition={{ delay: i * 0.05, ...staggerItem.transition }}
            >
              <VideoCard {...video} />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Premium Content */}
      <section className="relative border-t border-border/40 overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-gold/[0.015] to-background" />
        <FloatingOrbs />

        <motion.div className="relative mx-auto max-w-7xl px-4 sm:px-6" {...fadeUp}>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-1.5 text-sm text-gold backdrop-blur-sm">
            <Crown className="h-4 w-4" />
            Premium Access
          </div>
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold sm:text-4xl">Premium Content</h2>
              <p className="mt-2 text-muted-foreground/70">
                Unlock exclusive videos and VIP experiences
              </p>
            </div>
            <Link href="/membership">
              <Button
                variant="outline"
                className="border-gold/20 text-gold hover:bg-gold/10 hover:text-gold backdrop-blur-sm"
              >
                <Crown className="mr-2 h-4 w-4" />
                Upgrade Now
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {mockPremium.map((video, i) => (
              <motion.div
                key={video.title}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <VideoCard {...video} />
                <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/50 backdrop-blur-[3px] transition-all duration-300 hover:bg-black/40">
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/20 backdrop-blur-sm">
                      <Lock className="h-5 w-5 text-gold" />
                    </div>
                    <span className="text-xs font-medium text-gold drop-shadow-lg">
                      {video.isVIP ? "Gold Exclusive" : "Premium Only"}
                    </span>
                    <Link href="/membership">
                      <Button
                        size="sm"
                        className="h-7 text-[10px] bg-gold text-black hover:bg-gold-dark mt-1"
                      >
                        Unlock
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Categories */}
      <motion.section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6" {...fadeUp}>
        <SectionHeader title="Browse by Category" />
        <div className="grid grid-cols-2 gap-4 sm:gap-5 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
              >
                <Link
                  href="/videos"
                  className={`group relative flex h-36 flex-col items-center justify-center gap-3 overflow-hidden rounded-xl border border-border/40 bg-gradient-to-br ${cat.gradient} bg-card/40 backdrop-blur-sm transition-all duration-500 hover:border-gold/30 hover:shadow-xl hover:shadow-gold/10 hover:-translate-y-0.5 ${cat.hover}`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background/50 backdrop-blur-sm transition-all duration-300 group-hover:bg-gold/20 group-hover:scale-110">
                    <Icon className="h-5 w-5 text-muted-foreground transition-colors duration-300 group-hover:text-gold" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground transition-colors duration-300 group-hover:text-gold">
                    {cat.name}
                  </span>
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-gold/0 to-transparent transition-all duration-500 group-hover:via-gold/40" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Trust badges */}
      <motion.section className="mx-auto w-full max-w-7xl px-4 pb-8 sm:px-6" {...fadeUp}>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { icon: Shield, title: "Secure Payment", desc: "Encrypted transactions" },
            { icon: Zap, title: "HD Streaming", desc: "Crystal clear quality" },
            { icon: Star, title: "Exclusive Content", desc: "Members only access" },
            { icon: Users, title: "Active Community", desc: "Join thousands" },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-3 rounded-xl border border-border/30 bg-card/20 p-4 backdrop-blur-sm"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold/10">
                <item.icon className="h-5 w-5 text-gold" />
              </div>
              <div>
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground/60">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Membership Plans */}
      <section className="relative border-t border-border/40 overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-gold/[0.015] to-background" />
        <FloatingOrbs />

        <motion.div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6" {...fadeUp}>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-1.5 text-sm text-gold backdrop-blur-sm">
            <Crown className="h-4 w-4" />
            Membership Plans
          </div>
          <h2 className="mb-4 text-4xl font-bold">Choose Your Plan</h2>
          <p className="mb-14 text-muted-foreground/70 max-w-xl mx-auto">
            Unlock exclusive content and features with our premium membership tiers.
          </p>
          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {[
              {
                name: "Bronze",
                price: "9.99",
                gradient: "from-amber-700 to-amber-600",
                border: "border-amber-700/20",
                bg: "bg-amber-700/5",
                glow: "shadow-amber-700/10",
                features: ["Premium Videos", "Premium Shorts", "HD Streaming"],
                locked: ["Model Chat", "Premium Galleries", "VIP Content"],
              },
              {
                name: "Silver",
                price: "19.99",
                gradient: "from-gray-400 to-gray-300",
                border: "border-gray-400/20",
                bg: "bg-gray-400/5",
                glow: "shadow-gray-400/10",
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
                border: "border-gold/20",
                bg: "bg-gold/5",
                glow: "shadow-gold/15",
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
                transition={{ delay: i * 0.1, duration: 0.6 }}
              >
                <div
                  className={`relative rounded-2xl border ${plan.border} bg-card/40 backdrop-blur-sm p-8 text-left transition-all duration-500 hover:border-gold/30 hover:shadow-2xl hover:shadow-gold/10 hover:-translate-y-1 ${
                    plan.popular
                      ? "ring-1 ring-gold/50 shadow-xl shadow-gold/10"
                      : ""
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-gold to-amber-400 px-5 py-1 text-xs font-bold text-black shadow-lg shadow-gold/25">
                      Most Popular
                    </span>
                  )}
                  <h3 className="mb-1 text-xl font-bold">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground/60">/month</span>
                  </div>
                  <div className="mb-8 space-y-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/50">
                      Included
                    </p>
                    {plan.features.map((f) => (
                      <div key={f} className="flex items-center gap-2.5 text-sm">
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/10">
                          <Crown className="h-3 w-3 text-gold" />
                        </div>
                        {f}
                      </div>
                    ))}
                    {plan.locked.length > 0 && (
                      <>
                        <p className="pt-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/50">
                          Not included
                        </p>
                        {plan.locked.map((f) => (
                          <div
                            key={f}
                            className="flex items-center gap-2.5 text-sm text-muted-foreground/40"
                          >
                            <Lock className="h-3.5 w-3.5 shrink-0" />
                            {f}
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                  <Link href="/membership">
                    <Button
                      className={`w-full bg-gradient-to-r ${plan.gradient} text-white hover:opacity-90 shadow-lg ${plan.glow} transition-all duration-300 h-11`}
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
      <motion.section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6" {...fadeUp}>
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
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group relative overflow-hidden rounded-xl border border-border/30 bg-card/30 p-6 backdrop-blur-sm transition-all duration-500 hover:border-gold/20 hover:shadow-xl hover:shadow-gold/5"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.02] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative z-10">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 text-gold transition-all duration-500 group-hover:bg-gold group-hover:text-black group-hover:shadow-lg group-hover:shadow-gold/20">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold transition-colors group-hover:text-gold">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground/70">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-border/40 py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-gold/[0.02] to-background" />
        <FloatingOrbs />

        <motion.div
          className="relative mx-auto max-w-3xl px-4 text-center sm:px-6"
          {...fadeUp}
        >
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            Ready to Join{" "}
            <span className="text-gradient-gold">HabeshaWii</span>?
          </h2>
          <p className="mb-8 text-muted-foreground/70 text-lg">
            Start your premium journey today. Unlock exclusive content, connect with
            models, and enjoy the ultimate entertainment experience.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-gradient-to-r from-gold to-amber-400 text-black font-semibold hover:from-gold-dark hover:to-amber-500 shadow-lg shadow-gold/25 hover:shadow-xl hover:shadow-gold/30 transition-all duration-300 px-10 h-12"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/membership">
              <Button
                size="lg"
                variant="outline"
                className="border-gold/20 text-gold hover:bg-gold/10 hover:text-gold px-8 h-12 backdrop-blur-sm"
              >
                <Crown className="mr-2 h-4 w-4" />
                View Plans
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
