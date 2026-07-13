"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/components/layout/auth-provider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Crown, User, Calendar, Loader2, Heart, MessageCircle, CreditCard, Clock, CheckCircle, XCircle, ArrowRight, Film, Clapperboard, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function UserDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [profile, setProfile] = useState<any>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    if (user.email === "biniyammulat51@gmail.com") { router.replace("/admin"); return; }
    load();
  }, [user]);

  async function load() {
    const [profRes, favRes, payRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user!.id).single(),
      supabase.from("favorites").select("*").eq("user_id", user!.id).order("created_at", { ascending: false }).limit(6),
      supabase.from("payment_submissions").select("*").eq("user_id", user!.id).order("created_at", { ascending: false }).limit(10),
    ]);
    if (profRes.data) setProfile(profRes.data);
    setFavorites(favRes.data || []);
    setPayments(payRes.data || []);
    setLoading(false);
  }

  function daysRemaining(expiresAt: string | null) {
    if (!expiresAt) return null;
    const diff = new Date(expiresAt).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
    </div>
  );

  const days = daysRemaining(profile?.membership_expires_at);
  const statusBadge = profile?.membership && profile?.membership !== "free"
    ? (days && days > 0 ? "Active" : "Expired")
    : "Free";

  const typeIcons: Record<string, any> = { video: Film, short: Clapperboard, model: UserCircle };
  const typeLinks: Record<string, string> = { video: "/videos", short: "/shorts", model: "/models" };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.h1 className="text-2xl font-bold" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        My Dashboard
      </motion.h1>

      {/* Top row cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Account */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="rounded-lg bg-blue-500/10 p-2"><User className="h-4 w-4 text-blue-500" /></div>
            <span className="text-sm text-zinc-500">Account</span>
          </div>
          <p className="text-sm font-medium truncate">{user?.email}</p>
          <p className="text-xs text-zinc-500 mt-1">{profile?.full_name || "No name set"}</p>
        </motion.div>

        {/* Membership */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="rounded-lg bg-amber-500/10 p-2"><Crown className="h-4 w-4 text-amber-500" /></div>
            <span className="text-sm text-zinc-500">Membership</span>
          </div>
          <p className="text-lg font-bold capitalize">{profile?.membership || "Free"}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs px-2 py-0.5 rounded-full ${statusBadge === "Active" ? "bg-green-500/10 text-green-500" : statusBadge === "Expired" ? "bg-red-500/10 text-red-500" : "bg-zinc-500/10 text-zinc-500"}`}>
              {statusBadge}
            </span>
            {days !== null && profile?.membership !== "free" && (
              <span className="text-xs text-zinc-500">{days} days left</span>
            )}
          </div>
        </motion.div>

        {/* Saved */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="rounded-lg bg-pink-500/10 p-2"><Heart className="h-4 w-4 text-pink-500" /></div>
            <span className="text-sm text-zinc-500">Saved</span>
          </div>
          <p className="text-lg font-bold">{favorites.length}</p>
          <p className="text-xs text-zinc-500 mt-1">items saved</p>
        </motion.div>

        {/* Messages */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          onClick={() => router.push("/chat")}
          className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 cursor-pointer hover:border-gold/30 transition-colors"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="rounded-lg bg-purple-500/10 p-2"><MessageCircle className="h-4 w-4 text-purple-500" /></div>
            <span className="text-sm text-zinc-500">Messages</span>
          </div>
          <p className="text-sm font-medium">Open Chat</p>
          <p className="text-xs text-zinc-500 mt-1">Talk to admin</p>
        </motion.div>
      </div>

      {/* Favorites row */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold flex items-center gap-2"><Heart className="h-4 w-4 text-pink-500" /> Saved Content</h2>
          {favorites.length > 6 && <Link href="#" className="text-xs text-gold hover:underline">View all</Link>}
        </div>
        {favorites.length === 0 ? (
          <Card className="border-dashed border-zinc-700">
            <CardContent className="py-8 text-center">
              <Heart className="h-8 w-8 mx-auto text-zinc-600 mb-2" />
              <p className="text-sm text-zinc-500">No saved items yet</p>
              <p className="text-xs text-zinc-600 mt-1">Click the heart icon on videos, shorts, or models to save them here</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {favorites.map((fav, i) => {
              const Icon = typeIcons[fav.item_type as keyof typeof typeIcons] || Heart;
              const link = fav.item_type === "model" ? `/models/${fav.item_id}` : typeLinks[fav.item_type as keyof typeof typeIcons] || "#";
              return (
                <Link key={fav.id} href={link}>
                  <div className="aspect-square rounded-xl border border-zinc-800 bg-zinc-900/50 flex flex-col items-center justify-center gap-2 hover:border-gold/30 transition-colors">
                    <Icon className="h-6 w-6 text-zinc-500" />
                    <span className="text-[10px] text-zinc-500 capitalize">{fav.item_type}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Payment History */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold flex items-center gap-2"><CreditCard className="h-4 w-4 text-amber-500" /> Payment History</h2>
        </div>
        {payments.length === 0 ? (
          <Card className="border-dashed border-zinc-700">
            <CardContent className="py-8 text-center">
              <CreditCard className="h-8 w-8 mx-auto text-zinc-600 mb-2" />
              <p className="text-sm text-zinc-500">No payments yet</p>
              <Link href="/membership" className="text-xs text-gold hover:underline mt-1 inline-block">Subscribe to a plan</Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {payments.map((p) => {
              const StatusIcon = p.status === "approved" ? CheckCircle : p.status === "rejected" ? XCircle : Clock;
              const statusColor = p.status === "approved" ? "text-green-500" : p.status === "rejected" ? "text-red-500" : "text-amber-500";
              return (
                <div key={p.id} className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/30 px-4 py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <StatusIcon className={`h-4 w-4 shrink-0 ${statusColor}`} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium capitalize truncate">{p.plan} Plan</p>
                      <p className="text-xs text-zinc-500">{new Date(p.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium shrink-0">${p.amount.toFixed(2)}</span>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
