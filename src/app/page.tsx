import {
  AlertTriangle,
  Wrench,
  FileText,
  MessageSquare,
  LogOut,
  Hammer,
  Megaphone,
} from "lucide-react";
import { getDashboardData } from "@/lib/queries";
import StatusBadge from "@/components/StatusBadge";
import PageHeader from "@/components/PageHeader";

export default async function DashboardPage() {
  const {
    stats: s,
    overdueBillings,
    activeMaintenance,
    expiringContracts,
    recentInquiries,
    maintenanceUnits,
    vacantUnits,
  } = await getDashboardData();

  const now = new Date();
  const expiringWithDays = expiringContracts.map((c: Record<string, any>) => {
    const diff = Math.ceil(
      (new Date(c.end_date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return { ...c, remainingDays: diff };
  });

  return (
    <>
      <PageHeader title="ダッシュボード" description="物件管理の概況" />

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="card p-4">
          <p className="text-[11px] text-text-muted uppercase tracking-wider mb-2">管理物件</p>
          <p className="text-2xl font-semibold tabular-nums">{s.total_properties}</p>
          <p className="text-[12px] text-text-muted mt-1">{s.total_units}戸を管理中</p>
        </div>
        <div className="card p-4">
          <p className="text-[11px] text-text-muted uppercase tracking-wider mb-2">入居率</p>
          <p className="text-2xl font-semibold tabular-nums">{s.occupancy_rate}%</p>
          <p className="text-[12px] text-text-muted mt-1">{s.occupied_units}/{s.total_units}戸</p>
        </div>
        <div className="card p-4">
          <p className="text-[11px] text-text-muted uppercase tracking-wider mb-2">空室</p>
          <p className="text-2xl font-semibold text-accent tabular-nums">{s.vacant_units}</p>
          <p className="text-[12px] text-text-muted mt-1">募集可能</p>
        </div>
        <div className="card p-4">
          <p className="text-[11px] text-text-muted uppercase tracking-wider mb-2">回収率</p>
          <p className="text-2xl font-semibold tabular-nums">{s.collection_rate}%</p>
          <p className="text-[12px] text-text-muted mt-1">¥{s.total_rent_received.toLocaleString()}</p>
        </div>
      </div>

      {/* アラート指標 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-8">
        <div className="card p-4 border-l-3 border-l-danger">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-text-muted uppercase tracking-wider mb-1">滞納件数</p>
              <p className="text-xl font-semibold text-danger tabular-nums">{s.overdue_count}</p>
            </div>
            <p className="text-[13px] font-medium text-danger tabular-nums">¥{s.overdue_amount.toLocaleString()}</p>
          </div>
        </div>
        <div className="card p-4 border-l-3 border-l-warning">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-text-muted uppercase tracking-wider mb-1">未対応修繕</p>
              <p className="text-xl font-semibold tabular-nums">{s.open_maintenance}</p>
            </div>
            <p className="text-[13px] text-text-muted">件の対応待ち</p>
          </div>
        </div>
        <div className="card p-4 border-l-3 border-l-accent">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-text-muted uppercase tracking-wider mb-1">契約満了間近</p>
              <p className="text-xl font-semibold tabular-nums">{s.expiring_contracts}</p>
            </div>
            <p className="text-[13px] text-text-muted">3ヶ月以内</p>
          </div>
        </div>
      </div>

      {/* パイプライン */}
      <div className="card overflow-hidden mb-8">
        <div className="px-5 py-3 border-b border-border-light">
          <h2 className="text-[13px] font-semibold">退去・空室パイプライン</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border-light">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <LogOut size={13} className="text-warning" />
              <span className="text-[12px] font-medium text-warning">退去予定</span>
              <span className="ml-auto text-[11px] text-text-muted">{expiringWithDays.length}件</span>
            </div>
            <div className="space-y-1.5">
              {expiringWithDays.length === 0 ? (
                <p className="text-[12px] text-text-muted text-center py-3">該当なし</p>
              ) : (
                expiringWithDays.map((c: Record<string, any>) => (
                  <div key={c.id} className="p-2.5 rounded bg-bg-secondary/60 text-[12px]">
                    <div className="font-medium">{c.unit?.property?.name} {c.unit?.unit_number}</div>
                    <div className="text-text-muted mt-0.5">{c.tenant?.name}</div>
                    <div className={`mt-1 font-medium ${c.remainingDays <= 30 ? "text-danger" : "text-warning"}`}>
                      あと{c.remainingDays}日（{c.end_date}）
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Hammer size={13} className="text-accent" />
              <span className="text-[12px] font-medium text-accent">原状回復中</span>
              <span className="ml-auto text-[11px] text-text-muted">{maintenanceUnits.length}件</span>
            </div>
            <div className="space-y-1.5">
              {maintenanceUnits.length === 0 ? (
                <p className="text-[12px] text-text-muted text-center py-3">該当なし</p>
              ) : (
                maintenanceUnits.map((u: Record<string, any>) => (
                  <div key={u.id} className="p-2.5 rounded bg-bg-secondary/60 text-[12px]">
                    <div className="font-medium">{u.property?.name} {u.unit_number}</div>
                    <div className="text-text-muted mt-0.5">¥{Number(u.rent).toLocaleString()}/月</div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Megaphone size={13} className="text-success" />
              <span className="text-[12px] font-medium text-success">募集中</span>
              <span className="ml-auto text-[11px] text-text-muted">{vacantUnits.length}件</span>
            </div>
            <div className="space-y-1.5">
              {vacantUnits.length === 0 ? (
                <p className="text-[12px] text-text-muted text-center py-3">該当なし</p>
              ) : (
                vacantUnits.map((u: Record<string, any>) => (
                  <div key={u.id} className="p-2.5 rounded bg-bg-secondary/60 text-[12px]">
                    <div className="font-medium">{u.property?.name} {u.unit_number}</div>
                    <div className="text-text-muted mt-0.5">¥{Number(u.rent).toLocaleString()}/月</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* テーブル2列 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card overflow-hidden">
          <div className="px-5 py-3 border-b border-border-light flex items-center gap-2">
            <AlertTriangle size={14} className="text-danger" />
            <h2 className="text-[13px] font-semibold">滞納一覧</h2>
          </div>
          <div className="p-4">
            {overdueBillings.length === 0 ? (
              <p className="text-[13px] text-text-muted py-4 text-center">滞納なし</p>
            ) : (
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="text-left text-text-muted border-b border-border-light">
                    <th className="pb-2 font-medium">入居者</th>
                    <th className="pb-2 font-medium">対象月</th>
                    <th className="pb-2 font-medium text-right">金額</th>
                    <th className="pb-2 font-medium">状態</th>
                  </tr>
                </thead>
                <tbody>
                  {overdueBillings.map((b: Record<string, any>) => (
                    <tr key={b.id} className="border-b border-border-light last:border-0">
                      <td className="py-2.5">{b.contract?.tenant?.name || "—"}</td>
                      <td className="py-2.5 text-text-secondary">{b.billing_month}</td>
                      <td className="py-2.5 text-right font-medium tabular-nums">¥{Number(b.total_amount).toLocaleString()}</td>
                      <td className="py-2.5"><StatusBadge status={b.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="px-5 py-3 border-b border-border-light flex items-center gap-2">
            <Wrench size={14} className="text-warning" />
            <h2 className="text-[13px] font-semibold">修繕対応中</h2>
          </div>
          <div className="p-4">
            {activeMaintenance.length === 0 ? (
              <p className="text-[13px] text-text-muted py-4 text-center">対応中の修繕なし</p>
            ) : (
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="text-left text-text-muted border-b border-border-light">
                    <th className="pb-2 font-medium">件名</th>
                    <th className="pb-2 font-medium">物件</th>
                    <th className="pb-2 font-medium">優先度</th>
                    <th className="pb-2 font-medium">状態</th>
                  </tr>
                </thead>
                <tbody>
                  {activeMaintenance.map((m: Record<string, any>) => (
                    <tr key={m.id} className="border-b border-border-light last:border-0">
                      <td className="py-2.5 font-medium">{m.title}</td>
                      <td className="py-2.5 text-text-secondary">{m.property?.name}</td>
                      <td className="py-2.5"><StatusBadge status={m.priority} /></td>
                      <td className="py-2.5"><StatusBadge status={m.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="px-5 py-3 border-b border-border-light flex items-center gap-2">
            <FileText size={14} className="text-accent" />
            <h2 className="text-[13px] font-semibold">契約満了間近（3ヶ月以内）</h2>
          </div>
          <div className="p-4">
            {expiringContracts.length === 0 ? (
              <p className="text-[13px] text-text-muted py-4 text-center">該当なし</p>
            ) : (
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="text-left text-text-muted border-b border-border-light">
                    <th className="pb-2 font-medium">入居者</th>
                    <th className="pb-2 font-medium">物件・部屋</th>
                    <th className="pb-2 font-medium">満了日</th>
                    <th className="pb-2 font-medium">種別</th>
                  </tr>
                </thead>
                <tbody>
                  {expiringContracts.map((c: Record<string, any>) => (
                    <tr key={c.id} className="border-b border-border-light last:border-0">
                      <td className="py-2.5 font-medium">{c.tenant?.name}</td>
                      <td className="py-2.5 text-text-secondary">
                        {c.unit?.property?.name} {c.unit?.unit_number}
                      </td>
                      <td className="py-2.5">{c.end_date}</td>
                      <td className="py-2.5"><StatusBadge status={c.contract_type} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="px-5 py-3 border-b border-border-light flex items-center gap-2">
            <MessageSquare size={14} className="text-accent" />
            <h2 className="text-[13px] font-semibold">最近の問い合わせ</h2>
          </div>
          <div className="p-4">
            {recentInquiries.length === 0 ? (
              <p className="text-[13px] text-text-muted py-4 text-center">問い合わせなし</p>
            ) : (
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="text-left text-text-muted border-b border-border-light">
                    <th className="pb-2 font-medium">件名</th>
                    <th className="pb-2 font-medium">種別</th>
                    <th className="pb-2 font-medium">状態</th>
                  </tr>
                </thead>
                <tbody>
                  {recentInquiries.map((inq: Record<string, any>) => (
                    <tr key={inq.id} className="border-b border-border-light last:border-0">
                      <td className="py-2.5 font-medium">{inq.title}</td>
                      <td className="py-2.5"><StatusBadge status={inq.inquiry_type} /></td>
                      <td className="py-2.5"><StatusBadge status={inq.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
