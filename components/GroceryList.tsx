"use client";

import type { GroceryItem } from "@/lib/types";
import { CATEGORIES } from "@/lib/types";
import type { Lang, Translations } from "@/lib/i18n";

interface Props {
  items: GroceryItem[];
  t: Translations;
  lang: Lang;
  onToggle: (id: string, bought: boolean) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
}

export default function GroceryList({ items, t, lang, onToggle, onRemove }: Props) {
  if (items.length === 0) {
    return (
      <div className="text-center text-gray-400 py-16 text-lg">{t.empty}</div>
    );
  }

  const grouped = CATEGORIES.reduce(
    (acc, cat) => {
      const catItems = items.filter((item) => item.category === cat);
      if (catItems.length > 0) acc[cat] = catItems;
      return acc;
    },
    {} as Record<string, GroceryItem[]>,
  );

  return (
    <div className="flex flex-col gap-4" dir={lang === "he" ? "rtl" : "ltr"}>
      {Object.entries(grouped).map(([cat, catItems]) => (
        <section key={cat}>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2 px-1">
            {t.categories[cat] ?? t.uncategorized}
          </h2>
          <div className="flex flex-col gap-1.5">
            {catItems.map((item) => (
              <div
                key={item.id}
                className={`flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm
                            border border-gray-100 transition-opacity ${
                              item.bought ? "opacity-50" : ""
                            }`}
              >
                <button
                  onClick={() => onToggle(item.id, item.bought)}
                  className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center
                              transition-colors ${
                                item.bought
                                  ? "bg-emerald-500 border-emerald-500 text-white"
                                  : "border-gray-300"
                              }`}
                >
                  {item.bought && (
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
                <div className="flex-1 min-w-0">
                  <span
                    className={`text-base ${item.bought ? "line-through text-gray-400" : "text-gray-800"}`}
                  >
                    {item.name}
                  </span>
                  {item.amount && (
                    <span className="text-sm text-gray-400 ms-2">{item.amount}</span>
                  )}
                </div>
                <button
                  onClick={() => onRemove(item.id)}
                  className="text-gray-300 hover:text-red-400 transition-colors p-1 flex-shrink-0"
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
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
