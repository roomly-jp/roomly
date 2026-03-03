import { Plus } from "lucide-react";
import { getInquiries } from "@/lib/queries";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";

export default async function InquiriesPage() {
  const inquiries = await getInquiries();

  return (
    <>
      <PageHeader
        title="問い合わせ管理"
        description={`${inquiries.length}件の問い合わせ`}
        action={
          <button className="btn-primary">
            <Plus size={14} />
            問い合わせを登録
          </button>
        }
      />

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left text-text-muted border-b border-border-light">
                <th className="px-5 py-2.5 font-medium">件名</th>
                <th className="px-5 py-2.5 font-medium">種別</th>
                <th className="px-5 py-2.5 font-medium">優先度</th>
                <th className="px-5 py-2.5 font-medium">状態</th>
                <th className="px-5 py-2.5 font-medium">登録日</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inq: Record<string, any>) => (
                <tr key={inq.id} className="border-b border-border-light last:border-0 hover:bg-bg-secondary/30 transition-colors cursor-pointer">
                  <td className="px-5 py-2.5 font-medium">{inq.title}</td>
                  <td className="px-5 py-2.5"><StatusBadge status={inq.inquiry_type} /></td>
                  <td className="px-5 py-2.5"><StatusBadge status={inq.priority} /></td>
                  <td className="px-5 py-2.5"><StatusBadge status={inq.status} /></td>
                  <td className="px-5 py-2.5">{inq.created_at?.slice(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
