import {
  Building2,
  Home,
  DoorOpen,
  TrendingUp,
  Banknote,
  AlertTriangle,
  Wrench,
  MessageSquare,
  FileText,
} from "lucide-react";
import { dashboardStats, rentBillings, maintenanceRequests, contracts, inquiries } from "@/lib/mock-data";
import StatusBadge from "@/components/StatusBadge";
import PageHeader from "@/components/PageHeader";

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color = "text-text",
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
}) {
  return (
    <div className="bg-card rounded-lg border border-border p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-lg bg-bg">
          <Icon size={20} className="text-accent" />
        </div>
        <span className="text-sm text-text-secondary">{label}</span>
      </div>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-text-muted mt-1">{sub}</p>}
    </div>
  );
}

export default function DashboardPage() {
  const s = dashboardStats;

  // 滞納一覧
  const overdueItems = rentBillings.filter((b) => b.status === "overdue");

  // 対応中の修繕
  const activeMaintenance = maintenanceRequests.filter(
    (m) => m.status === "open" || m.status === "in_progress"
  );

  // 満了間近の契約
  const expiringContracts = contracts.filter((c) => {
    if (!c.end_date) return false;
    const end = new Date(c.end_date);
    const now = new Date();
    const diff = (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diff > 0 && diff <= 90;
  });

  return (
    <>
      <PageHeader title="ダッシュボード" description="物件管理の概況" />

      {/* KPI カード */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Building2} label="管理物件" value={s.total_properties} sub={`${s.total_units}戸`} />
        <StatCard icon={Home} label="入居率" value={`${s.occupancy_rate}%`} sub={`${s.occupied_units}/${s.total_units}戸`} />
        <StatCard icon={DoorOpen} label="空室" value={s.vacant_units} sub="募集可能" color="text-accent" />
        <StatCard icon={TrendingUp} label="回収率" value={`${s.collection_rate}%`} sub={`¥${s.total_rent_received.toLocaleString()} / ¥${s.total_rent_expected.toLocaleString()}`} />
      </div>

      {/* アラート系 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <StatCard icon={AlertTriangle} label="滞納件数" value={s.overdue_count} sub={`¥${s.overdue_amount.toLocaleString()}`} color="text-danger" />
        <StatCard icon={Wrench} label="未対応修繕" value={s.open_maintenance} />
        <StatCard icon={FileText} label="契約満了間近" value={s.expiring_contracts} sub="3ヶ月以内" color="text-warning" />
      </div>

      {/* テーブル2列 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 滞納一覧 */}
        <div className="bg-card rounded-lg border border-border">
          <div className="px-5 py-4 border-b border-border flex items-center gap-2">
            <AlertTriangle size={16} className="text-danger" />
            <h2 className="font-semibold text-sm">滞納一覧</h2>
          </div>
          <div className="p-5">
            {overdueItems.length === 0 ? (
              <p className="text-sm text-text-muted">滞納なし</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-text-muted border-b border-border">
                    <th className="pb-2">契約</th>
                    <th className="pb-2">対象月</th>
                    <th className="pb-2 text-right">金額</th>
                    <th className="pb-2">状態</th>
                  </tr>
                </thead>
                <tbody>
                  {overdueItems.map((b) => (
                    <tr key={b.id} className="border-b border-border last:border-0">
                      <td className="py-2">{b.contract_id}</td>
                      <td className="py-2">{b.billing_month}</td>
                      <td className="py-2 text-right font-medium">¥{b.total_amount.toLocaleString()}</td>
                      <td className="py-2"><StatusBadge status={b.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* 修繕対応中 */}
        <div className="bg-card rounded-lg border border-border">
          <div className="px-5 py-4 border-b border-border flex items-center gap-2">
            <Wrench size={16} className="text-warning" />
            <h2 className="font-semibold text-sm">修繕対応中</h2>
          </div>
          <div className="p-5">
            {activeMaintenance.length === 0 ? (
              <p className="text-sm text-text-muted">対応中の修繕なし</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-text-muted border-b border-border">
                    <th className="pb-2">件名</th>
                    <th className="pb-2">物件</th>
                    <th className="pb-2">優先度</th>
                    <th className="pb-2">状態</th>
                  </tr>
                </thead>
                <tbody>
                  {activeMaintenance.map((m) => (
                    <tr key={m.id} className="border-b border-border last:border-0">
                      <td className="py-2 font-medium">{m.title}</td>
                      <td className="py-2 text-text-secondary">{m.property?.name}</td>
                      <td className="py-2"><StatusBadge status={m.priority} /></td>
                      <td className="py-2"><StatusBadge status={m.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* 満了間近 */}
        <div className="bg-card rounded-lg border border-border">
          <div className="px-5 py-4 border-b border-border flex items-center gap-2">
            <FileText size={16} className="text-warning" />
            <h2 className="font-semibold text-sm">契約満了間近（3ヶ月以内）</h2>
          </div>
          <div className="p-5">
            {expiringContracts.length === 0 ? (
              <p className="text-sm text-text-muted">該当なし</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-text-muted border-b border-border">
                    <th className="pb-2">入居者</th>
                    <th className="pb-2">部屋</th>
                    <th className="pb-2">満了日</th>
                    <th className="pb-2">種別</th>
                  </tr>
                </thead>
                <tbody>
                  {expiringContracts.map((c) => (
                    <tr key={c.id} className="border-b border-border last:border-0">
                      <td className="py-2 font-medium">{c.tenant?.name}</td>
                      <td className="py-2 text-text-secondary">{c.unit_id}</td>
                      <td className="py-2">{c.end_date}</td>
                      <td className="py-2"><StatusBadge status={c.contract_type} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* 最近の問い合わせ */}
        <div className="bg-card rounded-lg border border-border">
          <div className="px-5 py-4 border-b border-border flex items-center gap-2">
            <MessageSquare size={16} className="text-accent" />
            <h2 className="font-semibold text-sm">最近の問い合わせ</h2>
          </div>
          <div className="p-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-text-muted border-b border-border">
                  <th className="pb-2">件名</th>
                  <th className="pb-2">種別</th>
                  <th className="pb-2">状態</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((inq) => (
                  <tr key={inq.id} className="border-b border-border last:border-0">
                    <td className="py-2 font-medium">{inq.title}</td>
                    <td className="py-2"><StatusBadge status={inq.inquiry_type} /></td>
                    <td className="py-2"><StatusBadge status={inq.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
