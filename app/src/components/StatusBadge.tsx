const statusStyles: Record<string, string> = {
  // 部屋ステータス
  occupied: "bg-success-bg text-success",
  vacant: "bg-blue-50 text-accent",
  reserved: "bg-warning-bg text-warning",
  maintenance: "bg-gray-100 text-text-secondary",
  // 契約ステータス
  active: "bg-success-bg text-success",
  expired: "bg-gray-100 text-text-secondary",
  terminated: "bg-danger-bg text-danger",
  pending: "bg-warning-bg text-warning",
  // 請求ステータス
  paid: "bg-success-bg text-success",
  unpaid: "bg-gray-100 text-text-secondary",
  partial: "bg-warning-bg text-warning",
  overdue: "bg-danger-bg text-danger",
  // 修繕ステータス
  open: "bg-blue-50 text-accent",
  in_progress: "bg-warning-bg text-warning",
  waiting_parts: "bg-warning-bg text-warning",
  completed: "bg-success-bg text-success",
  cancelled: "bg-gray-100 text-text-secondary",
  // 問い合わせ
  resolved: "bg-success-bg text-success",
  closed: "bg-gray-100 text-text-secondary",
  // 優先度
  low: "bg-gray-100 text-text-secondary",
  normal: "bg-blue-50 text-accent",
  high: "bg-warning-bg text-warning",
  urgent: "bg-danger-bg text-danger",
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
};

interface StatusBadgeProps {
  status: string;
  label?: string;
}

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  const style = statusStyles[status] || "bg-gray-100 text-text-secondary";
  const text = label || statusLabels[status] || status;

  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${style}`}>
      {text}
    </span>
  );
}
