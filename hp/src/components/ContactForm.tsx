"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

const INQUIRY_TYPES = [
  "サービスについて",
  "導入のご相談",
  "料金について",
  "協業・パートナーシップ",
  "投資・事業提携",
  "その他",
];

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    type: INQUIRY_TYPES[0],
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();
      setStatus("sent");
      setForm({ name: "", email: "", company: "", type: INQUIRY_TYPES[0], message: "" });
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="mx-auto max-w-xl rounded bg-rm-surface p-10 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rm-accent/10">
          <CheckCircle2 size={24} className="text-rm-accent" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-rm-primary">
          送信しました
        </h3>
        <p className="mt-2 text-[13px] text-rm-text-secondary">
          お問い合わせありがとうございます。担当者より折り返しご連絡いたします。
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 text-[13px] text-rm-accent underline hover:no-underline"
        >
          続けてお問い合わせする
        </button>
      </div>
    );
  }

  const inputClass =
    "mt-1 w-full rounded border border-rm-border px-4 py-2.5 text-[13px] transition-all focus:border-rm-accent focus:outline-none focus:ring-1 focus:ring-rm-accent/20";

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-xl rounded bg-rm-surface p-8 shadow-sm"
    >
      <div className="space-y-5">
        <div>
          <label className="block text-[13px] font-medium text-rm-text">
            お問い合わせ種別
          </label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className={inputClass}
          >
            {INQUIRY_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-[13px] font-medium text-rm-text">
              お名前 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-rm-text">
              会社名
            </label>
            <input
              type="text"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-[13px] font-medium text-rm-text">
            メールアドレス <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-[13px] font-medium text-rm-text">
            お問い合わせ内容 <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={5}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className={`${inputClass} resize-none`}
          />
        </div>
      </div>

      {status === "error" && (
        <p className="mt-4 text-[13px] text-red-600">
          送信に失敗しました。時間をおいて再度お試しください。
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-6 w-full rounded bg-rm-accent py-3 text-[13px] font-medium text-white transition-colors hover:bg-rm-accent-light disabled:opacity-50"
      >
        {status === "sending" ? "送信中..." : "送信する"}
      </button>
    </form>
  );
}
