import { getExpenses, getPropertiesForSelect, getOwnersForSelect } from "@/lib/queries";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import ExpensesPageClient from "@/components/ExpensesPageClient";

export default async function ExpensesPage() {
  const [expenses, properties, owners] = await Promise.all([
    getExpenses(),
    getPropertiesForSelect(),
    getOwnersForSelect(),
  ]);

  const totalAmount = expenses.reduce(
    (s: number, e: any) => s + Number(e.amount),
    0
  );
  const ownerChargeAmount = expenses
    .filter((e: any) => e.is_owner_charge)
    .reduce((s: number, e: any) => s + Number(e.amount), 0);
  const companyChargeAmount = totalAmount - ownerChargeAmount;

  const byCategory = expenses.reduce(
    (acc: Record<string, number>, e: any) => {
      acc[e.category] = (acc[e.category] || 0) + Number(e.amount);
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <>
      <PageHeader
        title="経費管理"
        description="物件経費・オーナー負担の管理"
        action={<ExpensesPageClient properties={properties} owners={owners} />}
      />

      {/* サマリー */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="card p-4">
          <p className="text-[11px] text-text-muted uppercase tracking-wider mb-2">経費総額</p>
          <p className="text-xl font-semibold tabular-nums">¥{totalAmount.toLocaleString()}</p>
        </div>
        <div className="card p-4 border-l-3 border-l-warning">
          <p className="text-[11px] text-text-muted uppercase tracking-wider mb-2">オーナー負担</p>
          <p className="text-xl font-semibold text-warning tabular-nums">¥{ownerChargeAmount.toLocaleString()}</p>
          <p className="text-[11px] text-text-muted mt-0.5">送金時に控除</p>
        </div>
        <div className="card p-4">
          <p className="text-[11px] text-text-muted uppercase tracking-wider mb-2">管理会社負担</p>
          <p className="text-xl font-semibold text-accent tabular-nums">¥{companyChargeAmount.toLocaleString()}</p>
        </div>
        <div className="card p-4">
          <p className="text-[11px] text-text-muted uppercase tracking-wider mb-2">登録件数</p>
          <p className="text-xl font-semibold tabular-nums">{expenses.length}件</p>
        </div>
      </div>

      {/* カテゴリ別内訳 */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {Object.entries(byCategory).map(([cat, amount]) => (
          <div
            key={cat}
            className="flex items-center gap-2 px-3 py-1.5 rounded bg-card shadow-sm text-[12px]"
          >
            <StatusBadge status={cat} />
            <span className="font-medium tabular-nums">
              ¥{(amount as number).toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left text-text-muted border-b border-border-light">
                <th className="px-5 py-2.5 font-medium">日付</th>
                <th className="px-5 py-2.5 font-medium">カテゴリ</th>
                <th className="px-5 py-2.5 font-medium">内容</th>
                <th className="px-5 py-2.5 font-medium">物件</th>
                <th className="px-5 py-2.5 font-medium">部屋</th>
                <th className="px-5 py-2.5 font-medium text-right">金額</th>
                <th className="px-5 py-2.5 font-medium">負担</th>
              </tr>
            </thead>
            <tbody>
              {expenses.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-8 text-center text-text-muted"
                  >
                    経費データがありません
                  </td>
                </tr>
              ) : (
                expenses.map((e: Record<string, any>) => (
                  <tr
                    key={e.id}
                    className="border-b border-border-light last:border-0 hover:bg-bg-secondary/30 transition-colors"
                  >
                    <td className="px-5 py-2.5">{e.expense_date}</td>
                    <td className="px-5 py-2.5">
                      <StatusBadge status={e.category} />
                    </td>
                    <td className="px-5 py-2.5 font-medium">{e.description}</td>
                    <td className="px-5 py-2.5 text-text-secondary">
                      {e.property?.name || "—"}
                    </td>
                    <td className="px-5 py-2.5">
                      {e.unit?.unit_number || "—"}
                    </td>
                    <td className="px-5 py-2.5 text-right font-medium tabular-nums">
                      ¥{Number(e.amount).toLocaleString()}
                    </td>
                    <td className="px-5 py-2.5">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                          e.is_owner_charge
                            ? "text-warning"
                            : "text-accent"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${e.is_owner_charge ? "bg-warning" : "bg-accent"}`} />
                        {e.is_owner_charge ? "オーナー" : "管理会社"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
