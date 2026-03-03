import {
  Building2,
  Home,
  DoorOpen,
  TrendingUp,
  AlertTriangle,
  Wrench,
  MessageSquare,
  FileText,
  ArrowUpRight,
  ArrowRight,
  LogOut,
  Hammer,
  Megaphone,
} from "lucide-react";
import { getDashboardData } from "@/lib/queries";
import StatusBadge from "@/components/StatusBadge";
import PageHeader from "@/components/PageHeader";

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  trend,
  color = "text-text",
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string | number;
  sub?: string;
  trend?: string;
  color?: string;
}) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-accent-subtle flex items-center justify-center">
          <Icon size={20} className="text-accent" />
        </div>
        {trend && (
          <span className="flex items-center gap-0.5 text-xs font-medium text-success">
            <ArrowUpRight size={12} />
            {trend}
          </span>
        )}
      </div>
      <p className={`text-2xl font-bold ${color} tracking-tight`}>{value}</p>
      <p className="text-xs text-text-muted mt-1">{sub || label}</p>
    </div>
  );
}

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

  // パイプライン: 退去予定の残日数を計算
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

      {/* KPI カード */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Building2} label="管理物件" value={s.total_properties} sub={`${s.total_units}戸を管理中`} />
        <StatCard icon={Home} label="入居率" value={`${s.occupancy_rate}%`} sub={`${s.occupied_units}/${s.total_units}戸`} />
        <StatCard icon={DoorOpen} label="空室" value={s.vacant_units} sub="募集可能" color="text-accent" />
        <StatCard icon={TrendingUp} label="回収率" value={`${s.collection_rate}%`} sub={`¥${s.total_rent_received.toLocaleString()}`} />
      </div>

      {/* アラート系 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <StatCard icon={AlertTriangle} label="滞納件数" value={s.overdue_count} sub={`¥${s.overdue_amount.toLocaleString()}`} color="text-danger" />
        <StatCard icon={Wrench} label="未対応修繕" value={s.open_maintenance} sub="件の対応待ち" />
        <StatCard icon={FileText} label="契約満了間近" value={s.expiring_contracts} sub="3ヶ月以内" color="text-warning" />
      </div>

      {/* 空室パイプライン */}
      <div className="card overflow-hidden mb-8">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-sm">退去・空室パイプライン</h2>
          <p className="text-xs text-text-muted mt-0.5">退去予定 → 原状回復 → 募集中の進行状況</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border-light">
          {/* 退去予定 */}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-warning/10 flex items-center justify-center">
                <LogOut size={12} className="text-warning" />
              </div>
              <span className="text-xs font-semibold text-warning">退去予定</span>
              <span className="ml-auto text-xs text-text-muted">{expiringWithDays.length}件</span>
            </div>
            <div className="space-y-2">
              {expiringWithDays.length === 0 ? (
                <p className="text-xs text-text-muted text-center py-3">該当なし</p>
              ) : (
                expiringWithDays.map((c: Record<string, any>) => (
                  <div key={c.id} className="p-2.5 rounded-lg bg-bg-secondary/70 text-xs">
                    <div className="font-medium">{c.unit?.property?.name} {c.unit?.unit_number}</div>
                    <div className="text-text-muted mt-0.5">{c.tenant?.name}</div>
                    <div className={`mt-1 font-semibold ${c.remainingDays <= 30 ? "text-danger" : "text-warning"}`}>
                      あと{c.remainingDays}日（{c.end_date}）
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 原状回復中 */}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center">
                <Hammer size={12} className="text-accent" />
              </div>
              <span className="text-xs font-semibold text-accent">原状回復中</span>
              <span className="ml-auto text-xs text-text-muted">{maintenanceUnits.length}件</span>
            </div>
            <div className="space-y-2">
              {maintenanceUnits.length === 0 ? (
                <p className="text-xs text-text-muted text-center py-3">該当なし</p>
              ) : (
                maintenanceUnits.map((u: Record<string, any>) => (
                  <div key={u.id} className="p-2.5 rounded-lg bg-bg-secondary/70 text-xs">
                    <div className="font-medium">{u.property?.name} {u.unit_number}</div>
                    <div className="text-text-muted mt-0.5">¥{Number(u.rent).toLocaleString()}/月</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 募集中 */}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center">
                <Megaphone size={12} className="text-success" />
              </div>
              <span className="text-xs font-semibold text-success">募集中</span>
              <span className="ml-auto text-xs text-text-muted">{vacantUnits.length}件</span>
            </div>
            <div className="space-y-2">
              {vacantUnits.length === 0 ? (
                <p className="text-xs text-text-muted text-center py-3">該当なし</p>
              ) : (
                vacantUnits.map((u: Record<string, any>) => (
                  <div key={u.id} className="p-2.5 rounded-lg bg-bg-secondary/70 text-xs">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 滞納一覧 */}
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-danger/10 flex items-center justify-center">
              <AlertTriangle size={14} className="text-danger" />
            </div>
            <h2 className="font-semibold text-sm">滞納一覧</h2>
          </div>
          <div className="p-5">
            {overdueBillings.length === 0 ? (
              <p className="text-sm text-text-muted py-4 text-center">滞納なし</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-text-muted">
                    <th className="pb-3 font-medium">入居者</th>
                    <th className="pb-3 font-medium">対象月</th>
                    <th className="pb-3 font-medium text-right">金額</th>
                    <th className="pb-3 font-medium">状態</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light">
                  {overdueBillings.map((b: Record<string, any>) => (
                    <tr key={b.id} className="hover:bg-bg-secondary/50 transition-colors">
                      <td className="py-3">{b.contract?.tenant?.name || "—"}</td>
                      <td className="py-3">{b.billing_month}</td>
                      <td className="py-3 text-right font-medium">¥{Number(b.total_amount).toLocaleString()}</td>
                      <td className="py-3"><StatusBadge status={b.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* 修繕対応中 */}
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-warning/10 flex items-center justify-center">
              <Wrench size={14} className="text-warning" />
            </div>
            <h2 className="font-semibold text-sm">修繕対応中</h2>
          </div>
          <div className="p-5">
            {activeMaintenance.length === 0 ? (
              <p className="text-sm text-text-muted py-4 text-center">対応中の修繕なし</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-text-muted">
                    <th className="pb-3 font-medium">件名</th>
                    <th className="pb-3 font-medium">物件</th>
                    <th className="pb-3 font-medium">優先度</th>
                    <th className="pb-3 font-medium">状態</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light">
                  {activeMaintenance.map((m: Record<string, any>) => (
                    <tr key={m.id} className="hover:bg-bg-secondary/50 transition-colors">
                      <td className="py-3 font-medium">{m.title}</td>
                      <td className="py-3 text-text-secondary">{m.property?.name}</td>
                      <td className="py-3"><StatusBadge status={m.priority} /></td>
                      <td className="py-3"><StatusBadge status={m.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* 満了間近 */}
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-warning/10 flex items-center justify-center">
              <FileText size={14} className="text-warning" />
            </div>
            <h2 className="font-semibold text-sm">契約満了間近（3ヶ月以内）</h2>
          </div>
          <div className="p-5">
            {expiringContracts.length === 0 ? (
              <p className="text-sm text-text-muted py-4 text-center">該当なし</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-text-muted">
                    <th className="pb-3 font-medium">入居者</th>
                    <th className="pb-3 font-medium">物件・部屋</th>
                    <th className="pb-3 font-medium">満了日</th>
                    <th className="pb-3 font-medium">種別</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light">
                  {expiringContracts.map((c: Record<string, any>) => (
                    <tr key={c.id} className="hover:bg-bg-secondary/50 transition-colors">
                      <td className="py-3 font-medium">{c.tenant?.name}</td>
                      <td className="py-3 text-text-secondary">
                        {c.unit?.property?.name} {c.unit?.unit_number}
                      </td>
                      <td className="py-3">{c.end_date}</td>
                      <td className="py-3"><StatusBadge status={c.contract_type} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* 最近の問い合わせ */}
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center">
              <MessageSquare size={14} className="text-accent" />
            </div>
            <h2 className="font-semibold text-sm">最近の問い合わせ</h2>
          </div>
          <div className="p-5">
            {recentInquiries.length === 0 ? (
              <p className="text-sm text-text-muted py-4 text-center">問い合わせなし</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-text-muted">
                    <th className="pb-3 font-medium">件名</th>
                    <th className="pb-3 font-medium">種別</th>
                    <th className="pb-3 font-medium">状態</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light">
                  {recentInquiries.map((inq: Record<string, any>) => (
                    <tr key={inq.id} className="hover:bg-bg-secondary/50 transition-colors">
                      <td className="py-3 font-medium">{inq.title}</td>
                      <td className="py-3"><StatusBadge status={inq.inquiry_type} /></td>
                      <td className="py-3"><StatusBadge status={inq.status} /></td>
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
