import { getCompany } from "@/lib/queries";
import PageHeader from "@/components/PageHeader";

export default async function SettingsPage() {
  const company = await getCompany();
  const isSelfManaged = company?.usage_type === "self_managed";

  return (
    <>
      <PageHeader title="設定" description="アカウント・利用設定" />

      <div className="max-w-2xl space-y-4">
        {/* 利用形態 */}
        <div className="card p-5">
          <h2 className="text-[14px] font-semibold mb-1.5">利用形態</h2>
          <p className="text-[13px] text-text-muted mb-4">
            管理会社として利用する場合と、物件オーナー自身が自主管理する場合で表示が変わります。
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <label
              className={`flex items-start gap-3 p-3.5 rounded border cursor-pointer transition-colors ${
                !isSelfManaged
                  ? "border-accent bg-accent-subtle"
                  : "border-border hover:border-border"
              }`}
            >
              <input
                type="radio"
                name="usage_type"
                value="management_company"
                defaultChecked={!isSelfManaged}
                className="mt-0.5"
              />
              <div>
                <p className="text-[13px] font-medium">管理会社</p>
                <p className="text-[11px] text-text-muted mt-0.5">
                  複数オーナーの物件を受託管理
                </p>
              </div>
            </label>
            <label
              className={`flex items-start gap-3 p-3.5 rounded border cursor-pointer transition-colors ${
                isSelfManaged
                  ? "border-accent bg-accent-subtle"
                  : "border-border hover:border-border"
              }`}
            >
              <input
                type="radio"
                name="usage_type"
                value="self_managed"
                defaultChecked={isSelfManaged}
                className="mt-0.5"
              />
              <div>
                <p className="text-[13px] font-medium">自主管理オーナー</p>
                <p className="text-[11px] text-text-muted mt-0.5">
                  自分の物件を自分で管理
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* 会社 / オーナー情報 */}
        <div className="card p-5">
          <h2 className="text-[14px] font-semibold mb-4">
            {isSelfManaged ? "オーナー情報" : "会社情報"}
          </h2>
          <div className="space-y-3">
            <div>
              <label className="block text-[13px] font-medium text-text-secondary mb-1">
                {isSelfManaged ? "氏名" : "会社名"}
              </label>
              <input
                type="text"
                defaultValue={company?.name || ""}
                className="input"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[13px] font-medium text-text-secondary mb-1">電話番号</label>
                <input
                  type="text"
                  defaultValue={company?.phone || ""}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-text-secondary mb-1">メール</label>
                <input
                  type="email"
                  defaultValue={company?.email || ""}
                  className="input"
                />
              </div>
            </div>
            <div>
              <label className="block text-[13px] font-medium text-text-secondary mb-1">住所</label>
              <input
                type="text"
                defaultValue={company?.address || ""}
                className="input"
              />
            </div>
          </div>
        </div>

        {/* プラン */}
        <div className="card p-5">
          <h2 className="text-[14px] font-semibold mb-4">プラン</h2>
          <div className="flex items-center justify-between p-3.5 rounded bg-bg-secondary">
            <div>
              <p className="text-[13px] font-medium">{company?.plan === "pro" ? "プロプラン" : "フリープラン"}</p>
              <p className="text-[12px] text-text-muted mt-0.5">管理区画数 {company?.max_units || 10}区画まで</p>
            </div>
            <button className="btn-primary">
              プランを変更
            </button>
          </div>
        </div>

        {/* デフォルト設定 */}
        <div className="card p-5">
          <h2 className="text-[14px] font-semibold mb-4">デフォルト設定</h2>
          <div className="space-y-3">
            <div className={`grid ${isSelfManaged ? "grid-cols-1" : "grid-cols-2"} gap-3`}>
              {!isSelfManaged && (
                <div>
                  <label className="block text-[13px] font-medium text-text-secondary mb-1">管理手数料率（%）</label>
                  <input
                    type="number"
                    defaultValue="5.0"
                    step="0.1"
                    className="input"
                  />
                </div>
              )}
              <div>
                <label className="block text-[13px] font-medium text-text-secondary mb-1">家賃支払期限（毎月N日）</label>
                <input
                  type="number"
                  defaultValue="27"
                  className="input"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="btn-primary px-8">
            保存
          </button>
        </div>
      </div>
    </>
  );
}
