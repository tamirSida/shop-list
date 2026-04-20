"use client";

import { useMemo, useState } from "react";
import { useParty } from "@/lib/useParty";
import { t as getT, isRTL, type Lang } from "@/lib/i18n";
import AddItemForm from "@/components/AddItemForm";
import PartyList from "@/components/PartyList";
import BuyModal from "@/components/BuyModal";
import Dashboard from "@/components/Dashboard";
import LoadingScreen from "@/components/LoadingScreen";

type Tab = "toBuy" | "bought" | "dashboard";

export default function Home() {
  const [lang, setLang] = useState<Lang>("he");
  const tr = getT(lang);
  const {
    items,
    buyers,
    loading,
    addToBuy,
    addBought,
    markBought,
    removeItem,
  } = useParty();

  const [tab, setTab] = useState<Tab>("toBuy");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [buyModalOpen, setBuyModalOpen] = useState(false);

  const toBuyItems = useMemo(
    () => items.filter((i) => !i.bought),
    [items],
  );
  const boughtItems = useMemo(
    () => items.filter((i) => i.bought),
    [items],
  );

  const visibleItems = useMemo(() => {
    const base = tab === "bought" ? boughtItems : toBuyItems;
    if (!search.trim()) return base;
    const q = search.trim().toLowerCase();
    return base.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        (i.amount?.toLowerCase().includes(q) ?? false) ||
        (i.buyer?.toLowerCase().includes(q) ?? false),
    );
  }, [tab, toBuyItems, boughtItems, search]);

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectAll() {
    setSelected(new Set(toBuyItems.map((i) => i.id)));
  }

  function clearSelection() {
    setSelected(new Set());
  }

  const selectedItems = useMemo(
    () => toBuyItems.filter((i) => selected.has(i.id)),
    [toBuyItems, selected],
  );

  async function handleConfirmBuy(price: number, buyer: string) {
    await markBought(Array.from(selected), price, buyer);
    clearSelection();
  }

  if (loading) return <LoadingScreen />;

  return (
    <main
      dir={isRTL(lang) ? "rtl" : "ltr"}
      className="flex flex-col min-h-dvh bg-gray-50"
    >
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <h1 className="text-xl font-bold text-gray-800">{tr.title}</h1>
          <button
            onClick={() => setLang((l) => (l === "he" ? "en" : "he"))}
            className="px-3 py-1.5 rounded-lg bg-gray-100 text-sm font-medium text-gray-600
                       active:scale-95 transition-transform"
          >
            {tr.langSwitch}
          </button>
        </div>
      </header>

      <div className="flex-1 px-4 py-4 max-w-lg mx-auto w-full">
        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-4">
          {(["toBuy", "bought", "dashboard"] as const).map((key) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
                tab === key
                  ? "bg-white text-gray-800 shadow"
                  : "text-gray-500"
              }`}
            >
              {key === "toBuy"
                ? tr.tabToBuy
                : key === "bought"
                ? tr.tabBought
                : tr.tabDashboard}
            </button>
          ))}
        </div>

        {tab !== "dashboard" && (
          <>
            <div className="mb-4">
              <AddItemForm
                t={tr}
                lang={lang}
                buyers={buyers}
                onAddToBuy={addToBuy}
                onAddBought={addBought}
              />
            </div>

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
          </>
        )}

        {tab === "toBuy" && (
          <>
            {toBuyItems.length > 0 && (
              <div className="flex items-center gap-2 mb-3 text-sm">
                <button
                  onClick={selectAll}
                  className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 font-medium"
                >
                  {tr.selectAll}
                </button>
                {selected.size > 0 && (
                  <>
                    <button
                      onClick={clearSelection}
                      className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 font-medium"
                    >
                      {tr.clearSelection}
                    </button>
                    <span className="text-gray-500 ms-auto">
                      {tr.selectedCount(selected.size)}
                    </span>
                    <button
                      onClick={() => setBuyModalOpen(true)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white font-semibold
                                 active:scale-95 transition-transform"
                    >
                      {tr.markSelected}
                    </button>
                  </>
                )}
              </div>
            )}
            <PartyList
              items={visibleItems}
              t={tr}
              lang={lang}
              mode="toBuy"
              selected={selected}
              onToggleSelect={toggleSelect}
              onRemove={removeItem}
            />
          </>
        )}

        {tab === "bought" && (
          <PartyList
            items={visibleItems}
            t={tr}
            lang={lang}
            mode="bought"
            onRemove={removeItem}
          />
        )}

        {tab === "dashboard" && (
          <Dashboard items={items} t={tr} lang={lang} />
        )}
      </div>

      {buyModalOpen && (
        <BuyModal
          t={tr}
          lang={lang}
          items={selectedItems}
          buyers={buyers}
          onConfirm={handleConfirmBuy}
          onClose={() => setBuyModalOpen(false)}
        />
      )}
    </main>
  );
}
