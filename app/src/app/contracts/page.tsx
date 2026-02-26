import { Plus } from "lucide-react";
import { contracts, units, properties } from "@/lib/mock-data";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";

export default function ContractsPage() {
  const contractsWithInfo = contracts.map((c) => {
    const unit = units.find((u) => u.id === c.unit_id);
    const property = unit
      ? properties.find((p) => p.id === unit.property_id)
      : undefined;
    return { ...c, unit, property };
  });

  return (
    <>
      <PageHeader
        title="契約管理"
        description={`${contracts.length}件の契約`}
        action={
          <button className="flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent-light transition-colors">
            <Plus size={16} />
            新規契約
          </button>
        }
      />

      {/* フィルター */}
      <div className="flex gap-2 mb-4">
        {["すべて", "有効", "満了間近", "解約"].map((label) => (
          <button
            key={label}
            className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
              label === "すべて"
                ? "bg-accent text-white border-accent"
                : "bg-card text-text-secondary border-border hover:border-accent/30"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="bg-card rounded-lg border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-text-muted border-b border-border">
              <th className="px-5 py-3">入居者</th>
              <th className="px-5 py-3">物件・部屋</th>
              <th className="px-5 py-3">種別</th>
              <th className="px-5 py-3">契約開始</th>
              <th className="px-5 py-3">契約終了</th>
              <th className="px-5 py-3 text-right">賃料</th>
              <th className="px-5 py-3 text-right">管理費</th>
              <th className="px-5 py-3">状態</th>
            </tr>
          </thead>
          <tbody>
            {contractsWithInfo.map((c) => {
              // 満了間近判定
              const isExpiring = c.end_date
                ? (() => {
                    const diff =
                      (new Date(c.end_date).getTime() - Date.now()) /
                      (1000 * 60 * 60 * 24);
                    return diff > 0 && diff <= 90;
                  })()
                : false;

              return (
                <tr key={c.id} className="border-b border-border last:border-0 hover:bg-bg/50 cursor-pointer">
                  <td className="px-5 py-3 font-medium">{c.tenant?.name}</td>
                  <td className="px-5 py-3">
                    {c.property?.name} {c.unit?.unit_number}
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={c.contract_type} />
                  </td>
                  <td className="px-5 py-3">{c.start_date}</td>
                  <td className={`px-5 py-3 ${isExpiring ? "text-warning font-medium" : ""}`}>
                    {c.end_date || "—"}
                    {isExpiring && <span className="ml-1 text-xs">※間近</span>}
                  </td>
                  <td className="px-5 py-3 text-right">¥{c.rent.toLocaleString()}</td>
                  <td className="px-5 py-3 text-right">¥{c.management_fee.toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={c.status} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
