"use client";

import { useState, useEffect } from "react";
import { CATEGORIES } from "@/lib/types";
import type { GroceryItem } from "@/lib/types";
import type { Lang, Translations } from "@/lib/i18n";

interface Props {
  t: Translations;
  lang: Lang;
  customCategories: string[];
  onAdd: (name: string, amount: string | null, category: string) => Promise<void>;
  editingItem?: GroceryItem | null;
  onUpdate?: (id: string, name: string, amount: string | null, category: string) => Promise<void>;
  onCancelEdit?: () => void;
}

export default function AddItemForm({ t, lang, customCategories, onAdd, editingItem, onUpdate, onCancelEdit }: Props) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("other");
  const [customCategoryName, setCustomCategoryName] = useState("");
  const [open, setOpen] = useState(false);

  const isEditing = !!editingItem;

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      setAmount(editingItem.amount ?? "");
      const isBuiltIn = (CATEGORIES as readonly string[]).includes(editingItem.category);
      if (isBuiltIn) {
        setCategory(editingItem.category);
        setCustomCategoryName("");
      } else {
        setCategory("__custom");
        setCustomCategoryName(editingItem.category);
      }
      setOpen(true);
    }
  }, [editingItem]);

  function resetForm() {
    setName("");
    setAmount("");
    setCategory("other");
    setCustomCategoryName("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    const finalCategory = category === "__custom" ? customCategoryName.trim() : category;
    if (category === "__custom" && !finalCategory) return;

    if (isEditing && onUpdate) {
      await onUpdate(editingItem!.id, name.trim(), amount.trim() || null, finalCategory);
      onCancelEdit?.();
    } else {
      await onAdd(name.trim(), amount.trim() || null, finalCategory);
    }
    resetForm();
    setOpen(false);
  }

  function handleCancel() {
    if (isEditing) {
      onCancelEdit?.();
    }
    resetForm();
    setOpen(false);
  }

  if (!open && !isEditing) {
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

  const allCategories = [...CATEGORIES, ...customCategories];

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
        onChange={(e) => {
          setCategory(e.target.value);
          if (e.target.value !== "__custom") setCustomCategoryName("");
        }}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-base
                   focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-gray-50 appearance-none"
      >
        {allCategories.map((cat) => (
          <option key={cat} value={cat}>
            {t.categories[cat] ?? cat}
          </option>
        ))}
        <option value="__custom">+ {t.categories.other}...</option>
      </select>
      {category === "__custom" && (
        <input
          autoFocus
          type="text"
          placeholder={t.customCategory}
          value={customCategoryName}
          onChange={(e) => setCustomCategoryName(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-base
                     focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-gray-50"
        />
      )}
      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 py-3 rounded-xl bg-emerald-500 text-white font-semibold
                     active:scale-95 transition-transform"
        >
          {isEditing ? t.save : t.addItem}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="px-5 py-3 rounded-xl bg-gray-100 text-gray-600 font-medium
                     active:scale-95 transition-transform"
        >
          {isEditing ? t.cancel : "✕"}
        </button>
      </div>
    </form>
  );
}
