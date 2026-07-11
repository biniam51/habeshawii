import { createClient } from "@/lib/supabase-server";
import type { MembershipPlan } from "@/types";

export async function getMembershipPlans() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("membership_plans")
    .select("*")
    .order("price");
  return data || [];
}

export async function getUserMembership(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("user_memberships")
    .select("*, plan:membership_plans(*)")
    .eq("user_id", userId)
    .eq("status", "active")
    .maybeSingle();
  return data;
}

export async function checkMembershipAccess(
  userId: string,
  requiredPlan: MembershipPlan
): Promise<boolean> {
  if (requiredPlan === "free") return true;

  const membership = await getUserMembership(userId);
  if (!membership) return false;

  const planRank = { free: 0, bronze: 1, silver: 2, gold: 3 };
  const userRank = planRank[membership.plan_name as keyof typeof planRank] || 0;
  const requiredRank = planRank[requiredPlan];

  return userRank >= requiredRank;
}
