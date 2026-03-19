"use client";

import { useState } from "react";
import { CATEGORIES } from "@/lib/types";
import type { Lang, Translations } from "@/lib/i18n";

interface Props {
  t: Translations;
  lang: Lang;
  onAdd: (name: string, amount: string | null, category: string) => Promise<void>;
}

export default function AddItemForm({ t, lang, onAdd }: Props) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("other");
  const [open, setOpen] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    await onAdd(name.trim(), amount.trim() || null, category);
    setName("");
    setAmount("");
    setCategory("other");
    setOpen(false);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full py-3 rounded-2xl bg-emerald-500 text-white font-semibold text-lg
                   active:scale-95 transition-transform shadow-lg"
      >
        + {t.addItem}
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      dir={lang === "he" ? "rtl" : "ltr"}
      className="flex flex-col gap-3 bg-white rounded-2xl p-4 shadow-lg border border-gray-100"
    >
      <input
        autoFocus
        type="text"
        placeholder={t.itemName}
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-base
                   focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-gray-50"
      />
      <input
        type="text"
        placeholder={t.amount}
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-base
                   focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-gray-50"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-base
                   focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-gray-50 appearance-none"
      >
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {t.categories[cat]}
          </option>
        ))}
      </select>
      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 py-3 rounded-xl bg-emerald-500 text-white font-semibold
                     active:scale-95 transition-transform"
        >
          {t.addItem}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="px-5 py-3 rounded-xl bg-gray-100 text-gray-600 font-medium
                     active:scale-95 transition-transform"
        >
          ✕
        </button>
      </div>
    </form>
  );
}
