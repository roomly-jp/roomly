import { Plus } from "lucide-react";
import { getExpenses } from "@/lib/queries";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";

const categoryLabels: Record<string, string> = {
  repair: "修繕費",
  cleaning: "清掃費",
  insurance: "保険料",
  tax: "税金",
  utility: "光熱費",
  other: "その他",
};

export default async function ExpensesPage() {
  const expenses = await getExpenses();

  const totalAmount = expenses.reduce(
    (s: number, e: any) => s + Number(e.amount),
    0
  );
  const ownerChargeAmount = expenses
    .filter((e: any) => e.is_owner_charge)
    .reduce((s: number, e: any) => s + Number(e.amount), 0);
  const companyChargeAmount = totalAmount - ownerChargeAmount;

  // カテゴリ別集計
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
        action={
          <button className="btn-primary">
            <Plus size={16} />
            経費を登録
          </button>
        }
      />

      {/* サマリー */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card p-5">
          <p className="text-xs text-text-muted mb-1">経費総額</p>
          <p className="text-xl font-bold tracking-tight">
            ¥{totalAmount.toLocaleString()}
          </p>
        </div>
        <div className="card p-5">
          <p className="text-xs text-text-muted mb-1">オーナー負担</p>
          <p className="text-xl font-bold text-warning tracking-tight">
            ¥{ownerChargeAmount.toLocaleString()}
          </p>
          <p className="text-[11px] text-text-muted mt-0.5">
            送金時に控除
          </p>
        </div>
        <div className="card p-5">
          <p className="text-xs text-text-muted mb-1">管理会社負担</p>
          <p className="text-xl font-bold text-accent tracking-tight">
            ¥{companyChargeAmount.toLocaleString()}
          </p>
        </div>
        <div className="card p-5">
          <p className="text-xs text-text-muted mb-1">登録件数</p>
          <p className="text-xl font-bold tracking-tight">{expenses.length}件</p>
        </div>
      </div>

      {/* カテゴリ別内訳 */}
      <div className="flex flex-wrap gap-2 mb-5">
        {Object.entries(byCategory).map(([cat, amount]) => (
          <div
            key={cat}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-secondary text-xs"
          >
            <StatusBadge status={cat} />
            <span className="font-medium">
              ¥{(amount as number).toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-text-muted bg-bg-secondary/50">
                <th className="px-5 py-3 font-medium">日付</th>
                <th className="px-5 py-3 font-medium">カテゴリ</th>
                <th className="px-5 py-3 font-medium">内容</th>
                <th className="px-5 py-3 font-medium">物件</th>
                <th className="px-5 py-3 font-medium">部屋</th>
                <th className="px-5 py-3 font-medium text-right">金額</th>
                <th className="px-5 py-3 font-medium">負担</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
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
                    className="hover:bg-bg-secondary/30 transition-colors"
                  >
                    <td className="px-5 py-3">{e.expense_date}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={e.category} />
                    </td>
                    <td className="px-5 py-3 font-medium">{e.description}</td>
                    <td className="px-5 py-3 text-text-secondary">
                      {e.property?.name || "—"}
                    </td>
                    <td className="px-5 py-3">
                      {e.unit?.unit_number || "—"}
                    </td>
                    <td className="px-5 py-3 text-right font-medium">
                      ¥{Number(e.amount).toLocaleString()}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${
                          e.is_owner_charge
                            ? "bg-warning/10 text-warning ring-warning/20"
                            : "bg-accent/10 text-accent ring-accent/20"
                        }`}
                      >
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
