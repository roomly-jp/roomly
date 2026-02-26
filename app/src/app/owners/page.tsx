import { Plus } from "lucide-react";
import { owners, properties, units } from "@/lib/mock-data";
import PageHeader from "@/components/PageHeader";

export default function OwnersPage() {
  const ownersWithInfo = owners.map((o) => {
    const ownerProps = properties.filter((p) => p.owner_id === o.id);
    const ownerUnits = ownerProps.flatMap((p) =>
      units.filter((u) => u.property_id === p.id)
    );
    const totalRent = ownerUnits
      .filter((u) => u.status === "occupied")
      .reduce((s, u) => s + u.rent, 0);
    const managementFee = Math.round(totalRent * (o.management_fee_rate / 100));
    return {
      ...o,
      propertyCount: ownerProps.length,
      unitCount: ownerUnits.length,
      occupiedCount: ownerUnits.filter((u) => u.status === "occupied").length,
      totalRent,
      managementFee,
      netAmount: totalRent - managementFee,
    };
  });

  return (
    <>
      <PageHeader
        title="オーナー管理"
        description={`${owners.length}名のオーナー`}
        action={
          <button className="flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent-light transition-colors">
            <Plus size={16} />
            オーナーを追加
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {ownersWithInfo.map((o) => (
          <div key={o.id} className="bg-card rounded-lg border border-border p-5 hover:border-accent/30 transition-colors cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">{o.name}</h3>
              <span className="text-xs text-text-muted">手数料 {o.management_fee_rate}%</span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center mb-4">
              <div>
                <p className="text-xs text-text-muted">物件数</p>
                <p className="text-lg font-bold">{o.propertyCount}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted">総戸数</p>
                <p className="text-lg font-bold">{o.unitCount}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted">入居</p>
                <p className="text-lg font-bold text-success">{o.occupiedCount}</p>
              </div>
            </div>

            <div className="border-t border-border pt-3 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">家賃収入</span>
                <span className="font-medium">¥{o.totalRent.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">管理手数料</span>
                <span className="text-danger">-¥{o.managementFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-border">
                <span className="font-medium">送金額</span>
                <span className="font-bold text-accent">¥{o.netAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-3 text-xs text-text-muted">
              {o.phone && <span>{o.phone}</span>}
              {o.email && <span className="ml-3">{o.email}</span>}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
