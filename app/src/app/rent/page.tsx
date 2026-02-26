import { rentBillings, contracts, units, properties } from "@/lib/mock-data";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";

export default function RentPage() {
  const billingsWithInfo = rentBillings.map((b) => {
    const contract = contracts.find((c) => c.id === b.contract_id);
    const unit = contract ? units.find((u) => u.id === contract.unit_id) : undefined;
    const property = unit ? properties.find((p) => p.id === unit.property_id) : undefined;
    return { ...b, contract, unit, property };
  });

  const totalExpected = rentBillings.reduce((s, b) => s + b.total_amount, 0);
  const totalPaid = rentBillings
    .filter((b) => b.status === "paid")
    .reduce((s, b) => s + b.total_amount, 0);
  const overdueCount = rentBillings.filter((b) => b.status === "overdue").length;
  const overdueAmount = rentBillings
    .filter((b) => b.status === "overdue")
    .reduce((s, b) => s + b.total_amount, 0);

  return (
    <>
      <PageHeader title="家賃管理" description="2026年2月分" />

      {/* サマリー */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-xs text-text-muted mb-1">請求総額</p>
          <p className="text-xl font-bold">¥{totalExpected.toLocaleString()}</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-xs text-text-muted mb-1">入金済</p>
          <p className="text-xl font-bold text-success">¥{totalPaid.toLocaleString()}</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-xs text-text-muted mb-1">回収率</p>
          <p className="text-xl font-bold">{totalExpected > 0 ? Math.round((totalPaid / totalExpected) * 100) : 0}%</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-xs text-text-muted mb-1">滞納</p>
          <p className="text-xl font-bold text-danger">{overdueCount}件 / ¥{overdueAmount.toLocaleString()}</p>
        </div>
      </div>

      {/* フィルター */}
      <div className="flex gap-2 mb-4">
        {["すべて", "入金済", "未入金", "滞納"].map((label) => (
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
              <th className="px-5 py-3">物件</th>
              <th className="px-5 py-3">部屋</th>
              <th className="px-5 py-3">入居者</th>
              <th className="px-5 py-3">対象月</th>
              <th className="px-5 py-3 text-right">賃料</th>
              <th className="px-5 py-3 text-right">管理費</th>
              <th className="px-5 py-3 text-right">合計</th>
              <th className="px-5 py-3">支払期限</th>
              <th className="px-5 py-3">状態</th>
            </tr>
          </thead>
          <tbody>
            {billingsWithInfo.map((b) => (
              <tr
                key={b.id}
                className={`border-b border-border last:border-0 hover:bg-bg/50 cursor-pointer ${
                  b.status === "overdue" ? "bg-danger-bg/30" : ""
                }`}
              >
                <td className="px-5 py-3 text-text-secondary">{b.property?.name || "—"}</td>
                <td className="px-5 py-3">{b.unit?.unit_number || "—"}</td>
                <td className="px-5 py-3 font-medium">{b.contract?.tenant?.name || "—"}</td>
                <td className="px-5 py-3">{b.billing_month}</td>
                <td className="px-5 py-3 text-right">¥{b.rent.toLocaleString()}</td>
                <td className="px-5 py-3 text-right">¥{b.management_fee.toLocaleString()}</td>
                <td className="px-5 py-3 text-right font-medium">¥{b.total_amount.toLocaleString()}</td>
                <td className="px-5 py-3">{b.due_date}</td>
                <td className="px-5 py-3"><StatusBadge status={b.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
