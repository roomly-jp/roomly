import { Plus } from "lucide-react";
import { inquiries } from "@/lib/mock-data";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";

export default function InquiriesPage() {
  return (
    <>
      <PageHeader
        title="問い合わせ管理"
        description={`${inquiries.length}件の問い合わせ`}
        action={
          <button className="flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent-light transition-colors">
            <Plus size={16} />
            問い合わせを登録
          </button>
        }
      />

      <div className="bg-card rounded-lg border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-text-muted border-b border-border">
              <th className="px-5 py-3">件名</th>
              <th className="px-5 py-3">種別</th>
              <th className="px-5 py-3">優先度</th>
              <th className="px-5 py-3">状態</th>
              <th className="px-5 py-3">登録日</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inq) => (
              <tr key={inq.id} className="border-b border-border last:border-0 hover:bg-bg/50 cursor-pointer">
                <td className="px-5 py-3 font-medium">{inq.title}</td>
                <td className="px-5 py-3"><StatusBadge status={inq.inquiry_type} /></td>
                <td className="px-5 py-3"><StatusBadge status={inq.priority} /></td>
                <td className="px-5 py-3"><StatusBadge status={inq.status} /></td>
                <td className="px-5 py-3">{inq.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
