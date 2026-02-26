import { Plus, Search } from "lucide-react";
import { tenants, contracts, units, properties } from "@/lib/mock-data";
import PageHeader from "@/components/PageHeader";

export default function TenantsPage() {
  // 入居者に紐づく契約・部屋情報を構築
  const tenantsWithInfo = tenants.map((t) => {
    const contract = contracts.find(
      (c) => c.tenant_id === t.id && c.status === "active"
    );
    const unit = contract
      ? units.find((u) => u.id === contract.unit_id)
      : undefined;
    const property = unit
      ? properties.find((p) => p.id === unit.property_id)
      : undefined;
    return { ...t, contract, unit, property };
  });

  return (
    <>
      <PageHeader
        title="入居者管理"
        description={`${tenants.length}名の入居者`}
        action={
          <button className="flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent-light transition-colors">
            <Plus size={16} />
            入居者を追加
          </button>
        }
      />

      {/* 検索バー */}
      <div className="mb-4">
        <div className="relative max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="名前・電話番号で検索..."
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg text-sm bg-card focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      {/* テーブル */}
      <div className="bg-card rounded-lg border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-text-muted border-b border-border">
              <th className="px-5 py-3">名前</th>
              <th className="px-5 py-3">フリガナ</th>
              <th className="px-5 py-3">電話番号</th>
              <th className="px-5 py-3">メール</th>
              <th className="px-5 py-3">勤務先</th>
              <th className="px-5 py-3">物件・部屋</th>
              <th className="px-5 py-3 text-right">賃料</th>
            </tr>
          </thead>
          <tbody>
            {tenantsWithInfo.map((t) => (
              <tr key={t.id} className="border-b border-border last:border-0 hover:bg-bg/50 cursor-pointer">
                <td className="px-5 py-3 font-medium">{t.name}</td>
                <td className="px-5 py-3 text-text-secondary">{t.name_kana || "—"}</td>
                <td className="px-5 py-3">{t.phone || "—"}</td>
                <td className="px-5 py-3 text-text-secondary">{t.email || "—"}</td>
                <td className="px-5 py-3 text-text-secondary">{t.workplace || "—"}</td>
                <td className="px-5 py-3">
                  {t.property && t.unit ? (
                    <span>{t.property.name} {t.unit.unit_number}</span>
                  ) : (
                    <span className="text-text-muted">—</span>
                  )}
                </td>
                <td className="px-5 py-3 text-right font-medium">
                  {t.contract ? `¥${t.contract.rent.toLocaleString()}` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
