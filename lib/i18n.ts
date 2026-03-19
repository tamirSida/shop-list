export type Lang = "he" | "en";

const translations = {
  he: {
    title: "רשימת קניות",
    addItem: "הוסף פריט",
    itemName: "שם הפריט",
    amount: "כמות",
    category: "קטגוריה",
    categories: {
      super: "סופר",
      pharm: "פארם",
      food: "אוכל",
      snacks: "שטויות",
      other: "אחר",
    } as Record<string, string>,
    delete: "מחק",
    empty: "הרשימה ריקה",
    loading: "טוען...",
    langSwitch: "EN",
    bought: "נקנה",
    uncategorized: "אחר",
  },
  en: {
    title: "Grocery List",
    addItem: "Add Item",
    itemName: "Item name",
    amount: "Amount",
    category: "Category",
    categories: {
      super: "Supermarket",
      pharm: "Pharmacy",
      food: "Food",
      snacks: "Snacks",
      other: "Other",
    } as Record<string, string>,
    delete: "Delete",
    empty: "List is empty",
    loading: "Loading...",
    langSwitch: "עב",
    bought: "Bought",
    uncategorized: "Other",
  },
} as const;

export type Translations = (typeof translations)["en"];

export function t(lang: Lang): Translations {
  return translations[lang];
}

export function isRTL(lang: Lang): boolean {
  return lang === "he";
}
