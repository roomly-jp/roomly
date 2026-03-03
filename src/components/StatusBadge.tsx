const statusStyles: Record<string, { dot: string; text: string }> = {
  // 部屋ステータス
  occupied: { dot: "bg-success", text: "text-success" },
  vacant: { dot: "bg-accent", text: "text-accent" },
  reserved: { dot: "bg-warning", text: "text-warning" },
  maintenance: { dot: "bg-text-muted", text: "text-text-muted" },
  // 契約ステータス
  active: { dot: "bg-success", text: "text-success" },
  expired: { dot: "bg-text-muted", text: "text-text-muted" },
  terminated: { dot: "bg-danger", text: "text-danger" },
  pending: { dot: "bg-warning", text: "text-warning" },
  // 請求ステータス
  paid: { dot: "bg-success", text: "text-success" },
  unpaid: { dot: "bg-text-muted", text: "text-text-muted" },
  partial: { dot: "bg-warning", text: "text-warning" },
  overdue: { dot: "bg-danger", text: "text-danger" },
  // 修繕ステータス
  open: { dot: "bg-accent", text: "text-accent" },
  in_progress: { dot: "bg-warning", text: "text-warning" },
  waiting_parts: { dot: "bg-warning", text: "text-warning" },
  completed: { dot: "bg-success", text: "text-success" },
  cancelled: { dot: "bg-text-muted", text: "text-text-muted" },
  // 経費カテゴリ
  repair: { dot: "bg-warning", text: "text-warning" },
  cleaning: { dot: "bg-accent", text: "text-accent" },
  insurance: { dot: "bg-success", text: "text-success" },
  tax: { dot: "bg-danger", text: "text-danger" },
  utility: { dot: "bg-text-muted", text: "text-text-muted" },
  // 送金ステータス
  draft: { dot: "bg-text-muted", text: "text-text-muted" },
  confirmed: { dot: "bg-warning", text: "text-warning" },
  sent: { dot: "bg-success", text: "text-success" },
  // 問い合わせ
  resolved: { dot: "bg-success", text: "text-success" },
  closed: { dot: "bg-text-muted", text: "text-text-muted" },
  // 優先度
  low: { dot: "bg-text-muted", text: "text-text-muted" },
  normal: { dot: "bg-accent", text: "text-accent" },
  high: { dot: "bg-warning", text: "text-warning" },
  urgent: { dot: "bg-danger", text: "text-danger" },
};

const statusLabels: Record<string, string> = {
  occupied: "入居中",
  vacant: "空室",
  reserved: "申込中",
  maintenance: "メンテ中",
  active: "有効",
  expired: "満了",
  terminated: "解約",
  pending: "準備中",
  paid: "入金済",
  unpaid: "未入金",
  partial: "一部入金",
  overdue: "滞納",
  open: "未対応",
  in_progress: "対応中",
  waiting_parts: "部品待ち",
  completed: "完了",
  cancelled: "キャンセル",
  resolved: "解決済",
  closed: "クローズ",
  low: "低",
  normal: "通常",
  high: "高",
  urgent: "緊急",
  fixed: "定期",
  ordinary: "普通",
  general: "一般",
  complaint: "クレーム",
  noise: "騒音",
  facility: "設備",
  move_out: "退去",
  other: "その他",
  repair: "修繕費",
  cleaning: "清掃費",
  insurance: "保険料",
  tax: "税金",
  utility: "光熱費",
  draft: "下書き",
  confirmed: "確定",
  sent: "送金済",
};

interface StatusBadgeProps {
  status: string;
  label?: string;
}

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  const style = statusStyles[status] || { dot: "bg-text-muted", text: "text-text-muted" };
  const text = label || statusLabels[status] || status;

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${style.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {text}
    </span>
  );
}
