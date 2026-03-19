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
} from "firebase/firestore";
import { db } from "./firebase";
import type { GroceryItem } from "./types";

const COLLECTION = "groceryItems";

export function useGroceryList() {
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as GroceryItem[];
      setItems(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function addItem(name: string, amount: string | null, category: string) {
    await addDoc(collection(db, COLLECTION), {
      name,
      amount: amount || null,
      category,
      bought: false,
      createdAt: Date.now(),
    });
  }

  async function toggleBought(id: string, bought: boolean) {
    await updateDoc(doc(db, COLLECTION, id), { bought: !bought });
  }

  async function updateItem(id: string, name: string, amount: string | null, category: string) {
    await updateDoc(doc(db, COLLECTION, id), { name, amount: amount || null, category });
  }

  async function removeItem(id: string) {
    await deleteDoc(doc(db, COLLECTION, id));
  }

  return { items, loading, addItem, updateItem, toggleBought, removeItem };
}
