"use client";

import { useState } from "react";
import { useGroceryList } from "@/lib/useGroceryList";
import { t as getT, isRTL, type Lang } from "@/lib/i18n";
import Image from "next/image";
import AddItemForm from "@/components/AddItemForm";
import GroceryList from "@/components/GroceryList";
import LoadingScreen from "@/components/LoadingScreen";

export default function Home() {
  const [lang, setLang] = useState<Lang>("he");
  const { items, loading, addItem, toggleBought, removeItem } = useGroceryList();
  const tr = getT(lang);

  if (loading) return <LoadingScreen />;

  return (
    <main
      dir={isRTL(lang) ? "rtl" : "ltr"}
      className="flex flex-col min-h-dvh bg-gray-50"
    >
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <h1 className="text-xl font-bold text-gray-800">{tr.title}</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang((l) => (l === "he" ? "en" : "he"))}
              className="px-3 py-1.5 rounded-lg bg-gray-100 text-sm font-medium text-gray-600
                         active:scale-95 transition-transform"
            >
              {tr.langSwitch}
            </button>
            <Image
              src="/load.jpg"
              alt="Logo"
              width={36}
              height={36}
              className="rounded-full object-cover w-9 h-9"
            />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 px-4 py-4 max-w-lg mx-auto w-full">
        <div className="mb-4">
          <AddItemForm t={tr} lang={lang} onAdd={addItem} />
        </div>
        <GroceryList
          items={items}
          t={tr}
          lang={lang}
          onToggle={toggleBought}
          onRemove={removeItem}
        />
      </div>
    </main>
  );
}
