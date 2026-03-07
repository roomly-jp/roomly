import { getMaintenanceRequests, getPropertiesForSelect } from "@/lib/queries";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import MaintenancePageClient from "@/components/MaintenancePageClient";

export default async function MaintenancePage() {
  const [maintenanceRequests, properties] = await Promise.all([
    getMaintenanceRequests(),
    getPropertiesForSelect(),
  ]);

  const sorted = [...maintenanceRequests].sort((a: any, b: any) => {
    const priorityOrder: Record<string, number> = { urgent: 0, high: 1, normal: 2, low: 3 };
    return (priorityOrder[a.priority] ?? 4) - (priorityOrder[b.priority] ?? 4);
  });

  return (
    <>
      <PageHeader
        title="修繕管理"
        description={`${maintenanceRequests.length}件の修繕依頼`}
        action={<MaintenancePageClient properties={properties} />}
      />

      <div className="flex gap-1.5 mb-4">
        {["すべて", "未対応", "対応中", "完了"].map((label) => (
          <button
            key={label}
            className={label === "すべて" ? "btn-primary" : "btn-secondary"}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left text-text-muted border-b border-border-light">
                <th className="px-5 py-2.5 font-medium">件名</th>
                <th className="px-5 py-2.5 font-medium">物件</th>
                <th className="px-5 py-2.5 font-medium">部屋</th>
                <th className="px-5 py-2.5 font-medium">カテゴリ</th>
                <th className="px-5 py-2.5 font-medium">優先度</th>
                <th className="px-5 py-2.5 font-medium">状態</th>
                <th className="px-5 py-2.5 font-medium">報告日</th>
                <th className="px-5 py-2.5 font-medium">業者</th>
                <th className="px-5 py-2.5 font-medium text-right">見積</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((m: Record<string, any>) => {
                const categoryLabels: Record<string, string> = {
                  plumbing: "水回り",
                  electrical: "電気",
                  structural: "構造",
                  equipment: "設備",
                  other: "その他",
                };
                return (
                  <tr
                    key={m.id}
                    className={`border-b border-border-light last:border-0 hover:bg-bg-secondary/30 transition-colors cursor-pointer ${
                      m.priority === "urgent" ? "bg-danger/5" : ""
                    }`}
                  >
                    <td className="px-5 py-2.5 font-medium">{m.title}</td>
                    <td className="px-5 py-2.5 text-text-secondary">{m.property?.name}</td>
                    <td className="px-5 py-2.5">{m.unit?.unit_number || "共用部"}</td>
                    <td className="px-5 py-2.5 text-text-secondary">{categoryLabels[m.category] || m.category}</td>
                    <td className="px-5 py-2.5"><StatusBadge status={m.priority} /></td>
                    <td className="px-5 py-2.5"><StatusBadge status={m.status} /></td>
                    <td className="px-5 py-2.5">{m.reported_date}</td>
                    <td className="px-5 py-2.5 text-text-secondary">{m.vendor_name || "—"}</td>
                    <td className="px-5 py-2.5 text-right tabular-nums">
                      {m.estimated_cost ? `¥${Number(m.estimated_cost).toLocaleString()}` : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
