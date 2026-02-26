"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Users,
  FileText,
  Banknote,
  Wrench,
  MessageSquare,
  UserCircle,
  Settings,
} from "lucide-react";

const navItems = [
  { href: "/", label: "ダッシュボード", icon: LayoutDashboard },
  { href: "/properties", label: "物件管理", icon: Building2 },
  { href: "/tenants", label: "入居者管理", icon: Users },
  { href: "/contracts", label: "契約管理", icon: FileText },
  { href: "/rent", label: "家賃管理", icon: Banknote },
  { href: "/maintenance", label: "修繕管理", icon: Wrench },
  { href: "/inquiries", label: "問い合わせ", icon: MessageSquare },
  { href: "/owners", label: "オーナー管理", icon: UserCircle },
  { href: "/settings", label: "設定", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-[240px] bg-primary text-white flex flex-col z-50">
      {/* ロゴ */}
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <span className="text-xl font-bold tracking-wide">Estate</span>
        <span className="ml-2 text-xs bg-accent px-2 py-0.5 rounded">仮称</span>
      </div>

      {/* ナビゲーション */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                isActive
                  ? "bg-white/15 text-white font-medium"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* フッター */}
      <div className="px-6 py-4 border-t border-white/10 text-xs text-white/50">
        管理会社名（仮）
      </div>
    </aside>
  );
}
