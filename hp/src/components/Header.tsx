"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { label: "機能", href: "/#features" },
  { label: "料金", href: "/#pricing" },
  { label: "コラム", href: "/column" },
  { label: "お問い合わせ", href: "/#contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-rm-border bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="text-lg font-semibold tracking-tight text-rm-primary">
          Roomly
        </Link>

        <nav className="hidden items-center gap-7 text-[13px] sm:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-rm-text-secondary transition-colors hover:text-rm-primary"
            >
              {item.label}
            </Link>
          ))}
          <a
            href="https://roomly.jp"
            className="rounded bg-rm-accent px-5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-rm-accent-light"
          >
            ログイン
          </a>
        </nav>

        <button
          className="sm:hidden text-rm-text-secondary"
          onClick={() => setOpen(!open)}
          aria-label="メニュー"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-rm-border bg-white px-4 pb-4 sm:hidden">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-sm text-rm-text-secondary transition-colors hover:text-rm-primary"
            >
              {item.label}
            </Link>
          ))}
          <a
            href="https://roomly.jp"
            className="mt-2 block rounded bg-rm-accent py-2.5 text-center text-sm font-medium text-white"
          >
            ログイン
          </a>
        </nav>
      )}
    </header>
  );
}
