import { getRentBillings } from "@/lib/queries";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import { RentPaymentButton } from "@/components/RentPageClient";

export default async function RentPage() {
  const billings = await getRentBillings();

  const totalExpected = billings.reduce((s: number, b: any) => s + Number(b.total_amount), 0);
  const totalPaid = billings
    .filter((b: any) => b.status === "paid")
    .reduce((s: number, b: any) => s + Number(b.total_amount), 0);
  const overdueCount = billings.filter((b: any) => b.status === "overdue").length;
  const overdueAmount = billings
    .filter((b: any) => b.status === "overdue")
    .reduce((s: number, b: any) => s + Number(b.total_amount), 0);
  const collectionRate = totalExpected > 0 ? Math.round((totalPaid / totalExpected) * 100) : 0;

  return (
    <>
      <PageHeader title="家賃管理" description="家賃請求・入金状況" />

      {/* サマリー */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="card p-4">
          <p className="text-[11px] text-text-muted uppercase tracking-wider mb-2">請求総額</p>
          <p className="text-xl font-semibold tabular-nums">¥{totalExpected.toLocaleString()}</p>
        </div>
        <div className="card p-4">
          <p className="text-[11px] text-text-muted uppercase tracking-wider mb-2">入金済</p>
          <p className="text-xl font-semibold text-success tabular-nums">¥{totalPaid.toLocaleString()}</p>
        </div>
        <div className="card p-4">
          <p className="text-[11px] text-text-muted uppercase tracking-wider mb-2">回収率</p>
          <div className="flex items-end gap-2">
            <p className="text-xl font-semibold tabular-nums">{collectionRate}%</p>
            <div className="flex-1 h-1 bg-bg-secondary rounded-full overflow-hidden mb-1.5">
              <div
                className="h-full rounded-full bg-accent"
                style={{ width: `${collectionRate}%` }}
              />
            </div>
          </div>
        </div>
        <div className="card p-4 border-l-3 border-l-danger">
          <p className="text-[11px] text-text-muted uppercase tracking-wider mb-2">滞納</p>
          <p className="text-xl font-semibold text-danger tabular-nums">{overdueCount}件</p>
          <p className="text-[12px] text-danger mt-0.5 tabular-nums">¥{overdueAmount.toLocaleString()}</p>
        </div>
      </div>

      {/* フィルター */}
      <div className="flex gap-1.5 mb-4">
        {["すべて", "入金済", "未入金", "滞納"].map((label) => (
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
                <th className="px-5 py-2.5 font-medium">物件</th>
                <th className="px-5 py-2.5 font-medium">部屋</th>
                <th className="px-5 py-2.5 font-medium">入居者</th>
                <th className="px-5 py-2.5 font-medium">対象月</th>
                <th className="px-5 py-2.5 font-medium text-right">賃料</th>
                <th className="px-5 py-2.5 font-medium text-right">管理費</th>
                <th className="px-5 py-2.5 font-medium text-right">合計</th>
                <th className="px-5 py-2.5 font-medium">支払期限</th>
                <th className="px-5 py-2.5 font-medium">状態</th>
                <th className="px-5 py-2.5 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {billings.map((b: Record<string, any>) => (
                <tr
                  key={b.id}
                  className={`border-b border-border-light last:border-0 hover:bg-bg-secondary/30 transition-colors ${
                    b.status === "overdue" ? "bg-danger/5" : ""
                  }`}
                >
                  <td className="px-5 py-2.5 text-text-secondary">{b.contract?.unit?.property?.name || "—"}</td>
                  <td className="px-5 py-2.5">{b.contract?.unit?.unit_number || "—"}</td>
                  <td className="px-5 py-2.5 font-medium">{b.contract?.tenant?.name || "—"}</td>
                  <td className="px-5 py-2.5">{b.billing_month}</td>
                  <td className="px-5 py-2.5 text-right tabular-nums">¥{Number(b.rent).toLocaleString()}</td>
                  <td className="px-5 py-2.5 text-right tabular-nums">¥{Number(b.management_fee).toLocaleString()}</td>
                  <td className="px-5 py-2.5 text-right font-medium tabular-nums">¥{Number(b.total_amount).toLocaleString()}</td>
                  <td className="px-5 py-2.5">{b.due_date}</td>
                  <td className="px-5 py-2.5"><StatusBadge status={b.status} /></td>
                  <td className="px-5 py-2.5">
                    {b.status !== "paid" && (
                      <RentPaymentButton
                        billing={{
                          id: b.id,
                          total_amount: Number(b.total_amount),
                          paid_amount: b.status === "partial" ? Number(b.total_amount) * 0.5 : 0,
                          tenant_name: b.contract?.tenant?.name || "—",
                          unit_label: `${b.contract?.unit?.property?.name || ""} ${b.contract?.unit?.unit_number || ""}`,
                          billing_month: b.billing_month,
                        }}
                      />
                    )}
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
