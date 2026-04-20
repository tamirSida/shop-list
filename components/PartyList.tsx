"use client";

import type { PartyItem } from "@/lib/types";
import type { Lang, Translations } from "@/lib/i18n";

interface Props {
  items: PartyItem[];
  t: Translations;
  lang: Lang;
  mode: "toBuy" | "bought";
  selected?: Set<string>;
  onToggleSelect?: (id: string) => void;
  onRemove: (id: string) => Promise<void>;
}

function formatMoney(n: number) {
  return n.toLocaleString(undefined, {
    style: "currency",
    currency: "ILS",
    maximumFractionDigits: 2,
  });
}

export default function PartyList({
  items,
  t,
  lang,
  mode,
  selected,
  onToggleSelect,
  onRemove,
}: Props) {
  if (items.length === 0) {
    return (
      <div className="text-center text-gray-400 py-16 text-lg">
        {mode === "bought" ? t.emptyBought : t.empty}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5" dir={lang === "he" ? "rtl" : "ltr"}>
      {items.map((item) => {
        const isSelected = selected?.has(item.id) ?? false;
        return (
          <div
            key={item.id}
            className={`flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm
                        border transition-colors ${
                          isSelected
                            ? "border-emerald-400 bg-emerald-50"
                            : "border-gray-100"
                        }`}
          >
            {mode === "toBuy" && onToggleSelect && (
              <button
                onClick={() => onToggleSelect(item.id)}
                className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center
                            transition-colors ${
                              isSelected
                                ? "bg-emerald-500 border-emerald-500 text-white"
                                : "border-gray-300"
                            }`}
                aria-label="select"
              >
                {isSelected && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2 6L5 9L10 3"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            )}

            <div className="flex-1 min-w-0">
              <div className="text-base text-gray-800 truncate">{item.name}</div>
              <div className="text-sm text-gray-400 flex gap-2 flex-wrap">
                {item.amount && <span>{item.amount}</span>}
                {mode === "bought" && item.price != null && (
                  <span className="text-indigo-600 font-medium">
                    {formatMoney(item.price)}
                  </span>
                )}
                {mode === "bought" && item.buyer && (
                  <span className="text-gray-500">· {item.buyer}</span>
                )}
              </div>
            </div>

            <button
              onClick={() => onRemove(item.id)}
              className="text-gray-300 hover:text-red-400 transition-colors p-1 flex-shrink-0"
              aria-label={t.delete}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M4 4L14 14M14 4L4 14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        );
      })}
    </div>
  );
}
