"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  href?: string;
}

export function SectionHeader({ title, href }: SectionHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <h2 className="text-xl font-bold sm:text-2xl">{title}</h2>
      {href && (
        <Link
          href={href}
          className="flex items-center gap-1 text-sm font-medium text-gold transition-colors hover:text-gold-dark"
        >
          See all
          <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
