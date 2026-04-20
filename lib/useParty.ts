"use client";

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  query,
  orderBy,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "./firebase";
import type { PartyItem, Buyer } from "./types";

const ITEMS = "partyItems";
const BUYERS = "partyBuyers";

export function useParty() {
  const [items, setItems] = useState<PartyItem[]>([]);
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const qItems = query(collection(db, ITEMS), orderBy("createdAt", "desc"));
    const unsubItems = onSnapshot(qItems, (snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as PartyItem[]);
      setLoading(false);
    });
    const qBuyers = query(collection(db, BUYERS), orderBy("createdAt", "asc"));
    const unsubBuyers = onSnapshot(qBuyers, (snap) => {
      setBuyers(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Buyer[]);
    });
    return () => {
      unsubItems();
      unsubBuyers();
    };
  }, []);

  async function rememberBuyer(name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;
    const existing = await getDocs(
      query(collection(db, BUYERS), where("name", "==", trimmed)),
    );
    if (existing.empty) {
      await addDoc(collection(db, BUYERS), {
        name: trimmed,
        createdAt: Date.now(),
      });
    }
  }

  async function addToBuy(name: string, amount: string | null) {
    await addDoc(collection(db, ITEMS), {
      name,
      amount: amount || null,
      bought: false,
      price: null,
      buyer: null,
      boughtAt: null,
      createdAt: Date.now(),
    });
  }

  async function addBought(
    name: string,
    amount: string | null,
    price: number,
    buyer: string,
  ) {
    await addDoc(collection(db, ITEMS), {
      name,
      amount: amount || null,
      bought: true,
      price,
      buyer,
      boughtAt: Date.now(),
      createdAt: Date.now(),
    });
    await rememberBuyer(buyer);
  }

  async function markBought(ids: string[], price: number, buyer: string) {
    if (ids.length === 0) return;
    const perItem = price / ids.length;
    const boughtAt = Date.now();
    await Promise.all(
      ids.map((id) =>
        updateDoc(doc(db, ITEMS, id), {
          bought: true,
          price: perItem,
          buyer,
          boughtAt,
        }),
      ),
    );
    await rememberBuyer(buyer);
  }

  async function updateItem(
    id: string,
    patch: Partial<Omit<PartyItem, "id" | "createdAt">>,
  ) {
    await updateDoc(doc(db, ITEMS, id), patch);
  }

  async function removeItem(id: string) {
    await deleteDoc(doc(db, ITEMS, id));
  }

  return {
    items,
    buyers,
    loading,
    addToBuy,
    addBought,
    markBought,
    updateItem,
    removeItem,
    rememberBuyer,
  };
}
