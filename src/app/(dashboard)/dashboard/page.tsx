"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/components/layout/auth-provider";
import { Crown, User, Calendar, Loader2 } from "lucide-react";

export default function UserDashboard() {
  const { user } = useAuth();
  const supabase = useMemo(() => createClient(), []);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("id", user.id).single().then(({ data }) => {
      if (data) setProfile(data);
      setLoading(false);
    });
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="rounded-lg bg-blue-500/10 p-2">
              <User className="h-4 w-4 text-blue-500" />
            </div>
            <span className="text-sm text-zinc-500">Account</span>
          </div>
          <p className="text-sm font-medium truncate">{user?.email}</p>
          <p className="text-xs text-zinc-500 mt-1">{profile?.full_name || "No name set"}</p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="rounded-lg bg-amber-500/10 p-2">
              <Crown className="h-4 w-4 text-amber-500" />
            </div>
            <span className="text-sm text-zinc-500">Membership</span>
          </div>
          <p className="text-lg font-bold capitalize">{profile?.membership || "Free"}</p>
          {profile?.membership_expires_at && (
            <p className="text-xs text-zinc-500 mt-1">Expires: {new Date(profile.membership_expires_at).toLocaleDateString()}</p>
          )}
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="rounded-lg bg-green-500/10 p-2">
              <Calendar className="h-4 w-4 text-green-500" />
            </div>
            <span className="text-sm text-zinc-500">Joined</span>
          </div>
          <p className="text-sm">{profile ? new Date(profile.created_at).toLocaleDateString() : "—"}</p>
        </div>
      </div>
    </div>
  );
}
