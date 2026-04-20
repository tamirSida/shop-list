"use client";

import { useState } from "react";
import type { Buyer } from "@/lib/types";
import type { Lang, Translations } from "@/lib/i18n";
import BuyerSelect from "./BuyerSelect";

interface Props {
  t: Translations;
  lang: Lang;
  buyers: Buyer[];
  onAddToBuy: (name: string, amount: string | null) => Promise<void>;
  onAddBought: (
    name: string,
    amount: string | null,
    price: number,
    buyer: string,
  ) => Promise<void>;
}

type Mode = "toBuy" | "bought";

export default function AddItemForm({
  t,
  lang,
  buyers,
  onAddToBuy,
  onAddBought,
}: Props) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("toBuy");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");
  const [buyer, setBuyer] = useState("");

  function reset() {
    setName("");
    setAmount("");
    setPrice("");
    setBuyer("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    if (mode === "toBuy") {
      await onAddToBuy(name.trim(), amount.trim() || null);
    } else {
      const p = Number(price);
      if (!Number.isFinite(p) || p < 0) return;
      if (!buyer.trim()) return;
      await onAddBought(name.trim(), amount.trim() || null, p, buyer.trim());
    }
    reset();
    setOpen(false);
  }

  if (!open) {
    return (
      <div className="flex gap-2">
        <button
          onClick={() => {
            setMode("toBuy");
            setOpen(true);
          }}
          className="flex-1 py-3 rounded-2xl bg-emerald-500 text-white font-semibold text-base
                     active:scale-95 transition-transform shadow-lg"
        >
          + {t.addToBuy}
        </button>
        <button
          onClick={() => {
            setMode("bought");
            setOpen(true);
          }}
          className="flex-1 py-3 rounded-2xl bg-indigo-500 text-white font-semibold text-base
                     active:scale-95 transition-transform shadow-lg"
        >
          + {t.addBought}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      dir={lang === "he" ? "rtl" : "ltr"}
      className="flex flex-col gap-3 bg-white rounded-2xl p-4 shadow-lg border border-gray-100"
    >
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode("toBuy")}
          className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
            mode === "toBuy"
              ? "bg-emerald-500 text-white"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {t.addToBuy}
        </button>
        <button
          type="button"
          onClick={() => setMode("bought")}
          className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
            mode === "bought"
              ? "bg-indigo-500 text-white"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {t.addBought}
        </button>
      </div>

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

      {mode === "bought" && (
        <>
          <input
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            placeholder={t.price}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-base
                       focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-gray-50"
          />
          <BuyerSelect t={t} buyers={buyers} value={buyer} onChange={setBuyer} />
        </>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 py-3 rounded-xl bg-emerald-500 text-white font-semibold
                     active:scale-95 transition-transform"
        >
          {t.save}
        </button>
        <button
          type="button"
          onClick={() => {
            reset();
            setOpen(false);
          }}
          className="px-5 py-3 rounded-xl bg-gray-100 text-gray-600 font-medium
                     active:scale-95 transition-transform"
        >
          {t.cancel}
        </button>
      </div>
    </form>
  );
}
