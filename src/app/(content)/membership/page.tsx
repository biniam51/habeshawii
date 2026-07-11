"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Crown, Check, X, Sparkles, ArrowRight, HelpCircle, Shield, CreditCard, RefreshCw, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/layout/auth-provider";
import { useMembership } from "@/components/layout/membership-provider";
import { Badge } from "@/components/ui/badge";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6 },
};

const plans = [
  {
    id: "bronze",
    name: "Bronze",
    price: "9.99",
    gradient: "from-amber-700 to-amber-600",
    border: "border-amber-700/20 hover:border-amber-600/40",
    glow: "shadow-amber-700/10",
    icon: "🥉",
    features: {
      basic: true,
      premium_videos: true,
      premium_shorts: true,
      hd: true,
      models: false,
      galleries: false,
      chat: false,
      vip_videos: false,
      vip_shorts: false,
      vip_galleries: false,
      exclusive: false,
    },
  },
  {
    id: "silver",
    name: "Silver",
    price: "19.99",
    gradient: "from-gray-400 to-gray-300",
    border: "border-gray-400/20 hover:border-gray-300/40",
    glow: "shadow-gray-400/10",
    icon: "🥈",
    popular: true,
    features: {
      basic: true,
      premium_videos: true,
      premium_shorts: true,
      hd: true,
      models: true,
      galleries: true,
      chat: true,
      vip_videos: false,
      vip_shorts: false,
      vip_galleries: false,
      exclusive: false,
    },
  },
  {
    id: "gold",
    name: "Gold",
    price: "39.99",
    gradient: "from-gold to-amber-400",
    border: "border-gold/20 hover:border-gold/40",
    glow: "shadow-gold/15",
    icon: "🥇",
    features: {
      basic: true,
      premium_videos: true,
      premium_shorts: true,
      hd: true,
      models: true,
      galleries: true,
      chat: true,
      vip_videos: true,
      vip_shorts: true,
      vip_galleries: true,
      exclusive: true,
    },
  },
];

const comparisonFeatures = [
  { key: "basic", label: "Basic Content", desc: "Free videos and shorts" },
  { key: "premium_videos", label: "Premium Videos", desc: "Full-length premium content" },
  { key: "premium_shorts", label: "Premium Shorts", desc: "Exclusive short-form content" },
  { key: "hd", label: "HD Streaming", desc: "High-definition video playback" },
  { key: "models", label: "Model Profiles", desc: "Browse model portfolios" },
  { key: "galleries", label: "Premium Galleries", desc: "Exclusive photo galleries" },
  { key: "chat", label: "Model Chat", desc: "Direct messaging with models" },
  { key: "vip_videos", label: "VIP Videos", desc: "Gold-only premium videos" },
  { key: "vip_shorts", label: "VIP Shorts", desc: "Gold-only short content" },
  { key: "vip_galleries", label: "VIP Galleries", desc: "Gold-only photo galleries" },
  { key: "exclusive", label: "Exclusive Content", desc: "Limited release content" },
];

const faqs = [
  {
    q: "How does membership work?",
    a: "Choose a plan, complete payment, and your membership activates immediately. You'll get access to all content included in your tier.",
  },
  {
    q: "Can I upgrade or downgrade?",
    a: "Yes! You can upgrade at any time. Downgrades take effect at the end of your current billing period.",
  },
  {
    q: "What payment methods are accepted?",
    a: "We accept Telebirr and CBE (Commercial Bank of Ethiopia) payments. Manual payment verification is required.",
  },
  {
    q: "Is there a free trial?",
    a: "You can browse free content without an account. Premium features require an active membership.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes, you can cancel your membership at any time. Access continues until the end of your paid period.",
  },
];

