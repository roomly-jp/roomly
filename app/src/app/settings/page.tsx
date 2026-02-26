import PageHeader from "@/components/PageHeader";

export default function SettingsPage() {
  return (
    <>
      <PageHeader title="設定" description="会社情報・アカウント設定" />

      <div className="max-w-2xl space-y-6">
        {/* 会社情報 */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="font-semibold mb-4">会社情報</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-text-secondary mb-1">会社名</label>
              <input
                type="text"
                defaultValue="サンプル不動産管理"
                className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-bg focus:outline-none focus:border-accent"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-text-secondary mb-1">電話番号</label>
                <input
                  type="text"
                  defaultValue="03-1234-5678"
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-bg focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1">メール</label>
                <input
                  type="email"
                  defaultValue="info@sample-estate.co.jp"
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-bg focus:outline-none focus:border-accent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1">住所</label>
              <input
                type="text"
                defaultValue="東京都新宿区西新宿1-1-1"
                className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-bg focus:outline-none focus:border-accent"
              />
            </div>
          </div>
        </div>

        {/* プラン */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="font-semibold mb-4">プラン</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">フリープラン</p>
              <p className="text-sm text-text-secondary">管理戸数 50戸まで</p>
            </div>
            <button className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-light transition-colors">
              プランを変更
            </button>
          </div>
        </div>

        {/* デフォルト設定 */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="font-semibold mb-4">デフォルト設定</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-text-secondary mb-1">管理手数料率（%）</label>
                <input
                  type="number"
                  defaultValue="5.0"
                  step="0.1"
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-bg focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1">家賃支払期限（毎月N日）</label>
                <input
                  type="number"
                  defaultValue="27"
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-bg focus:outline-none focus:border-accent"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="px-6 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-light transition-colors">
            保存
          </button>
        </div>
      </div>
    </>
  );
}
