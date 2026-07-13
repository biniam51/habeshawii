"use client";

import { Suspense, useState, useMemo, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/components/layout/auth-provider";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, CheckCircle, Clock, XCircle, Smartphone, Building2, Upload, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const prices: Record<string, number> = { bronze: 9.99, silver: 19.99, gold: 39.99 };

function CheckoutContent() {
  const sp = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const supabase = useMemo(() => createClient(), []);
  const fileRef = useRef<HTMLInputElement>(null);
  const plan = sp.get("plan") || "bronze";
  const price = prices[plan] || 9.99;

  const [method, setMethod] = useState<"telebirr" | "cbe">("telebirr");
  const [image, setImage] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [sub, setSub] = useState<any>(null);
  const [checking, setChecking] = useState(true);
  const [membership, setMembership] = useState<any>(null);

  async function fetchData() {
    if (!user) return;
    const { data: payData } = await supabase
      .from("payment_submissions")
      .select("*")
      .eq("user_id", user.id)
      .eq("plan", plan)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    setSub(payData || null);

    if (payData?.status === "approved") {
      const { data: memData } = await supabase
        .from("user_memberships")
        .select("expires_at")
        .eq("user_id", user.id)
        .eq("plan_name", payData.plan)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      setMembership(memData || null);
    }
    setChecking(false);
  }

  useEffect(() => {
    if (!user) return;
    fetchData();

    const channel = supabase
      .channel("payment-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "payment_submissions", filter: `user_id=eq.${user.id}` }, () => {
        fetchData();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, plan]);

  function daysRemaining(expiresAt: string | null) {
    if (!expiresAt) return null;
    const diff = new Date(expiresAt).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  if (checking) return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardContent className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-gold" /></CardContent>
    </Card>
  );

  if (sub?.status === "approved") {
    const days = daysRemaining(membership?.expires_at);
    return (
      <Card className="border-green-500/30 bg-green-500/5 text-center">
        <CardContent className="pt-8 pb-8 space-y-4">
          <div className="flex justify-center"><div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10"><CheckCircle className="h-8 w-8 text-green-500" /></div></div>
          <CardTitle className="text-2xl font-bold text-green-500">Approved!</CardTitle>
          <p className="text-sm text-muted-foreground">Your <strong className="capitalize">{sub.plan}</strong> membership is active.</p>
          {days !== null && <p className="text-3xl font-bold text-gold">{days} <span className="text-sm font-normal text-muted-foreground">days remaining</span></p>}
          {sub.receipt_data && <img src={sub.receipt_data} alt="Receipt" className="max-h-24 mx-auto rounded-lg border border-zinc-700 opacity-60" />}
          <Button onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
        </CardContent>
      </Card>
    );
  }

  if (sub?.status === "rejected") {
    return (
      <Card className="border-red-500/30 bg-red-500/5 text-center">
        <CardContent className="pt-8 pb-8 space-y-4">
          <div className="flex justify-center"><div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10"><XCircle className="h-8 w-8 text-red-500" /></div></div>
          <CardTitle className="text-2xl font-bold text-red-500">Flagged as Fraud</CardTitle>
          <p className="text-sm text-muted-foreground">Your payment submission was flagged as potential fraud. Please upload a valid receipt screenshot to proceed.</p>
          {sub.receipt_data && <img src={sub.receipt_data} alt="Rejected receipt" className="max-h-24 mx-auto rounded-lg border border-zinc-700 opacity-50" />}
          <Button onClick={async () => {
            await supabase.from("payment_submissions").delete().eq("id", sub.id);
            setSub(null);
            setImage(null);
          }} variant="outline" className="gap-2"><RefreshCw className="h-4 w-4" /> Try Again</Button>
        </CardContent>
      </Card>
    );
  }

  if (sub?.status === "pending") return (
    <Card className="border-amber-500/20 bg-amber-500/5 text-center">
      <CardContent className="pt-8 pb-8 space-y-4">
        <div className="flex justify-center"><div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10"><Clock className="h-8 w-8 text-amber-500" /></div></div>
        <CardTitle className="text-2xl font-bold">Pending Review</CardTitle>
        <p className="text-sm text-muted-foreground">Your <strong className="capitalize">{sub.plan}</strong> payment is being reviewed.</p>
        {sub.receipt_data && <img src={sub.receipt_data} alt="Receipt" className="max-h-32 mx-auto rounded-lg border border-zinc-700" />}
        <p className="text-xs text-zinc-500">{new Date(sub.created_at).toLocaleString()}</p>
        <Button onClick={() => router.push("/membership")} variant="outline"><ArrowLeft className="h-4 w-4 mr-2" /> Back</Button>
      </CardContent>
    </Card>
  );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!image || !user) return;
    setSending(true);
    setError("");
    const { error: err } = await supabase.from("payment_submissions").insert({
      user_id: user.id, plan, amount: price, payment_method: method, receipt_data: image,
    });
    if (err) { setError(err.message); setSending(false); return; }
    await fetchData();
    setSending(false);
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold capitalize text-center">{plan} Plan — ${price.toFixed(2)}</CardTitle>
        <p className="text-center text-muted-foreground text-sm">Send payment then upload your receipt screenshot</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 space-y-3">
          <h3 className="text-sm font-semibold">Send payment to</h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-zinc-800/50">
              <Smartphone className="h-4 w-4 text-green-500" />
              <div><p className="font-medium">Telebirr</p><p className="text-muted-foreground">+251 9X XXX XXXX</p></div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-zinc-800/50">
              <Building2 className="h-4 w-4 text-blue-500" />
              <div><p className="font-medium">CBE</p><p className="text-muted-foreground">Account: XXXXXXXXXX</p></div>
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Payment Method</label>
            <div className="flex gap-2">
              {(["telebirr", "cbe"] as const).map((m) => (
                <button key={m} type="button" onClick={() => setMethod(m)}
                  className={`flex-1 p-3 rounded-xl border text-sm font-medium capitalize transition-colors ${method === m ? "border-gold bg-gold/10 text-gold" : "border-zinc-800 text-muted-foreground hover:border-zinc-600"}`}
                >{m === "telebirr" ? "Telebirr" : "CBE"}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Upload Receipt Screenshot</label>
            <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-zinc-700 rounded-xl p-6 text-center cursor-pointer hover:border-amber-500/50 transition-colors">
              {image ? (
                <div className="space-y-2">
                  <img src={image} alt="Receipt" className="max-h-40 mx-auto rounded-lg" />
                  <p className="text-xs text-zinc-500">Tap to change</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-8 w-8 mx-auto text-zinc-500" />
                  <p className="text-sm text-zinc-500">Tap to upload screenshot</p>
                  <p className="text-xs text-zinc-600">PNG, JPG or WEBP</p>
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
                const f = e.target.files?.[0]; if (!f) return;
                const r = new FileReader();
                r.onload = (ev) => setImage(ev.target?.result as string);
                r.readAsDataURL(f);
              }} />
            </div>
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <Button type="submit" disabled={!image || sending} className="w-full bg-gold text-black hover:bg-gold-dark">
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : `Submit Payment — $${price.toFixed(2)}`}
          </Button>
        </form>

        <div className="text-center">
          <Button variant="ghost" size="sm" onClick={() => router.push("/membership")}><ArrowLeft className="h-3 w-3 mr-1" /> Back</Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CheckoutPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Suspense fallback={<Card className="border-border/50 bg-card/50 backdrop-blur-sm"><CardContent className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-gold" /></CardContent></Card>}>
          <CheckoutContent />
        </Suspense>
      </motion.div>
    </div>
  );
}
