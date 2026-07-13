"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/components/layout/auth-provider";
import { useRouter } from "next/navigation";
import { Video, Clapperboard, Users, UserCircle, DollarSign, Loader2 } from "lucide-react";

export default function AdminOverview() {
  const { user } = useAuth();
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [stats, setStats] = useState({ videos: 0, shorts: 0, models: 0, users: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    if (user.email !== "biniyammulat51@gmail.com") {
      router.push("/");
      return;
    }
    async function loadStats() {
      try {
        const [v, s, m, u, p] = await Promise.all([
          supabase.from("videos").select("id"),
          supabase.from("shorts").select("id"),
          supabase.from("models").select("id"),
          supabase.from("profiles").select("id"),
          supabase.from("payment_submissions").select("amount").eq("status", "approved"),
        ]);
        const revenue = (p.data || []).reduce((sum: number, r: any) => sum + Number(r.amount), 0);
        setStats({
          videos: v.data?.length ?? 0,
          shorts: s.data?.length ?? 0,
          models: m.data?.length ?? 0,
          users: u.data?.length ?? 0,
          revenue,
        });
      } catch (e: any) {
        setError(e?.message || "Failed to load stats");
      }
      setLoading(false);
    }
    loadStats();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <p className="text-red-500 mb-2">{error}</p>
          <p className="text-zinc-500 text-sm">Make sure all database tables exist and RLS policies are correct.</p>
        </div>
      </div>
    );
  }

  const cards = [
    { label: "Videos", value: stats.videos, icon: Video, color: "text-blue-500 bg-blue-500/10" },
    { label: "Shorts", value: stats.shorts, icon: Clapperboard, color: "text-pink-500 bg-pink-500/10" },
    { label: "Models", value: stats.models, icon: UserCircle, color: "text-purple-500 bg-purple-500/10" },
    { label: "Users", value: stats.users, icon: Users, color: "text-green-500 bg-green-500/10" },
    { label: "Revenue", value: `$${stats.revenue}`, icon: DollarSign, color: "text-amber-500 bg-amber-500/10" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Overview</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cards.map((card) => (
          <div key={card.label} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-zinc-500">{card.label}</span>
              <div className={`rounded-lg p-2 ${card.color}`}>
                <card.icon className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
