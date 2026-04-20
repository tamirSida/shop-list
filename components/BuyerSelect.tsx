"use client";

import { useState } from "react";
import type { Buyer } from "@/lib/types";
import type { Translations } from "@/lib/i18n";

interface Props {
  t: Translations;
  buyers: Buyer[];
  value: string;
  onChange: (name: string) => void;
}

export default function BuyerSelect({ t, buyers, value, onChange }: Props) {
  const [mode, setMode] = useState<"select" | "other">(
    value && !buyers.some((b) => b.name === value) ? "other" : "select",
  );

  if (mode === "other") {
    return (
      <div className="flex gap-2">
        <input
          autoFocus
          type="text"
          placeholder={t.newBuyerName}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-base
                     focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-gray-50"
        />
        <button
          type="button"
          onClick={() => {
            onChange("");
            setMode("select");
          }}
          className="px-4 py-3 rounded-xl bg-gray-100 text-gray-600 text-sm font-medium
                     active:scale-95 transition-transform"
        >
          ↩
        </button>
      </div>
    );
  }

  return (
    <select
      value={value}
      onChange={(e) => {
        if (e.target.value === "__other") {
          onChange("");
          setMode("other");
        } else {
          onChange(e.target.value);
        }
      }}
      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-base
                 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-gray-50 appearance-none"
    >
      <option value="">{t.buyerPlaceholder}</option>
      {buyers.map((b) => (
        <option key={b.id} value={b.name}>
          {b.name}
        </option>
      ))}
      <option value="__other">+ {t.otherBuyer}</option>
    </select>
  );
}
