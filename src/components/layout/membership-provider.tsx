"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/components/layout/auth-provider";
import type { MembershipPlan } from "@/types";

interface MembershipContextType {
  plan: MembershipPlan;
  loading: boolean;
  isActive: boolean;
  expiresAt: string | null;
  canAccess: (requiredPlan: MembershipPlan) => boolean;
}

const MembershipContext = createContext<MembershipContextType>({
  plan: "free",
  loading: true,
  isActive: false,
  expiresAt: null,
  canAccess: () => false,
});

const planRank: Record<MembershipPlan, number> = {
  free: 0,
  bronze: 1,
  silver: 2,
  gold: 3,
};

export function MembershipProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const supabase = createClient();
  const [plan, setPlan] = useState<MembershipPlan>("free");
  const [loading, setLoading] = useState(true);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setPlan("free");
      setLoading(false);
      return;
    }

    const fetchMembership = async () => {
      const { data } = await supabase
        .from("user_memberships")
        .select("plan_name, expires_at")
        .eq("user_id", user.id)
        .eq("status", "active")
        .maybeSingle();

      if (data) {
        const isExpired = data.expires_at
          ? new Date(data.expires_at) < new Date()
          : false;
        setPlan(isExpired ? "free" : (data.plan_name as MembershipPlan));
        setExpiresAt(isExpired ? null : data.expires_at);
      } else {
        setPlan("free");
        setExpiresAt(null);
      }
      setLoading(false);
    };

    fetchMembership();

    const channel = supabase
      .channel("membership-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_memberships",
          filter: `user_id=eq.${user.id}`,
        },
        fetchMembership
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, supabase]);

  const canAccess = (requiredPlan: MembershipPlan) => {
    if (requiredPlan === "free") return true;
    const userRank = planRank[plan] || 0;
    const requiredRank = planRank[requiredPlan] || 0;
    return userRank >= requiredRank;
  };

  return (
    <MembershipContext.Provider
      value={{
        plan,
        loading,
        isActive: plan !== "free",
        expiresAt,
        canAccess,
      }}
    >
      {children}
    </MembershipContext.Provider>
  );
}

export function useMembership() {
  return useContext(MembershipContext);
}
