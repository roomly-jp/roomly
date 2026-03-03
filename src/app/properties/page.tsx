import Link from "next/link";
import { Plus, MapPin } from "lucide-react";
import { getProperties } from "@/lib/queries";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";

export default async function PropertiesPage() {
  const properties = await getProperties();

  return (
    <>
      <PageHeader
        title="物件管理"
        description={`${properties.length}件の管理物件`}
        action={
          <button className="btn-primary">
            <Plus size={14} />
            物件を追加
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {properties.map((prop: Record<string, any>) => {
          const propUnits = prop.units || [];
          const occupied = propUnits.filter((u: any) => u.status === "occupied").length;
          const vacant = propUnits.filter((u: any) => u.status === "vacant").length;
          const totalRent = propUnits.reduce((sum: number, u: any) => sum + Number(u.rent), 0);
          const occupancyRate = propUnits.length > 0 ? Math.round((occupied / propUnits.length) * 100) : 0;

          return (
            <Link
              key={prop.id}
              href={`/properties/${prop.id}`}
              className="card card-interactive p-4 block"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-[14px] font-semibold text-text">{prop.name}</h3>
                  <p className="flex items-center gap-1 text-[12px] text-text-muted mt-0.5">
                    <MapPin size={11} />
                    {prop.address}
                  </p>
                </div>
                <StatusBadge status={prop.property_type} label={prop.property_type === "apartment" ? "マンション" : prop.property_type} />
              </div>

              {/* 入居率 */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-text-muted">入居率</span>
                  <span className="font-medium tabular-nums">{occupancyRate}%</span>
                </div>
                <div className="h-1 bg-bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-accent transition-all"
                    style={{ width: `${occupancyRate}%` }}
                  />
                </div>
              </div>

              <div className="flex gap-2 text-center mb-3">
                <div className="flex-1 py-1.5 rounded bg-bg-secondary">
                  <p className="text-[10px] text-text-muted">全戸数</p>
                  <p className="text-[15px] font-semibold tabular-nums">{propUnits.length}</p>
                </div>
                <div className="flex-1 py-1.5 rounded bg-bg-secondary">
                  <p className="text-[10px] text-text-muted">入居</p>
                  <p className="text-[15px] font-semibold text-success tabular-nums">{occupied}</p>
                </div>
                <div className="flex-1 py-1.5 rounded bg-bg-secondary">
                  <p className="text-[10px] text-text-muted">空室</p>
                  <p className="text-[15px] font-semibold text-accent tabular-nums">{vacant}</p>
                </div>
                <div className="flex-1 py-1.5 rounded bg-bg-secondary">
                  <p className="text-[10px] text-text-muted">家賃合計</p>
                  <p className="text-[13px] font-semibold tabular-nums">¥{totalRent.toLocaleString()}</p>
                </div>
              </div>

              <div className="pt-2.5 border-t border-border-light flex items-center gap-3 text-[11px] text-text-muted">
                <span>{prop.structure} {prop.floors}F</span>
                <span>築{prop.built_year ? new Date().getFullYear() - prop.built_year : "-"}年</span>
                <span>{prop.nearest_station} 徒歩{prop.walk_minutes}分</span>
                <span className="ml-auto font-medium text-text-secondary">{prop.owner?.name}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
