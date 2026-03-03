import { getCompany } from "@/lib/queries";
import PageHeader from "@/components/PageHeader";

export default async function SettingsPage() {
  const company = await getCompany();
  const isSelfManaged = company?.usage_type === "self_managed";

  return (
    <>
      <PageHeader title="設定" description="アカウント・利用設定" />

      <div className="max-w-2xl space-y-6">
        {/* 利用形態 */}
        <div className="card p-6">
          <h2 className="font-semibold mb-2 text-lg">利用形態</h2>
          <p className="text-sm text-text-muted mb-5">
            管理会社として利用する場合と、物件オーナー自身が自主管理する場合で表示が変わります。
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label
              className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                !isSelfManaged
                  ? "border-accent bg-accent/5"
                  : "border-border hover:border-border-light"
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
                <p className="font-medium text-sm">管理会社</p>
                <p className="text-xs text-text-muted mt-0.5">
                  複数オーナーの物件を受託管理
                </p>
              </div>
            </label>
            <label
              className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                isSelfManaged
                  ? "border-accent bg-accent/5"
                  : "border-border hover:border-border-light"
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
                <p className="font-medium text-sm">自主管理オーナー</p>
                <p className="text-xs text-text-muted mt-0.5">
                  自分の物件を自分で管理
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* 会社 / オーナー情報 */}
        <div className="card p-6">
          <h2 className="font-semibold mb-5 text-lg">
            {isSelfManaged ? "オーナー情報" : "会社情報"}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                {isSelfManaged ? "氏名" : "会社名"}
              </label>
              <input
                type="text"
                defaultValue={company?.name || ""}
                className="input"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">電話番号</label>
                <input
                  type="text"
                  defaultValue={company?.phone || ""}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">メール</label>
                <input
                  type="email"
                  defaultValue={company?.email || ""}
                  className="input"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">住所</label>
              <input
                type="text"
                defaultValue={company?.address || ""}
                className="input"
              />
            </div>
          </div>
        </div>

        {/* プラン */}
        <div className="card p-6">
          <h2 className="font-semibold mb-5 text-lg">プラン</h2>
          <div className="flex items-center justify-between p-4 rounded-xl bg-bg-secondary">
            <div>
              <p className="font-medium">{company?.plan === "pro" ? "プロプラン" : "フリープラン"}</p>
              <p className="text-sm text-text-muted mt-0.5">管理区画数 {company?.max_units || 10}区画まで</p>
            </div>
            <button className="btn-primary">
              プランを変更
            </button>
          </div>
        </div>

        {/* デフォルト設定（管理会社モードのみ管理手数料を表示） */}
        <div className="card p-6">
          <h2 className="font-semibold mb-5 text-lg">デフォルト設定</h2>
          <div className="space-y-4">
            <div className={`grid ${isSelfManaged ? "grid-cols-1" : "grid-cols-2"} gap-4`}>
              {!isSelfManaged && (
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">管理手数料率（%）</label>
                  <input
                    type="number"
                    defaultValue="5.0"
                    step="0.1"
                    className="input"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">家賃支払期限（毎月N日）</label>
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
