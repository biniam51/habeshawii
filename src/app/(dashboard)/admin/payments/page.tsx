"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/components/layout/auth-provider";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminPayments() {
  const { user } = useAuth();
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    if (user.email !== "biniyammulat51@gmail.com") { router.push("/"); return; }
    supabase.from("payment_submissions").select("*, profiles!user_id(email, full_name)").order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setSubmissions(data);
      setLoading(false);
    });
  }, [user]);

  async function review(id: string, status: "approved" | "rejected") {
    await supabase.from("payment_submissions").update({ status, reviewed_by: user!.id, reviewed_at: new Date().toISOString() }).eq("id", id);
    supabase.from("payment_submissions").select("*, profiles!user_id(email, full_name)").order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setSubmissions(data);
    });
  }

  if (loading) return <div className="flex items-center justify-center min-h-[50vh]"><Loader2 className="h-8 w-8 animate-spin text-amber-500" /></div>;

  const pending = submissions.filter((s: any) => s.status === "pending");
  const reviewed = submissions.filter((s: any) => s.status !== "pending");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Payment Submissions</h1>

      <h2 className="text-lg font-semibold mb-3 flex items-center gap-2"><Clock className="h-4 w-4 text-amber-500" /> Pending ({pending.length})</h2>
      {pending.length === 0 ? (
        <p className="text-sm text-zinc-500 mb-6">No pending submissions</p>
      ) : (
        <div className="space-y-3 mb-8">
          {pending.map((s: any) => (
            <div key={s.id} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 text-sm">
                  <p className="font-medium">{s.profiles?.full_name || s.profiles?.email || "Unknown"}</p>
                  <p className="text-zinc-500 capitalize">{s.plan} — ${Number(s.amount).toFixed(2)} via {s.payment_method}</p>
                  <p className="text-zinc-500">Ref: {s.transaction_ref}</p>
                  <p className="text-zinc-500 text-xs">{new Date(s.created_at).toLocaleString()}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button size="sm" onClick={() => review(s.id, "approved")} className="bg-green-600 hover:bg-green-700"><CheckCircle className="h-4 w-4 mr-1" /> Approve</Button>
                  <Button size="sm" variant="ghost" onClick={() => review(s.id, "rejected")} className="text-red-500"><XCircle className="h-4 w-4 mr-1" /> Reject</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {reviewed.length > 0 && (
        <>
          <h2 className="text-lg font-semibold mb-3">History ({reviewed.length})</h2>
          <div className="space-y-2">
            {reviewed.map((s: any) => (
              <div key={s.id} className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-3 text-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{s.profiles?.full_name || s.profiles?.email || "Unknown"}</p>
                    <p className="text-zinc-500 text-xs capitalize">{s.plan} — ${Number(s.amount).toFixed(2)} — {s.transaction_ref}</p>
                  </div>
                  <span className={`text-xs font-medium ${s.status === "approved" ? "text-green-500" : "text-red-500"}`}>
                    {s.status === "approved" ? "Approved" : "Rejected"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
