import { getContracts, getUnitsForSelect, getTenantsForSelect } from "@/lib/queries";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import ContractsPageClient from "@/components/ContractsPageClient";

export default async function ContractsPage() {
  const [contracts, units, tenants] = await Promise.all([
    getContracts(),
    getUnitsForSelect(),
    getTenantsForSelect(),
  ]);

  return (
    <>
      <PageHeader
        title="契約管理"
        description={`${contracts.length}件の契約`}
        action={<ContractsPageClient units={units} tenants={tenants} />}
      />

      <div className="flex gap-1.5 mb-4">
        {["すべて", "有効", "満了間近", "解約"].map((label) => (
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
                <th className="px-5 py-2.5 font-medium">入居者</th>
                <th className="px-5 py-2.5 font-medium">物件・部屋</th>
                <th className="px-5 py-2.5 font-medium">種別</th>
                <th className="px-5 py-2.5 font-medium">契約開始</th>
                <th className="px-5 py-2.5 font-medium">契約終了</th>
                <th className="px-5 py-2.5 font-medium text-right">賃料</th>
                <th className="px-5 py-2.5 font-medium text-right">管理費</th>
                <th className="px-5 py-2.5 font-medium">状態</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((c: Record<string, any>) => {
                const remainingDays = c.end_date
                  ? Math.ceil(
                      (new Date(c.end_date).getTime() - Date.now()) /
                      (1000 * 60 * 60 * 24)
                    )
                  : null;
                const isExpiring = remainingDays !== null && remainingDays > 0 && remainingDays <= 90;
                const urgencyColor = remainingDays !== null && remainingDays > 0
                  ? remainingDays <= 30
                    ? "text-danger"
                    : remainingDays <= 60
                      ? "text-warning"
                      : remainingDays <= 90
                        ? "text-warning/70"
                        : ""
                  : "";

                return (
                  <tr key={c.id} className={`border-b border-border-light last:border-0 hover:bg-bg-secondary/30 transition-colors cursor-pointer ${remainingDays !== null && remainingDays <= 30 && remainingDays > 0 ? "bg-danger/5" : ""}`}>
                    <td className="px-5 py-2.5 font-medium">{c.tenant?.name}</td>
                    <td className="px-5 py-2.5">
                      {c.unit?.property?.name} {c.unit?.unit_number}
                    </td>
                    <td className="px-5 py-2.5">
                      <StatusBadge status={c.contract_type} />
                    </td>
                    <td className="px-5 py-2.5">{c.start_date}</td>
                    <td className={`px-5 py-2.5 ${isExpiring ? "font-medium" : ""}`}>
                      <div>{c.end_date || "—"}</div>
                      {isExpiring && (
                        <span className={`text-[11px] font-medium ${urgencyColor}`}>
                          あと{remainingDays}日
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-2.5 text-right tabular-nums">¥{Number(c.rent).toLocaleString()}</td>
                    <td className="px-5 py-2.5 text-right tabular-nums">¥{Number(c.management_fee).toLocaleString()}</td>
                    <td className="px-5 py-2.5">
                      <StatusBadge status={c.status} />
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
