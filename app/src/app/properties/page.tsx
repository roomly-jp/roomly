import Link from "next/link";
import { Plus, Building2 } from "lucide-react";
import { properties, units } from "@/lib/mock-data";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";

export default function PropertiesPage() {
  return (
    <>
      <PageHeader
        title="物件管理"
        description={`${properties.length}件の管理物件`}
        action={
          <button className="flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent-light transition-colors">
            <Plus size={16} />
            物件を追加
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {properties.map((prop) => {
          const propUnits = units.filter((u) => u.property_id === prop.id);
          const occupied = propUnits.filter((u) => u.status === "occupied").length;
          const vacant = propUnits.filter((u) => u.status === "vacant").length;
          const totalRent = propUnits.reduce((sum, u) => sum + u.rent, 0);

          return (
            <Link
              key={prop.id}
              href={`/properties/${prop.id}`}
              className="bg-card rounded-lg border border-border p-5 hover:border-accent/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-bg">
                    <Building2 size={20} className="text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text">{prop.name}</h3>
                    <p className="text-xs text-text-secondary">{prop.address}</p>
                  </div>
                </div>
                <StatusBadge status={prop.property_type} label={prop.property_type === "apartment" ? "マンション" : prop.property_type} />
              </div>

              <div className="grid grid-cols-4 gap-3 text-center">
                <div>
                  <p className="text-xs text-text-muted">全戸数</p>
                  <p className="text-lg font-bold">{propUnits.length}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">入居</p>
                  <p className="text-lg font-bold text-success">{occupied}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">空室</p>
                  <p className="text-lg font-bold text-accent">{vacant}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted">家賃合計</p>
                  <p className="text-sm font-bold">¥{totalRent.toLocaleString()}</p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-border flex items-center gap-4 text-xs text-text-secondary">
                <span>{prop.structure} {prop.floors}F</span>
                <span>築{prop.built_year ? new Date().getFullYear() - prop.built_year : "-"}年</span>
                <span>{prop.nearest_station} 徒歩{prop.walk_minutes}分</span>
                <span className="ml-auto">オーナー: {prop.owner?.name}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
