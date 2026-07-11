"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Crown, ArrowLeft, Construction, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "bronze";

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm text-center">
      <CardHeader>
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gold/10">
            <Construction className="h-8 w-8 text-gold" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold capitalize">
          {plan} Plan
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Payment system coming soon. You will be able to complete your
          membership purchase here.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-xl border border-gold/20 bg-gold/5 p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Payment methods:</p>
          <p>Telebirr &bull; CBE</p>
        </div>
        <Link href="/membership">
          <Button variant="outline" className="w-full gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Plans
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export default function CheckoutPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
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
