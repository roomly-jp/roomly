import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Building2 } from "lucide-react";
import { properties, units, contracts } from "@/lib/mock-data";
import StatusBadge from "@/components/StatusBadge";

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = properties.find((p) => p.id === id);
  if (!property) notFound();

  const propUnits = units.filter((u) => u.property_id === id);
  const occupied = propUnits.filter((u) => u.status === "occupied").length;

  return (
    <>
      {/* ヘッダー */}
      <div className="mb-6">
        <Link href="/properties" className="flex items-center gap-1 text-sm text-text-secondary hover:text-accent mb-3">
          <ArrowLeft size={14} />
          物件一覧に戻る
        </Link>
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-bg">
            <Building2 size={24} className="text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{property.name}</h1>
            <p className="flex items-center gap-1 text-sm text-text-secondary">
              <MapPin size={14} />
              {property.address}
            </p>
          </div>
        </div>
      </div>

      {/* 物件情報 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-xs text-text-muted mb-1">構造</p>
          <p className="font-semibold">{property.structure} {property.floors}F</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-xs text-text-muted mb-1">築年</p>
          <p className="font-semibold">{property.built_year}年（築{new Date().getFullYear() - (property.built_year || 0)}年）</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-xs text-text-muted mb-1">入居率</p>
          <p className="font-semibold">{propUnits.length > 0 ? Math.round((occupied / propUnits.length) * 100) : 0}%</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-xs text-text-muted mb-1">オーナー</p>
          <p className="font-semibold">{property.owner?.name}</p>
        </div>
      </div>

      {/* 部屋一覧 */}
      <div className="bg-card rounded-lg border border-border">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold">部屋一覧（{propUnits.length}戸）</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-text-muted border-b border-border">
                <th className="px-5 py-3">部屋番号</th>
                <th className="px-5 py-3">階</th>
                <th className="px-5 py-3">間取り</th>
                <th className="px-5 py-3">面積</th>
                <th className="px-5 py-3 text-right">賃料</th>
                <th className="px-5 py-3 text-right">管理費</th>
                <th className="px-5 py-3">状態</th>
                <th className="px-5 py-3">入居者</th>
              </tr>
            </thead>
            <tbody>
              {propUnits.map((unit) => {
                const contract = contracts.find(
                  (c) => c.unit_id === unit.id && c.status === "active"
                );
                return (
                  <tr key={unit.id} className="border-b border-border last:border-0 hover:bg-bg/50">
                    <td className="px-5 py-3 font-medium">{unit.unit_number}</td>
                    <td className="px-5 py-3">{unit.floor}F</td>
                    <td className="px-5 py-3">{unit.layout}</td>
                    <td className="px-5 py-3">{unit.area_sqm}m²</td>
                    <td className="px-5 py-3 text-right">¥{unit.rent.toLocaleString()}</td>
                    <td className="px-5 py-3 text-right">¥{unit.management_fee.toLocaleString()}</td>
                    <td className="px-5 py-3"><StatusBadge status={unit.status} /></td>
                    <td className="px-5 py-3 text-text-secondary">{contract?.tenant?.name || "—"}</td>
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
