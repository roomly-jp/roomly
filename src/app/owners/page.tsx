import { Plus } from "lucide-react";
import { getOwners, getExpenses, getRemittances } from "@/lib/queries";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";

export default async function OwnersPage() {
  const [owners, expenses, remittances] = await Promise.all([getOwners(), getExpenses(), getRemittances()]);

  const ownerExpenses = expenses
    .filter((e: any) => e.is_owner_charge && e.owner_id)
    .reduce((acc: Record<string, number>, e: any) => {
      acc[e.owner_id] = (acc[e.owner_id] || 0) + Number(e.amount);
      return acc;
    }, {} as Record<string, number>);

  const propertyExpenses = expenses
    .filter((e: any) => e.is_owner_charge)
    .reduce((acc: Record<string, number>, e: any) => {
      if (e.property_id) {
        acc[e.property_id] = (acc[e.property_id] || 0) + Number(e.amount);
      }
      return acc;
    }, {} as Record<string, number>);

  const ownersWithInfo = owners.map((o: Record<string, any>) => {
    const ownerProps = o.properties || [];
    const ownerUnits = ownerProps.flatMap((p: any) => p.units || []);
    const occupiedUnits = ownerUnits.filter((u: any) => u.status === "occupied");
    const totalRent = occupiedUnits.reduce((s: number, u: any) => s + Number(u.rent), 0);
    const managementFee = Math.round(totalRent * (Number(o.management_fee_rate) / 100));
    const expenseDeducted = ownerExpenses[o.id] || 0;

    const propertyBreakdown = ownerProps.map((p: any) => {
      const pUnits = (p.units || []).filter((u: any) => u.status === "occupied");
      const pRent = pUnits.reduce((s: number, u: any) => s + Number(u.rent), 0);
      const pFee = Math.round(pRent * (Number(o.management_fee_rate) / 100));
      const pExpense = propertyExpenses[p.id] || 0;
      return {
        propertyId: p.id,
        propertyName: p.name,
        unitCount: (p.units || []).length,
        occupiedCount: pUnits.length,
        rent: pRent,
        fee: pFee,
        expense: pExpense,
        net: pRent - pFee - pExpense,
      };
    });

    return {
      ...o,
      propertyCount: ownerProps.length,
      unitCount: ownerUnits.length,
      occupiedCount: occupiedUnits.length,
      totalRent,
      managementFee,
      expenseDeducted,
      netAmount: totalRent - managementFee - expenseDeducted,
      propertyBreakdown,
    };
  });

  return (
    <>
      <PageHeader
        title="オーナー管理"
        description={`${owners.length}名のオーナー`}
        action={
          <button className="btn-primary">
            <Plus size={14} />
            オーナーを追加
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
        {ownersWithInfo.map((o: Record<string, any>) => (
          <div key={o.id} className="card card-interactive p-4 cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded bg-accent/10 flex items-center justify-center text-accent text-[13px] font-semibold">
                {o.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="text-[14px] font-semibold">{o.name}</h3>
                <span className="text-[11px] text-text-muted">手数料 {Number(o.management_fee_rate)}%</span>
              </div>
            </div>

            <div className="flex gap-2 text-center mb-4">
              <div className="flex-1 py-1.5 rounded bg-bg-secondary">
                <p className="text-[10px] text-text-muted">物件数</p>
                <p className="text-[15px] font-semibold tabular-nums">{o.propertyCount}</p>
              </div>
              <div className="flex-1 py-1.5 rounded bg-bg-secondary">
                <p className="text-[10px] text-text-muted">総戸数</p>
                <p className="text-[15px] font-semibold tabular-nums">{o.unitCount}</p>
              </div>
              <div className="flex-1 py-1.5 rounded bg-bg-secondary">
                <p className="text-[10px] text-text-muted">入居</p>
                <p className="text-[15px] font-semibold text-success tabular-nums">{o.occupiedCount}</p>
              </div>
            </div>

            <div className="border-t border-border-light pt-3 space-y-1.5 text-[13px]">
              <div className="flex justify-between">
                <span className="text-text-muted">家賃収入</span>
                <span className="font-medium tabular-nums">¥{o.totalRent.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">管理手数料</span>
                <span className="text-danger font-medium tabular-nums">-¥{o.managementFee.toLocaleString()}</span>
              </div>
              {o.expenseDeducted > 0 && (
                <div className="flex justify-between">
                  <span className="text-text-muted">経費控除</span>
                  <span className="text-warning font-medium tabular-nums">-¥{o.expenseDeducted.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-border-light">
                <span className="font-medium">送金額</span>
                <span className="font-semibold text-accent text-[15px] tabular-nums">¥{o.netAmount.toLocaleString()}</span>
              </div>
            </div>

            {(o.phone || o.email) && (
              <div className="mt-3 flex items-center gap-3 text-[11px] text-text-muted">
                {o.phone && <span>{o.phone}</span>}
                {o.email && <span>{o.email}</span>}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 月次送金明細 */}
      <div className="mt-8">
        <h2 className="text-[14px] font-semibold mb-3">月次送金明細（物件別内訳）</h2>
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="text-left text-text-muted border-b border-border-light">
                  <th className="px-5 py-2.5 font-medium">オーナー</th>
                  <th className="px-5 py-2.5 font-medium">物件</th>
                  <th className="px-5 py-2.5 font-medium text-center">入居/総戸</th>
                  <th className="px-5 py-2.5 font-medium text-right">家賃収入</th>
                  <th className="px-5 py-2.5 font-medium text-right">管理手数料</th>
                  <th className="px-5 py-2.5 font-medium text-right">経費控除</th>
                  <th className="px-5 py-2.5 font-medium text-right">送金額</th>
                </tr>
              </thead>
              <tbody>
                {ownersWithInfo.map((o: Record<string, any>) => (
                  <>
                    {o.propertyBreakdown.map(
                      (p: Record<string, any>, i: number) => (
                        <tr
                          key={`${o.id}-${p.propertyId}`}
                          className="border-b border-border-light hover:bg-bg-secondary/30 transition-colors"
                        >
                          {i === 0 && (
                            <td
                              className="px-5 py-2.5 font-medium"
                              rowSpan={o.propertyBreakdown.length + 1}
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded bg-accent/10 flex items-center justify-center text-accent text-[10px] font-semibold">
                                  {o.name.charAt(0)}
                                </div>
                                <div>
                                  <div>{o.name}</div>
                                  <div className="text-[10px] text-text-muted font-normal">
                                    手数料 {Number(o.management_fee_rate)}%
                                  </div>
                                </div>
                              </div>
                            </td>
                          )}
                          <td className="px-5 py-2.5 text-text-secondary">
                            {p.propertyName}
                          </td>
                          <td className="px-5 py-2.5 text-center tabular-nums">
                            {p.occupiedCount}/{p.unitCount}
                          </td>
                          <td className="px-5 py-2.5 text-right tabular-nums">
                            ¥{p.rent.toLocaleString()}
                          </td>
                          <td className="px-5 py-2.5 text-right text-danger tabular-nums">
                            -¥{p.fee.toLocaleString()}
                          </td>
                          <td className="px-5 py-2.5 text-right text-warning tabular-nums">
                            {p.expense > 0
                              ? `-¥${p.expense.toLocaleString()}`
                              : "—"}
                          </td>
                          <td className="px-5 py-2.5 text-right font-medium tabular-nums">
                            ¥{p.net.toLocaleString()}
                          </td>
                        </tr>
                      )
                    )}
                    <tr
                      key={`${o.id}-total`}
                      className="bg-bg-secondary/30 font-medium border-b border-border"
                    >
                      <td className="px-5 py-2 text-right text-text-muted text-[11px]" colSpan={2}>
                        合計
                      </td>
                      <td className="px-5 py-2 text-right tabular-nums">
                        ¥{o.totalRent.toLocaleString()}
                      </td>
                      <td className="px-5 py-2 text-right text-danger tabular-nums">
                        -¥{o.managementFee.toLocaleString()}
                      </td>
                      <td className="px-5 py-2 text-right text-warning tabular-nums">
                        {o.expenseDeducted > 0
                          ? `-¥${o.expenseDeducted.toLocaleString()}`
                          : "—"}
                      </td>
                      <td className="px-5 py-2 text-right text-accent tabular-nums">
                        ¥{o.netAmount.toLocaleString()}
                      </td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 送金履歴 */}
      {remittances.length > 0 && (
        <div className="mt-8">
          <h2 className="text-[14px] font-semibold mb-3">送金履歴</h2>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="text-left text-text-muted border-b border-border-light">
                    <th className="px-5 py-2.5 font-medium">対象月</th>
                    <th className="px-5 py-2.5 font-medium">オーナー</th>
                    <th className="px-5 py-2.5 font-medium text-right">家賃収入</th>
                    <th className="px-5 py-2.5 font-medium text-right">管理手数料</th>
                    <th className="px-5 py-2.5 font-medium text-right">経費控除</th>
                    <th className="px-5 py-2.5 font-medium text-right">送金額</th>
                    <th className="px-5 py-2.5 font-medium">状態</th>
                    <th className="px-5 py-2.5 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {remittances.map((r: Record<string, any>) => (
                    <tr key={r.id} className="border-b border-border-light last:border-0 hover:bg-bg-secondary/30 transition-colors">
                      <td className="px-5 py-2.5">{r.remittance_month?.slice(0, 7)}</td>
                      <td className="px-5 py-2.5 font-medium">{r.owner?.name ?? "—"}</td>
                      <td className="px-5 py-2.5 text-right tabular-nums">¥{Number(r.total_rent).toLocaleString()}</td>
                      <td className="px-5 py-2.5 text-right text-danger tabular-nums">-¥{Number(r.management_fee_deducted).toLocaleString()}</td>
                      <td className="px-5 py-2.5 text-right text-warning tabular-nums">
                        {Number(r.expense_deducted) > 0 ? `-¥${Number(r.expense_deducted).toLocaleString()}` : "—"}
                      </td>
                      <td className="px-5 py-2.5 text-right font-medium text-accent tabular-nums">¥{Number(r.net_amount).toLocaleString()}</td>
                      <td className="px-5 py-2.5"><StatusBadge status={r.status} /></td>
                      <td className="px-5 py-2.5">
                        <a
                          href={`/api/remittances/${r.id}/pdf`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-accent hover:underline"
                        >
                          PDF
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
