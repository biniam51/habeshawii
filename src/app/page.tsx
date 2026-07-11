import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Crown, Sparkles, Play, Users } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Banner */}
      <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent" />
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-4 py-1.5 text-sm text-gold">
            <Sparkles className="h-4 w-4" />
            Premium Entertainment Platform
          </div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Welcome to{" "}
            <span className="text-gradient-gold">HabeshaWii</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Discover exclusive videos, trending shorts, stunning models, and premium
            content. Join the ultimate entertainment experience.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
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
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Browse by Category</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {["Entertainment", "Music", "Fashion", "Lifestyle", "Sports", "Exclusive"].map(
            (cat) => (
              <Link
                key={cat}
                href="/videos"
                className="group relative flex h-32 items-center justify-center overflow-hidden rounded-xl border border-border/50 bg-card transition-all hover:border-gold/50 hover:bg-card/80"
              >
                <span className="text-sm font-medium text-muted-foreground transition-colors group-hover:text-gold">
                  {cat}
                </span>
              </Link>
            )
          )}
        </div>
      </section>

      {/* Membership Plans Preview */}
      <section className="border-t border-border/40 bg-card/30 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6">
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
                color: "from-amber-700 to-amber-600",
                border: "border-amber-700/30",
                features: ["Premium Videos", "Premium Shorts", "HD Streaming"],
              },
              {
                name: "Silver",
                price: "19.99",
                color: "from-gray-400 to-gray-300",
                border: "border-gray-400/30",
                popular: true,
                features: [
                  "Everything in Bronze",
                  "Model Profiles",
                  "Premium Galleries",
                  "Model Chat",
                ],
              },
              {
                name: "Gold",
                price: "39.99",
                color: "from-gold to-amber-400",
                border: "border-gold/30",
                features: [
                  "Everything in Silver",
                  "VIP Videos",
                  "VIP Shorts",
                  "VIP Galleries",
                  "Exclusive Content",
                ],
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border ${
                  plan.border
                } bg-card p-8 transition-all hover:border-gold/50 ${
                  plan.popular ? "ring-1 ring-gold" : ""
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
                <ul className="mb-8 space-y-3 text-left text-sm text-muted-foreground">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <Crown className="h-4 w-4 shrink-0 text-gold" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/membership">
                  <Button
                    className={`w-full bg-gradient-to-r ${plan.color} text-white hover:opacity-90`}
                  >
                    Get {plan.name}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-8 md:grid-cols-3">
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
          ].map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-border/50 bg-card p-6 transition-all hover:border-gold/30"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gold/10 text-gold">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
