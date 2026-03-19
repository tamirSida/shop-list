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
    edit: "ערוך",
    save: "שמור",
    cancel: "ביטול",
    search: "חיפוש...",
    allCategories: "הכל",
    customCategory: "שם קטגוריה...",
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
    edit: "Edit",
    save: "Save",
    cancel: "Cancel",
    search: "Search...",
    allCategories: "All",
    customCategory: "Category name...",
  },
} as const;

export type Translations = {
  title: string;
  addItem: string;
  itemName: string;
  amount: string;
  category: string;
  categories: Record<string, string>;
  delete: string;
  empty: string;
  loading: string;
  langSwitch: string;
  bought: string;
  uncategorized: string;
  edit: string;
  save: string;
  cancel: string;
  search: string;
  allCategories: string;
  customCategory: string;
};

export function t(lang: Lang): Translations {
  return translations[lang];
}

export function isRTL(lang: Lang): boolean {
  return lang === "he";
}
