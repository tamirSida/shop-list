export type Lang = "he" | "en";

const translations = {
  he: {
    title: "הוצאות מסיבה",
    tabToBuy: "לקנות",
    tabBought: "נקנה",
    tabDashboard: "סיכום",
    addToBuy: "הוסף פריט",
    addBought: "הוסף קנייה",
    itemName: "שם הפריט",
    amount: "כמות",
    price: "מחיר",
    buyer: "קונה",
    buyerPlaceholder: "בחר קונה",
    otherBuyer: "אחר...",
    newBuyerName: "שם הקונה",
    markBought: "סמן כנקנה",
    markSelected: "סמן נבחרים",
    selectAll: "בחר הכל",
    clearSelection: "נקה",
    delete: "מחק",
    edit: "ערוך",
    save: "שמור",
    cancel: "ביטול",
    confirm: "אישור",
    search: "חיפוש...",
    empty: "אין פריטים",
    emptyBought: "עדיין לא נקנה כלום",
    loading: "טוען...",
    langSwitch: "EN",
    totalSpent: "סה״כ הוצאה",
    byBuyer: "לפי קונה",
    items: "פריטים",
    pricePlaceholder: "סכום כולל",
    selectedCount: (n: number) => `נבחרו ${n}`,
  },
  en: {
    title: "Party Expenses",
    tabToBuy: "To Buy",
    tabBought: "Bought",
    tabDashboard: "Dashboard",
    addToBuy: "Add Item",
    addBought: "Add Purchase",
    itemName: "Item name",
    amount: "Quantity",
    price: "Price",
    buyer: "Buyer",
    buyerPlaceholder: "Select buyer",
    otherBuyer: "Other...",
    newBuyerName: "Buyer name",
    markBought: "Mark as bought",
    markSelected: "Mark selected",
    selectAll: "Select all",
    clearSelection: "Clear",
    delete: "Delete",
    edit: "Edit",
    save: "Save",
    cancel: "Cancel",
    confirm: "Confirm",
    search: "Search...",
    empty: "No items",
    emptyBought: "Nothing bought yet",
    loading: "Loading...",
    langSwitch: "עב",
    totalSpent: "Total spent",
    byBuyer: "By buyer",
    items: "items",
    pricePlaceholder: "Total price",
    selectedCount: (n: number) => `${n} selected`,
  },
} as const;

export type Translations = (typeof translations)[Lang];

export function t(lang: Lang): Translations {
  return translations[lang];
}

export function isRTL(lang: Lang): boolean {
  return lang === "he";
}
