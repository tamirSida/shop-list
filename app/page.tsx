"use client";

import { useState, useMemo } from "react";
import { useGroceryList } from "@/lib/useGroceryList";
import { t as getT, isRTL, type Lang } from "@/lib/i18n";
import { CATEGORIES, type GroceryItem } from "@/lib/types";
import Image from "next/image";
import AddItemForm from "@/components/AddItemForm";
import GroceryList from "@/components/GroceryList";
import LoadingScreen from "@/components/LoadingScreen";

export default function Home() {
  const [lang, setLang] = useState<Lang>("he");
  const { items, loading, addItem, updateItem, toggleBought, removeItem } = useGroceryList();
  const tr = getT(lang);

  const [editingItem, setEditingItem] = useState<GroceryItem | null>(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  // Derive custom categories from items
  const customCategories = useMemo(() => {
    return [...new Set(
      items
        .map((i) => i.category)
        .filter((c) => !(CATEGORIES as readonly string[]).includes(c))
    )];
  }, [items]);

  const filteredItems = useMemo(() => {
    let result = items;
    if (filterCategory) {
      result = result.filter((i) => i.category === filterCategory);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (i) => i.name.toLowerCase().includes(q) || (i.amount && i.amount.toLowerCase().includes(q))
      );
    }
    return result;
  }, [items, filterCategory, search]);

  // All category keys for filter pills
  const allCategoryKeys = [...CATEGORIES, ...customCategories];

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
          <AddItemForm
            t={tr}
            lang={lang}
            customCategories={customCategories}
            onAdd={addItem}
            editingItem={editingItem}
            onUpdate={updateItem}
            onCancelEdit={() => setEditingItem(null)}
          />
        </div>

        {/* Search */}
        <div className="mb-3">
          <input
            type="text"
            placeholder={tr.search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-base
                       focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
          />
        </div>

        {/* Category filter pills */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setFilterCategory(null)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
                       ${filterCategory === null
                         ? "bg-emerald-500 text-white"
                         : "bg-gray-100 text-gray-600"}`}
          >
            {tr.allCategories}
          </button>
          {allCategoryKeys.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(filterCategory === cat ? null : cat)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
                         ${filterCategory === cat
                           ? "bg-emerald-500 text-white"
                           : "bg-gray-100 text-gray-600"}`}
            >
              {tr.categories[cat] ?? cat}
            </button>
          ))}
        </div>

        <GroceryList
          items={filteredItems}
          t={tr}
          lang={lang}
          onToggle={toggleBought}
          onRemove={removeItem}
          onEdit={setEditingItem}
        />
      </div>
    </main>
  );
}
