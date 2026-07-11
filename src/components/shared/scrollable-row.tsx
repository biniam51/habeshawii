"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ScrollableRowProps {
  children: React.ReactNode;
}

export function ScrollableRow({ children }: ScrollableRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const amount = direction === "left" ? -320 : 320;
      rowRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  return (
    <div className="group relative">
      <div
        ref={rowRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
      >
        {children}
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => scroll("left")}
        className="absolute -left-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm opacity-0 transition-opacity group-hover:opacity-100 md:flex"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => scroll("right")}
        className="absolute -right-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm opacity-0 transition-opacity group-hover:opacity-100 md:flex"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
}
