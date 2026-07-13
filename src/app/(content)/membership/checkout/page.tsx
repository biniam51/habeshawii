"use client";

import { Suspense, useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/components/layout/auth-provider";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, CheckCircle, Clock, Smartphone, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const prices: Record<string, number> = { bronze: 9.99, silver: 19.99, gold: 39.99 };

function CheckoutContent() {
  const sp = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const supabase = useMemo(() => createClient(), []);
  const plan = sp.get("plan") || "bronze";
  const price = prices[plan] || 9.99;

  const [method, setMethod] = useState<"telebirr" | "cbe">("telebirr");
  const [ref, setRef] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [existing, setExisting] = useState<any>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase.from("payment_submissions").select("*").eq("user_id", user.id).eq("status", "pending").maybeSingle().then(({ data }) => {
      if (data) setExisting(data);
      setChecking(false);
    });
  }, [user]);

  if (checking) return <Card className="border-border/50 bg-card/50 backdrop-blur-sm"><CardContent className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-gold" /></CardContent></Card>;

  if (existing) return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm text-center">
      <CardContent className="pt-8 pb-8 space-y-4">
        <div className="flex justify-center"><div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10"><Clock className="h-8 w-8 text-amber-500" /></div></div>
        <CardTitle className="text-2xl font-bold">Pending Review</CardTitle>
        <p className="text-sm text-muted-foreground">You already submitted payment for <strong className="capitalize">{existing.plan}</strong>. It is being reviewed.</p>
        <p className="text-xs text-zinc-500">Ref: {existing.transaction_ref} &middot; {new Date(existing.created_at).toLocaleString()}</p>
        <Button onClick={() => router.push("/membership")} variant="outline" className="gap-2"><ArrowLeft className="h-4 w-4" /> Back to Plans</Button>
      </CardContent>
    </Card>
  );

  if (done) return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm text-center">
      <CardContent className="pt-8 pb-8 space-y-4">
        <div className="flex justify-center"><div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10"><CheckCircle className="h-8 w-8 text-green-500" /></div></div>
        <CardTitle className="text-2xl font-bold">Submitted!</CardTitle>
        <p className="text-sm text-muted-foreground">Your payment will be reviewed within 24 hours.</p>
        <Button onClick={() => router.push("/membership")} variant="outline" className="gap-2"><ArrowLeft className="h-4 w-4" /> Back to Plans</Button>
      </CardContent>
    </Card>
  );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!ref.trim() || !user) return;
    setSending(true);
    setError("");
    const { error: err } = await supabase.from("payment_submissions").insert({
      user_id: user.id, plan, amount: price, payment_method: method, transaction_ref: ref.trim(),
    });
    if (err) { setError(err.message); setSending(false); return; }
    setDone(true);
    setSending(false);
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold capitalize text-center">{plan} Plan — ${price.toFixed(2)}</CardTitle>
        <p className="text-center text-muted-foreground text-sm">Complete your payment below</p>
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
            <label className="text-sm text-muted-foreground mb-1 block">Transaction Reference</label>
            <Input required value={ref} onChange={(e) => setRef(e.target.value)} placeholder="Enter the transaction ID from your payment" className="bg-zinc-800 border-zinc-700" />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <Button type="submit" disabled={!ref.trim() || sending} className="w-full bg-gold text-black hover:bg-gold-dark">
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : `Submit Payment — $${price.toFixed(2)}`}
          </Button>
        </form>

        <div className="text-center">
          <Button variant="ghost" size="sm" onClick={() => router.push("/membership")} className="gap-2 text-xs"><ArrowLeft className="h-3 w-3" /> Back to Plans</Button>
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
