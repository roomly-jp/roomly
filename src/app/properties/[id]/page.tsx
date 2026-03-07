import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";
import { getPropertyDetail } from "@/lib/queries";
import StatusBadge from "@/components/StatusBadge";
import PropertyDetailClient from "@/components/PropertyDetailClient";

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getPropertyDetail(id);
  if (!result) notFound();

  const { property, units, contracts } = result;
  const occupied = units.filter((u: any) => u.status === "occupied").length;

  return (
    <>
      <div className="mb-6">
        <Link href="/properties" className="inline-flex items-center gap-1 text-[13px] text-text-muted hover:text-accent mb-3 transition-colors">
          <ArrowLeft size={13} />
          物件一覧に戻る
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">{property.name}</h1>
            <p className="flex items-center gap-1 text-[13px] text-text-muted mt-0.5">
              <MapPin size={12} />
              {property.address}
            </p>
          </div>
          <PropertyDetailClient propertyId={id} />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: "構造", value: `${property.structure} ${property.floors}F` },
          { label: "築年", value: `${property.built_year}年（築${new Date().getFullYear() - (property.built_year || 0)}年）` },
          { label: "入居率", value: `${units.length > 0 ? Math.round((occupied / units.length) * 100) : 0}%` },
          { label: "オーナー", value: property.owner?.name || "—" },
        ].map((item) => (
          <div key={item.label} className="card p-4">
            <p className="text-[11px] text-text-muted uppercase tracking-wider mb-1">{item.label}</p>
            <p className="text-[14px] font-medium">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="px-5 py-3 border-b border-border-light">
          <h2 className="text-[13px] font-semibold">部屋一覧（{units.length}戸）</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left text-text-muted border-b border-border-light">
                <th className="px-5 py-2.5 font-medium">部屋番号</th>
                <th className="px-5 py-2.5 font-medium">階</th>
                <th className="px-5 py-2.5 font-medium">間取り</th>
                <th className="px-5 py-2.5 font-medium">面積</th>
                <th className="px-5 py-2.5 font-medium text-right">賃料</th>
                <th className="px-5 py-2.5 font-medium text-right">管理費</th>
                <th className="px-5 py-2.5 font-medium">状態</th>
                <th className="px-5 py-2.5 font-medium">入居者</th>
              </tr>
            </thead>
            <tbody>
              {units.map((unit: any) => {
                const contract = contracts.find(
                  (c: any) => c.unit_id === unit.id
                );
                return (
                  <tr key={unit.id} className="border-b border-border-light last:border-0 hover:bg-bg-secondary/30 transition-colors">
                    <td className="px-5 py-2.5 font-medium">{unit.unit_number}</td>
                    <td className="px-5 py-2.5">{unit.floor}F</td>
                    <td className="px-5 py-2.5">{unit.layout}</td>
                    <td className="px-5 py-2.5">{Number(unit.area_sqm)}m2</td>
                    <td className="px-5 py-2.5 text-right tabular-nums">¥{Number(unit.rent).toLocaleString()}</td>
                    <td className="px-5 py-2.5 text-right tabular-nums">¥{Number(unit.management_fee).toLocaleString()}</td>
                    <td className="px-5 py-2.5"><StatusBadge status={unit.status} /></td>
                    <td className="px-5 py-2.5 text-text-secondary">{contract?.tenant?.name || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
