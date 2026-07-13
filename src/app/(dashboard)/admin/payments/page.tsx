"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/components/layout/auth-provider";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, CheckCircle, XCircle, Clock, ExternalLink, ImageIcon, X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Submission = {
  id: string;
  user_id: string;
  plan: string;
  amount: number;
  payment_method: string;
  receipt_data: string;
  status: string;
  created_at: string;
  reviewed_at: string | null;
  profiles?: { email?: string } | null;
};

export default function AdminPaymentsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const isAdmin = user?.email === "biniyammulat51@gmail.com";

  useEffect(() => {
    if (!user) return;
    if (!isAdmin) { router.replace("/dashboard"); return; }
    load();
  }, [user]);

  async function load() {
    setLoading(true);
    setError("");
    const { data, error: err } = await supabase
      .from("payment_submissions")
      .select("*, profiles(email)")
      .order("created_at", { ascending: false });
    if (err) { setError(err.message); } else { setSubmissions(data || []); }
    setLoading(false);
  }

  async function updateStatus(id: string, status: "approved" | "rejected") {
    setUpdating(id);
    const { error: err } = await supabase
      .from("payment_submissions")
      .update({ status, reviewed_by: user?.id, reviewed_at: new Date().toISOString() })
      .eq("id", id);
    if (err) { setError(err.message); } else { await load(); }
    setUpdating(null);
  }

  if (!user || !isAdmin) return null;

  if (loading) return (
    <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-gold" /></div>
  );

  if (error) return (
    <Card className="border-red-500/30 bg-red-500/5">
      <CardContent className="py-6 text-center">
        <p className="text-red-500 text-sm mb-2">{error}</p>
        <Button size="sm" variant="outline" onClick={load}>Retry</Button>
      </CardContent>
    </Card>
  );

  const pending = submissions.filter(s => s.status === "pending");
  const reviewed = submissions.filter(s => s.status !== "pending");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Payments</h1>
        <p className="text-sm text-muted-foreground">{pending.length} pending review</p>
      </div>

      {pending.length === 0 && reviewed.length === 0 && (
        <Card className="border-dashed border-zinc-700">
          <CardContent className="py-12 text-center"><p className="text-muted-foreground">No payment submissions yet.</p></CardContent>
        </Card>
      )}

      {pending.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-amber-500 flex items-center gap-2"><Clock className="h-4 w-4" /> Pending Review</h2>
          {pending.map((s) => (
            <Card key={s.id} className="border-amber-500/20 bg-amber-500/5">
              <CardContent className="py-4">
                <div className="flex flex-col md:flex-row gap-4">
                  {s.receipt_data && (
                    <div className="shrink-0 cursor-pointer" onClick={() => setPreview(s.receipt_data)}>
                      <img src={s.receipt_data} alt="Receipt" className="w-full md:w-32 h-24 object-cover rounded-lg border border-zinc-700 hover:border-gold/50 transition-colors" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0 space-y-1 text-sm">
                    <p><span className="text-muted-foreground">User:</span> {s.profiles?.email || s.user_id.slice(0, 8)}</p>
                    <p><span className="text-muted-foreground">Plan:</span> <span className="capitalize font-medium">{s.plan}</span></p>
                    <p><span className="text-muted-foreground">Amount:</span> ${s.amount.toFixed(2)}</p>
                    <p><span className="text-muted-foreground">Method:</span> <span className="capitalize">{s.payment_method}</span></p>
                    <p><span className="text-muted-foreground">Date:</span> {new Date(s.created_at).toLocaleString()}</p>
                  </div>
                  <div className="flex md:flex-col gap-2 shrink-0">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" disabled={updating === s.id} onClick={() => updateStatus(s.id, "approved")}>
                      {updating === s.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle className="h-3 w-3" />} Approve
                    </Button>
                    <Button size="sm" variant="outline" className="border-red-500/30 text-red-500 hover:bg-red-500/10" disabled={updating === s.id} onClick={() => updateStatus(s.id, "rejected")}>
                      <XCircle className="h-3 w-3" /> Flag Fraud
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {reviewed.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground">Reviewed</h2>
          {reviewed.map((s) => (
            <Card key={s.id} className="opacity-70">
              <CardContent className="py-3">
                <div className="flex items-center gap-3 text-sm">
                  {s.receipt_data && (
                    <img src={s.receipt_data} alt="" className="h-8 w-12 object-cover rounded cursor-pointer" onClick={() => setPreview(s.receipt_data)} />
                  )}
                  <span className={`shrink-0 flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${s.status === "approved" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                    {s.status === "approved" ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                    {s.status === "approved" ? "approved" : "fraud"}
                  </span>
                  <span className="text-muted-foreground capitalize">{s.plan}</span>
                  <span className="text-muted-foreground">${s.amount.toFixed(2)}</span>
                  <span className="text-muted-foreground">{s.profiles?.email || s.user_id.slice(0, 8)}</span>
                  <span className="text-muted-foreground text-xs">{new Date(s.created_at).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setPreview(null)}>
          <div className="relative max-h-[90vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
            <div className="absolute -top-3 right-0 flex gap-2">
              <a href={preview} download="receipt.png" className="rounded-full bg-zinc-900 border border-zinc-700 p-1.5 text-zinc-400 hover:text-white transition-colors">
                <Download className="h-4 w-4" />
              </a>
              <button onClick={() => setPreview(null)} className="rounded-full bg-zinc-900 border border-zinc-700 p-1.5 text-zinc-400 hover:text-white transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
            <img src={preview} alt="Receipt full size" className="max-h-[85vh] max-w-[85vw] rounded-lg object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
