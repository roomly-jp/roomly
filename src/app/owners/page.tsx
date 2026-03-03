import { Plus } from "lucide-react";
import { getOwners, getExpenses } from "@/lib/queries";
import PageHeader from "@/components/PageHeader";

export default async function OwnersPage() {
  const [owners, expenses] = await Promise.all([getOwners(), getExpenses()]);

  // オーナー負担経費をオーナーIDでグルーピング
  const ownerExpenses = expenses
    .filter((e: any) => e.is_owner_charge && e.owner_id)
    .reduce((acc: Record<string, number>, e: any) => {
      acc[e.owner_id] = (acc[e.owner_id] || 0) + Number(e.amount);
      return acc;
    }, {} as Record<string, number>);

  // 物件ごとの経費もグルーピング
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

    // 物件別の内訳を生成
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
            <Plus size={16} />
            オーナーを追加
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        {ownersWithInfo.map((o: Record<string, any>) => (
          <div key={o.id} className="card card-interactive p-5 cursor-pointer">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full gradient-accent flex items-center justify-center text-white font-semibold">
                {o.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{o.name}</h3>
                <span className="text-xs text-text-muted">手数料 {Number(o.management_fee_rate)}%</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center mb-5">
              <div className="p-2.5 rounded-lg bg-bg-secondary">
                <p className="text-[11px] text-text-muted">物件数</p>
                <p className="text-lg font-bold">{o.propertyCount}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-bg-secondary">
                <p className="text-[11px] text-text-muted">総戸数</p>
                <p className="text-lg font-bold">{o.unitCount}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-bg-secondary">
                <p className="text-[11px] text-text-muted">入居</p>
                <p className="text-lg font-bold text-success">{o.occupiedCount}</p>
              </div>
            </div>

            <div className="border-t border-border-light pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-muted">家賃収入</span>
                <span className="font-medium">¥{o.totalRent.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">管理手数料</span>
                <span className="text-danger font-medium">-¥{o.managementFee.toLocaleString()}</span>
              </div>
              {o.expenseDeducted > 0 && (
                <div className="flex justify-between">
                  <span className="text-text-muted">経費控除</span>
                  <span className="text-warning font-medium">-¥{o.expenseDeducted.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-border-light">
                <span className="font-medium">送金額</span>
                <span className="font-bold text-accent text-lg">¥{o.netAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3 text-xs text-text-muted">
              {o.phone && <span>{o.phone}</span>}
              {o.email && <span>{o.email}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* 月次送金明細 */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">月次送金明細（物件別内訳）</h2>
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-text-muted bg-bg-secondary/50">
                  <th className="px-5 py-3 font-medium">オーナー</th>
                  <th className="px-5 py-3 font-medium">物件</th>
                  <th className="px-5 py-3 font-medium text-center">入居/総戸</th>
                  <th className="px-5 py-3 font-medium text-right">家賃収入</th>
                  <th className="px-5 py-3 font-medium text-right">管理手数料</th>
                  <th className="px-5 py-3 font-medium text-right">経費控除</th>
                  <th className="px-5 py-3 font-medium text-right">送金額</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {ownersWithInfo.map((o: Record<string, any>) => (
                  <>
                    {o.propertyBreakdown.map(
                      (p: Record<string, any>, i: number) => (
                        <tr
                          key={`${o.id}-${p.propertyId}`}
                          className="hover:bg-bg-secondary/30 transition-colors"
                        >
                          {i === 0 && (
                            <td
                              className="px-5 py-3 font-medium"
                              rowSpan={o.propertyBreakdown.length + 1}
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full gradient-accent flex items-center justify-center text-white text-xs font-semibold">
                                  {o.name.charAt(0)}
                                </div>
                                <div>
                                  <div>{o.name}</div>
                                  <div className="text-[11px] text-text-muted font-normal">
                                    手数料 {Number(o.management_fee_rate)}%
                                  </div>
                                </div>
                              </div>
                            </td>
                          )}
                          <td className="px-5 py-3 text-text-secondary">
                            {p.propertyName}
                          </td>
                          <td className="px-5 py-3 text-center">
                            {p.occupiedCount}/{p.unitCount}
                          </td>
                          <td className="px-5 py-3 text-right">
                            ¥{p.rent.toLocaleString()}
                          </td>
                          <td className="px-5 py-3 text-right text-danger">
                            -¥{p.fee.toLocaleString()}
                          </td>
                          <td className="px-5 py-3 text-right text-warning">
                            {p.expense > 0
                              ? `-¥${p.expense.toLocaleString()}`
                              : "—"}
                          </td>
                          <td className="px-5 py-3 text-right font-medium">
                            ¥{p.net.toLocaleString()}
                          </td>
                        </tr>
                      )
                    )}
                    {/* オーナー合計行 */}
                    <tr
                      key={`${o.id}-total`}
                      className="bg-bg-secondary/30 font-semibold"
                    >
                      <td className="px-5 py-2.5 text-right text-text-muted text-xs" colSpan={2}>
                        合計
                      </td>
                      <td className="px-5 py-2.5 text-right">
                        ¥{o.totalRent.toLocaleString()}
                      </td>
                      <td className="px-5 py-2.5 text-right text-danger">
                        -¥{o.managementFee.toLocaleString()}
                      </td>
                      <td className="px-5 py-2.5 text-right text-warning">
                        {o.expenseDeducted > 0
                          ? `-¥${o.expenseDeducted.toLocaleString()}`
                          : "—"}
                      </td>
                      <td className="px-5 py-2.5 text-right text-accent">
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
    </>
  );
}
