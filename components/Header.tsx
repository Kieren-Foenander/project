"use client";

import { UtensilsCrossed } from "lucide-react";
import { ModeToggle } from "./ModeToggle";
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <UtensilsCrossed className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">Just Let Me Cook</span>
        </Link>
        <div className="flex items-center gap-4">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}