import { Plus, Search } from "lucide-react";
import { getTenantsWithInfo } from "@/lib/queries";
import PageHeader from "@/components/PageHeader";

export default async function TenantsPage() {
  const tenantsWithInfo = await getTenantsWithInfo();

  return (
    <>
      <PageHeader
        title="入居者管理"
        description={`${tenantsWithInfo.length}名の入居者`}
        action={
          <button className="btn-primary">
            <Plus size={16} />
            入居者を追加
          </button>
        }
      />

      {/* 検索バー */}
      <div className="mb-5">
        <div className="relative max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="名前・電話番号で検索..."
            className="input pl-10"
          />
        </div>
      </div>

      {/* テーブル */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-text-muted bg-bg-secondary/50">
                <th className="px-5 py-3 font-medium">名前</th>
                <th className="px-5 py-3 font-medium">フリガナ</th>
                <th className="px-5 py-3 font-medium">電話番号</th>
                <th className="px-5 py-3 font-medium">メール</th>
                <th className="px-5 py-3 font-medium">勤務先</th>
                <th className="px-5 py-3 font-medium">物件・部屋</th>
                <th className="px-5 py-3 font-medium text-right">賃料</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {tenantsWithInfo.map((t: Record<string, any>) => (
                <tr key={t.id} className="hover:bg-bg-secondary/30 transition-colors cursor-pointer">
                  <td className="px-5 py-3 font-medium">{t.name}</td>
                  <td className="px-5 py-3 text-text-muted">{t.name_kana || "—"}</td>
                  <td className="px-5 py-3">{t.phone || "—"}</td>
                  <td className="px-5 py-3 text-text-muted">{t.email || "—"}</td>
                  <td className="px-5 py-3 text-text-muted">{t.workplace || "—"}</td>
                  <td className="px-5 py-3">
                    {t.contract?.unit ? (
                      <span>{t.contract.unit.property?.name} {t.contract.unit.unit_number}</span>
                    ) : (
                      <span className="text-text-muted">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-right font-medium">
                    {t.contract ? `¥${Number(t.contract.rent).toLocaleString()}` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
