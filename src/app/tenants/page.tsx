import { Search } from "lucide-react";
import { getTenantsWithInfo } from "@/lib/queries";
import PageHeader from "@/components/PageHeader";
import TenantsPageClient from "@/components/TenantsPageClient";

export default async function TenantsPage() {
  const tenantsWithInfo = await getTenantsWithInfo();

  return (
    <>
      <PageHeader
        title="入居者管理"
        description={`${tenantsWithInfo.length}名の入居者`}
        action={<TenantsPageClient />}
      />

      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="名前・電話番号で検索..."
            className="input pl-9 text-[13px]"
          />
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left text-text-muted border-b border-border-light">
                <th className="px-5 py-2.5 font-medium">名前</th>
                <th className="px-5 py-2.5 font-medium">フリガナ</th>
                <th className="px-5 py-2.5 font-medium">電話番号</th>
                <th className="px-5 py-2.5 font-medium">メール</th>
                <th className="px-5 py-2.5 font-medium">勤務先</th>
                <th className="px-5 py-2.5 font-medium">物件・部屋</th>
                <th className="px-5 py-2.5 font-medium text-right">賃料</th>
              </tr>
            </thead>
            <tbody>
              {tenantsWithInfo.map((t: Record<string, any>) => (
                <tr key={t.id} className="border-b border-border-light last:border-0 hover:bg-bg-secondary/30 transition-colors cursor-pointer">
                  <td className="px-5 py-2.5 font-medium">{t.name}</td>
                  <td className="px-5 py-2.5 text-text-muted">{t.name_kana || "—"}</td>
                  <td className="px-5 py-2.5">{t.phone || "—"}</td>
                  <td className="px-5 py-2.5 text-text-muted">{t.email || "—"}</td>
                  <td className="px-5 py-2.5 text-text-muted">{t.workplace || "—"}</td>
                  <td className="px-5 py-2.5">
                    {t.contract?.unit ? (
                      <span>{t.contract.unit.property?.name} {t.contract.unit.unit_number}</span>
                    ) : (
                      <span className="text-text-muted">—</span>
                    )}
                  </td>
                  <td className="px-5 py-2.5 text-right font-medium tabular-nums">
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
