"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { expenseSchema } from "@/lib/schemas-expense";
import type { ZodError } from "zod";

interface SelectOption {
  id: string;
  label: string;
}

interface ExpenseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  properties: SelectOption[];
  owners: SelectOption[];
  editData?: Record<string, any> | null;
}

export default function ExpenseFormModal({
  isOpen,
  onClose,
  properties,
  owners,
  editData,
}: ExpenseFormModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [apiError, setApiError] = useState("");
  const [isOwnerCharge, setIsOwnerCharge] = useState(editData?.is_owner_charge ?? false);

  if (!isOpen) return null;

  const isEdit = !!editData;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setApiError("");

    const formData = new FormData(e.currentTarget);
    const data: Record<string, any> = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    data.is_owner_charge = isOwnerCharge;

    try {
      const parsed = expenseSchema.parse(data);
      setLoading(true);

      const url = isEdit ? `/api/expenses/${editData!.id}` : "/api/expenses";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });

      if (!res.ok) {
        const err = await res.json();
        setApiError(err.error || "エラーが発生しました");
        return;
      }

      onClose();
      router.refresh();
    } catch (err) {
      const zodErr = err as ZodError;
      if (zodErr.flatten) {
        setErrors(zodErr.flatten().fieldErrors as Record<string, string[]>);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-card rounded-2xl shadow-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[15px] font-semibold">
            {isEdit ? "経費を編集" : "経費を登録"}
          </h2>
          <button onClick={onClose} className="text-text-muted hover:text-text transition-colors">
            <X size={18} />
          </button>
        </div>

        {apiError && (
          <div className="bg-danger-bg text-danger text-sm rounded-lg px-3 py-2 mb-4">{apiError}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-text-secondary block mb-1">
                カテゴリ <span className="text-danger">*</span>
              </label>
              <select name="category" defaultValue={editData?.category || ""} className="input">
                <option value="">選択してください</option>
                <option value="repair">修繕費</option>
                <option value="cleaning">清掃費</option>
                <option value="insurance">保険料</option>
                <option value="tax">税金</option>
                <option value="utility">光熱費</option>
                <option value="other">その他</option>
              </select>
              {errors.category && <p className="text-danger text-sm mt-1">{errors.category[0]}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-text-secondary block mb-1">
                日付 <span className="text-danger">*</span>
              </label>
              <input
                name="expense_date"
                type="date"
                defaultValue={editData?.expense_date || new Date().toISOString().slice(0, 10)}
                className="input"
              />
              {errors.expense_date && <p className="text-danger text-sm mt-1">{errors.expense_date[0]}</p>}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-text-secondary block mb-1">
              内容 <span className="text-danger">*</span>
            </label>
            <input
              name="description"
              defaultValue={editData?.description || ""}
              className="input"
              placeholder="例: エアコン修理"
            />
            {errors.description && <p className="text-danger text-sm mt-1">{errors.description[0]}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-text-secondary block mb-1">
              金額 <span className="text-danger">*</span>
            </label>
            <input
              name="amount"
              type="number"
              defaultValue={editData?.amount || ""}
              className="input"
              placeholder="例: 50000"
            />
            {errors.amount && <p className="text-danger text-sm mt-1">{errors.amount[0]}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-text-secondary block mb-1">物件</label>
              <select name="property_id" defaultValue={editData?.property_id || ""} className="input">
                <option value="">未指定</option>
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-text-secondary block mb-1">オーナー</label>
              <select name="owner_id" defaultValue={editData?.owner_id || ""} className="input">
                <option value="">未指定</option>
                {owners.map((o) => (
                  <option key={o.id} value={o.id}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isOwnerCharge}
                onChange={(e) => setIsOwnerCharge(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-text-secondary">オーナー負担（送金時に控除）</span>
            </label>
          </div>

          <div>
            <label className="text-sm font-medium text-text-secondary block mb-1">備考</label>
            <textarea
              name="notes"
              defaultValue={editData?.notes || ""}
              className="input"
              rows={2}
              placeholder="メモ"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-bg-secondary text-text-secondary rounded-lg px-4 py-2 text-sm hover:bg-border-light transition-colors"
            >
              キャンセル
            </button>
            <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
              {loading ? "保存中..." : isEdit ? "更新する" : "登録する"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
