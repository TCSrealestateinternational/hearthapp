"use client";

import { useEffect, useState, useCallback } from "react";
import type { Transaction, Property, FinanceScenario } from "@/types";
import {
  getTransactions,
  getTransaction as fetchTransaction,
  createTransaction as createTx,
  updateTransaction as updateTx,
  getProperties,
  createProperty as createProp,
  updateProperty as updateProp,
  deleteProperty as deleteProp,
  getFinanceScenarios,
  createFinanceScenario as createScenario,
  deleteFinanceScenario as deleteScenario,
} from "@/lib/firestore";

export function useTransactions(brokerageId: string, clientId: string) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!brokerageId || !clientId) return;
    setLoading(true);
    const txs = await getTransactions(brokerageId, clientId);
    setTransactions(txs);
    setLoading(false);
  }, [brokerageId, clientId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { transactions, loading, refresh };
}

export function useTransaction(transactionId: string) {
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [scenarios, setScenarios] = useState<FinanceScenario[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!transactionId) return;
    setLoading(true);
    const [tx, props, fins] = await Promise.all([
      fetchTransaction(transactionId),
      getProperties(transactionId),
      getFinanceScenarios(transactionId),
    ]);
    setTransaction(tx);
    setProperties(props);
    setScenarios(fins);
    setLoading(false);
  }, [transactionId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function addProperty(
    data: Omit<Property, "id" | "createdAt" | "updatedAt">
  ) {
    await createProp(data);
    await refresh();
  }

  async function editProperty(id: string, data: Partial<Property>) {
    await updateProp(id, data);
    await refresh();
  }

  async function removeProperty(id: string) {
    await deleteProp(id);
    await refresh();
  }

  async function addScenario(
    data: Omit<FinanceScenario, "id" | "createdAt">
  ) {
    await createScenario(data);
    await refresh();
  }

  async function removeScenario(id: string) {
    await deleteScenario(id);
    await refresh();
  }

  return {
    transaction,
    properties,
    scenarios,
    loading,
    refresh,
    addProperty,
    editProperty,
    removeProperty,
    addScenario,
    removeScenario,
  };
}

export async function createTransaction(
  data: Omit<Transaction, "id" | "createdAt" | "updatedAt">
) {
  return createTx(data);
}

export async function updateTransaction(
  id: string,
  data: Partial<Transaction>
) {
  return updateTx(id, data);
}
