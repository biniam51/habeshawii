"use client";

import { Suspense, useState, useMemo, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { useAuth } from "@/components/layout/auth-provider";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, CheckCircle, Smartphone, Building2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const planPrices: Record<string, number> = { bronze: 9.99, silver: 19.99, gold: 39.99 };
const planFeatures: Record<string, string[]> = {
  bronze: ["Premium Videos", "Premium Shorts", "HD Streaming"],
  silver: ["Everything in Bronze", "Model Profiles", "Premium Galleries", "Model Chat"],
  gold: ["Everything in Silver", "VIP Videos", "VIP Shorts", "VIP Galleries", "Exclusive Content"],
};

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const supabase = useMemo(() => createClient(), []);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const plan = searchParams.get("plan") || "bronze";
  const price = planPrices[plan] || 9.99;

  const [method, setMethod] = useState<"telebirr" | "cbe">("telebirr");
  const [file, setFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) { router.push("/login"); return; }
    setSending(true);
    setError("");

    try {
      let receiptUrl: string | null = null;

      if (file) {
        const ext = file.name.split(".").pop();
        const path = `${user.id}/${Date.now()}.${ext}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("receipts")
          .upload(path, file);

        if (uploadError) throw new Error(uploadError.message);

        const { data: urlData } = supabase.storage
          .from("receipts")
          .getPublicUrl(path);

        receiptUrl = urlData?.publicUrl || null;
      }

      const { error: insertError } = await supabase.from("payment_submissions").insert({
        user_id: user.id,
        plan,
        amount: price,
        payment_method: method,
        receipt_url: receiptUrl,
      });

      if (insertError) throw new Error(insertError.message);

      setDone(true);
    } catch (e: any) {
      setError(e.message);
    }
    setSending(false);
  }

  if (done) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm text-center">
        <CardContent className="pt-8 pb-8 space-y-4">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Submission Sent!</CardTitle>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Your payment will be reviewed by the team within 24 hours. You will be notified once approved.
          </p>
          <Button onClick={() => router.push("/membership")} variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Plans
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold capitalize text-center">{plan} Plan</CardTitle>
        <p className="text-center text-muted-foreground text-sm">
          Complete your payment to unlock {plan} membership
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-xl border border-gold/20 bg-gold/5 p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Plan</span>
            <span className="text-lg font-bold text-gold">${price.toFixed(2)}</span>
          </div>
          <ul className="space-y-1">
            {(planFeatures[plan] || []).map((f) => (
              <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle className="h-3 w-3 text-green-500" /> {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 space-y-3">
          <h3 className="text-sm font-semibold">Payment Instructions</h3>
          <p className="text-xs text-muted-foreground">Send the exact amount to one of the following accounts:</p>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-zinc-800/50">
              <Smartphone className="h-4 w-4 text-green-500" />
              <div>
                <p className="font-medium">Telebirr</p>
                <p className="text-muted-foreground">+251 9X XXX XXXX</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-zinc-800/50">
              <Building2 className="h-4 w-4 text-blue-500" />
              <div>
                <p className="font-medium">CBE (Commercial Bank of Ethiopia)</p>
                <p className="text-muted-foreground">Account: XXXXXXXXXX</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Payment Method</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMethod("telebirr")}
                className={`flex-1 p-3 rounded-xl border text-sm font-medium transition-colors ${
                  method === "telebirr"
                    ? "border-gold bg-gold/10 text-gold"
                    : "border-zinc-800 text-muted-foreground hover:border-zinc-600"
                }`}
              >
                Telebirr
              </button>
              <button
                type="button"
                onClick={() => setMethod("cbe")}
                className={`flex-1 p-3 rounded-xl border text-sm font-medium transition-colors ${
                  method === "cbe"
                    ? "border-gold bg-gold/10 text-gold"
                    : "border-zinc-800 text-muted-foreground hover:border-zinc-600"
                }`}
              >
                CBE
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Screenshot (receipt)</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-zinc-700 rounded-xl p-6 text-center cursor-pointer hover:border-amber-500/50 transition-colors"
            >
              {file ? (
                <div className="space-y-2">
                  <img src={URL.createObjectURL(file)} alt="Receipt preview" className="max-h-40 mx-auto rounded-lg" />
                  <p className="text-xs text-zinc-500">{file.name}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-8 w-8 mx-auto text-zinc-500" />
                  <p className="text-sm text-zinc-500">Tap to upload screenshot</p>
                  <p className="text-xs text-zinc-600">PNG, JPG or WEBP</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </div>
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <Button type="submit" disabled={sending} className="w-full bg-gold text-black hover:bg-gold-dark">
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : `Submit Payment — $${price.toFixed(2)}`}
          </Button>
        </form>

        <div className="text-center">
          <Button variant="ghost" size="sm" onClick={() => router.push("/membership")} className="gap-2 text-xs">
            <ArrowLeft className="h-3 w-3" /> Back to Plans
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CheckoutPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Suspense
          fallback={
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Loading...</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-gold" />
              </CardContent>
            </Card>
          }
        >
          <CheckoutContent />
        </Suspense>
      </motion.div>
    </div>
  );
}
