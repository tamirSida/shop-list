"use client";

import { useMemo } from "react";
import type { PartyItem } from "@/lib/types";
import type { Lang, Translations } from "@/lib/i18n";

interface Props {
  items: PartyItem[];
  t: Translations;
  lang: Lang;
}

function formatMoney(n: number) {
  return n.toLocaleString(undefined, {
    style: "currency",
    currency: "ILS",
    maximumFractionDigits: 2,
  });
}

export default function Dashboard({ items, t, lang }: Props) {
  const { total, byBuyer } = useMemo(() => {
    const bought = items.filter((i) => i.bought && i.price != null);
    const total = bought.reduce((sum, i) => sum + (i.price ?? 0), 0);
    const map = new Map<string, { total: number; count: number }>();
    for (const i of bought) {
      const key = i.buyer ?? "—";
      const cur = map.get(key) ?? { total: 0, count: 0 };
      cur.total += i.price ?? 0;
      cur.count += 1;
      map.set(key, cur);
    }
    const byBuyer = Array.from(map.entries())
      .map(([buyer, v]) => ({ buyer, ...v }))
      .sort((a, b) => b.total - a.total);
    return { total, byBuyer };
  }, [items]);

  const max = byBuyer[0]?.total ?? 0;

  return (
    <div className="flex flex-col gap-4" dir={lang === "he" ? "rtl" : "ltr"}>
      <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl p-5 shadow-lg">
        <div className="text-sm opacity-80">{t.totalSpent}</div>
        <div className="text-3xl font-bold mt-1">{formatMoney(total)}</div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2 px-1">
          {t.byBuyer}
        </h2>
        {byBuyer.length === 0 ? (
          <div className="text-center text-gray-400 py-10">{t.emptyBought}</div>
        ) : (
          <div className="flex flex-col gap-2">
            {byBuyer.map((row) => {
              const pct = max > 0 ? (row.total / max) * 100 : 0;
              return (
                <div
                  key={row.buyer}
                  className="bg-white rounded-xl p-3 shadow-sm border border-gray-100"
                >
                  <div className="flex justify-between items-baseline mb-1.5">
                    <span className="font-medium text-gray-800">{row.buyer}</span>
                    <span className="text-gray-500 text-sm">
                      {formatMoney(row.total)}
                      <span className="text-gray-400 ms-2">
                        ({row.count} {t.items})
                      </span>
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-400 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
