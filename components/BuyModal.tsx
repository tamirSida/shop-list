"use client";

import { useState } from "react";
import type { Buyer, PartyItem } from "@/lib/types";
import type { Lang, Translations } from "@/lib/i18n";
import BuyerSelect from "./BuyerSelect";

interface Props {
  t: Translations;
  lang: Lang;
  items: PartyItem[];
  buyers: Buyer[];
  onConfirm: (price: number, buyer: string) => Promise<void>;
  onClose: () => void;
}

export default function BuyModal({ t, lang, items, buyers, onConfirm, onClose }: Props) {
  const [price, setPrice] = useState("");
  const [buyer, setBuyer] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const p = Number(price);
    if (!Number.isFinite(p) || p < 0) return;
    if (!buyer.trim()) return;
    setSubmitting(true);
    try {
      await onConfirm(p, buyer.trim());
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-20 p-3"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        dir={lang === "he" ? "rtl" : "ltr"}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white rounded-2xl p-4 shadow-xl flex flex-col gap-3"
      >
        <h2 className="text-lg font-bold text-gray-800">{t.markBought}</h2>

        <div className="max-h-48 overflow-y-auto bg-gray-50 rounded-xl p-3 flex flex-col gap-1">
          {items.map((i) => (
            <div key={i.id} className="text-sm text-gray-700">
              • {i.name}
              {i.amount && <span className="text-gray-400 ms-1">({i.amount})</span>}
            </div>
          ))}
        </div>

        <input
          autoFocus
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
          placeholder={t.pricePlaceholder}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-base
                     focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-gray-50"
        />

        <BuyerSelect t={t} buyers={buyers} value={buyer} onChange={setBuyer} />

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 py-3 rounded-xl bg-emerald-500 text-white font-semibold
                       active:scale-95 transition-transform disabled:opacity-50"
          >
            {t.confirm}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-3 rounded-xl bg-gray-100 text-gray-600 font-medium
                       active:scale-95 transition-transform"
          >
            {t.cancel}
          </button>
        </div>
      </form>
    </div>
  );
}