export default function MembershipPage() {
  const { user } = useAuth();
  const { plan: currentPlan, isActive } = useMembership();

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-gold/[0.02] to-background" />
        <motion.div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6" {...fadeUp}>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-1.5 text-sm text-gold backdrop-blur-sm">
            <Crown className="h-4 w-4" />
            Membership Plans
          </div>
          <h1 className="mb-4 text-4xl font-bold sm:text-5xl">
            Unlock the Full{" "}
            <span className="text-gradient-gold">HabeshaWii</span> Experience
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground/70">
            Choose the plan that fits your needs. From premium content to VIP
            exclusives, there is something for everyone.
          </p>

          {isActive && (
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold/10 px-5 py-2 text-sm text-gold">
              <Crown className="h-4 w-4" />
              You are on the <strong className="capitalize mx-1">{currentPlan}</strong> plan
            </div>
          )}
        </motion.div>
      </section>

      {/* Pricing Cards */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              <div
                className={`group relative rounded-2xl border ${plan.border} bg-card/40 backdrop-blur-sm p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-gold/10 hover:-translate-y-1 ${
                  plan.popular ? "ring-1 ring-gold/50 shadow-xl shadow-gold/10" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-gold to-amber-400 px-5 py-1 text-xs font-bold text-black shadow-lg shadow-gold/25">
                      <Sparkles className="h-3 w-3" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-2 text-3xl">{plan.icon}</div>
                <h3 className="mb-1 text-2xl font-bold">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-5xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground/60">/month</span>
                </div>

                <div className="mb-8 space-y-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/50">
                    Features
                  </p>
                  {[
                    { key: "premium_videos" as const, label: "Premium Videos" },
                    { key: "premium_shorts" as const, label: "Premium Shorts" },
                    { key: "hd" as const, label: "HD Streaming" },
                    { key: "models" as const, label: "Model Profiles" },
                    { key: "galleries" as const, label: "Premium Galleries" },
                    { key: "chat" as const, label: "Model Chat" },
                    { key: "vip_videos" as const, label: "VIP Videos" },
                    { key: "vip_shorts" as const, label: "VIP Shorts" },
                    { key: "vip_galleries" as const, label: "VIP Galleries" },
                    { key: "exclusive" as const, label: "Exclusive Content" },
                  ].map((feat) => {
                    const included = plan.features[feat.key];
                    return (
                      <div
                        key={feat.key}
                        className={`flex items-center gap-2.5 text-sm ${
                          included ? "" : "text-muted-foreground/30"
                        }`}
                      >
                        {included ? (
                          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/10">
                            <Check className="h-3 w-3 text-gold" />
                          </div>
                        ) : (
                          <X className="h-4 w-4 shrink-0" />
                        )}
                        {feat.label}
                      </div>
                    );
                  })}
                </div>

                <Link
                  href={
                    user
                      ? `/membership/checkout?plan=${plan.id}`
                      : "/register"
                  }
                >
                  <Button
                    className={`w-full bg-gradient-to-r ${plan.gradient} text-white hover:opacity-90 shadow-lg ${plan.glow} transition-all duration-300 h-12 text-base`}
                  >
                    {currentPlan === plan.id && isActive
                      ? "Current Plan"
                      : `Get ${plan.name}`}
                    {currentPlan !== plan.id && (
                      <ArrowRight className="ml-2 h-4 w-4" />
                    )}
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="border-t border-border/40 py-20">
        <motion.div className="mx-auto max-w-5xl px-4 sm:px-6" {...fadeUp}>
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-3xl font-bold">Feature Comparison</h2>
            <p className="text-muted-foreground/70">
              See exactly what each plan includes
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border/40">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/40 bg-card/30">
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                    Feature
                  </th>
                  {plans.map((p) => (
                    <th
                      key={p.id}
                      className={`px-6 py-4 text-center text-sm font-bold ${
                        p.popular ? "text-gold" : ""
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        {p.icon}
                        {p.name}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feat, i) => (
                  <tr
                    key={feat.key}
                    className={`border-b border-border/20 transition-colors hover:bg-card/20 ${
                      i % 2 === 0 ? "bg-background/50" : ""
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium">{feat.label}</div>
                      <div className="text-xs text-muted-foreground/50">
                        {feat.desc}
                      </div>
                    </td>
                    {plans.map((p) => (
                      <td key={p.id} className="px-6 py-4 text-center">
                        {p.features[feat.key as keyof typeof p.features] ? (
                          <div className="flex justify-center">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gold/10">
                              <Check className="h-4 w-4 text-gold" />
                            </div>
                          </div>
                        ) : (
                          <X className="mx-auto h-4 w-4 text-muted-foreground/30" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="border-t border-border/40 py-20">
        <motion.div className="mx-auto max-w-5xl px-4 sm:px-6" {...fadeUp}>
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold">How It Works</h2>
            <p className="text-muted-foreground/70">
              Getting started is simple
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                icon: Crown,
                title: "Choose a Plan",
                desc: "Select the membership tier that matches your needs.",
              },
              {
                step: "02",
                icon: CreditCard,
                title: "Make Payment",
                desc: "Pay via Telebirr or CBE. Upload your receipt for verification.",
              },
              {
                step: "03",
                icon: RefreshCw,
                title: "Get Access",
                desc: "Once approved, your membership activates instantly.",
              },
            ].map((step) => (
              <div
                key={step.step}
                className="relative rounded-xl border border-border/30 bg-card/30 p-6 text-center backdrop-blur-sm"
              >
                <div className="mb-4 text-4xl font-bold text-gold/20">
                  {step.step}
                </div>
                <div className="mb-4 flex justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 text-gold">
                    <step.icon className="h-6 w-6" />
                  </div>
                </div>
                <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground/70">{step.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border/40 py-20">
        <motion.div className="mx-auto max-w-3xl px-4 sm:px-6" {...fadeUp}>
          <div className="mb-10 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-1.5 text-sm text-gold backdrop-blur-sm">
              <HelpCircle className="h-4 w-4" />
              FAQ
            </div>
            <h2 className="mb-3 text-3xl font-bold">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-xl border border-border/30 bg-card/30 backdrop-blur-sm transition-all hover:border-gold/20"
              >
                <summary className="flex cursor-pointer items-center justify-between px-6 py-4 text-sm font-medium transition-colors hover:text-gold">
                  {faq.q}
                  <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                </summary>
                <div className="border-t border-border/20 px-6 py-4 text-sm text-muted-foreground/70">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-border/40 py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-gold/[0.02] to-background" />
        <motion.div
          className="relative mx-auto max-w-3xl px-4 text-center sm:px-6"
          {...fadeUp}
        >
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            Ready to{" "}
            <span className="text-gradient-gold">Level Up</span>?
          </h2>
          <p className="mb-8 text-muted-foreground/70 text-lg">
            Join thousands of members enjoying premium content. Start your journey
            today.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href={user ? "#" : "/register"}>
              <Button
                size="lg"
                className="bg-gradient-to-r from-gold to-amber-400 text-black font-semibold hover:from-gold-dark hover:to-amber-500 shadow-lg shadow-gold/25 hover:shadow-xl hover:shadow-gold/30 transition-all duration-300 px-10 h-12"
              >
                {isActive ? "View Dashboard" : "Get Started Free"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            {isActive && (
              <Link href="/dashboard">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gold/20 text-gold hover:bg-gold/10 hover:text-gold px-8 h-12 backdrop-blur-sm"
                >
                  <Crown className="mr-2 h-4 w-4" />
                  My Membership
                </Button>
              </Link>
            )}
          </div>
        </motion.div>
      </section>
    </div>
  );
}


