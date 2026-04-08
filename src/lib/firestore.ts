import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  type DocumentData,
  type QueryConstraint,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";
import type {
  Brokerage,
  User,
  Transaction,
  Property,
  FinanceScenario,
  Offer,
  Listing,
  ChecklistState,
  Message,
  Document as DocType,
  Milestone,
  GlossaryTerm,
} from "@/types";

// ── Generic helpers ────────────────────────────────────────────

function timestampToDate(data: DocumentData): DocumentData {
  const result = { ...data };
  for (const [key, value] of Object.entries(result)) {
    if (value && typeof value === "object" && "toDate" in value) {
      result[key] = value.toDate();
    }
  }
  return result;
}

async function getDocument<T>(path: string, id: string): Promise<T | null> {
  const snap = await getDoc(doc(db, path, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...timestampToDate(snap.data()) } as T;
}

async function queryDocuments<T>(
  path: string,
  ...constraints: QueryConstraint[]
): Promise<T[]> {
  const q = query(collection(db, path), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map(
    (d) => ({ id: d.id, ...timestampToDate(d.data()) }) as T
  );
}

async function createDocument(
  path: string,
  data: Record<string, unknown>
): Promise<string> {
  const ref = await addDoc(collection(db, path), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

async function updateDocument(
  path: string,
  id: string,
  data: Record<string, unknown>
): Promise<void> {
  await updateDoc(doc(db, path, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

async function removeDocument(path: string, id: string): Promise<void> {
  await deleteDoc(doc(db, path, id));
}

// ── Brokerage ──────────────────────────────────────────────────

export async function getBrokerage(id: string): Promise<Brokerage | null> {
  return getDocument<Brokerage>("brokerages", id);
}

export async function getBrokerageBySlug(
  slug: string
): Promise<Brokerage | null> {
  const results = await queryDocuments<Brokerage>(
    "brokerages",
    where("slug", "==", slug)
  );
  return results[0] ?? null;
}

export async function createBrokerage(
  data: Omit<Brokerage, "createdAt"> & { id: string }
): Promise<string> {
  const { id, ...rest } = data;
  await setDoc(doc(db, "brokerages", id), {
    ...rest,
    createdAt: serverTimestamp(),
  });
  return id;
}

export function generateId(collectionName: string): string {
  return doc(collection(db, collectionName)).id;
}

// ── Users ──────────────────────────────────────────────────────

export async function getUser(id: string): Promise<User | null> {
  return getDocument<User>("users", id);
}

export async function createUser(
  data: Omit<User, "createdAt" | "lastLoginAt"> & { id: string }
): Promise<string> {
  const { id, ...rest } = data;
  await setDoc(doc(db, "users", id), {
    ...rest,
    createdAt: serverTimestamp(),
    lastLoginAt: serverTimestamp(),
  });
  return id;
}

export async function updateUser(
  id: string,
  data: Partial<User>
): Promise<void> {
  return updateDocument("users", id, data as Record<string, unknown>);
}

// ── Transactions ───────────────────────────────────────────────

export async function getTransactions(
  brokerageId: string,
  clientId: string
): Promise<Transaction[]> {
  const results = await queryDocuments<Transaction>(
    "transactions",
    where("brokerageId", "==", brokerageId),
    where("clientId", "==", clientId)
  );
  return results.sort((a, b) => {
    const da = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
    const db2 = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
    return db2 - da;
  });
}

export async function getTransaction(
  id: string
): Promise<Transaction | null> {
  return getDocument<Transaction>("transactions", id);
}

export async function createTransaction(
  data: Omit<Transaction, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  return createDocument("transactions", data as Record<string, unknown>);
}

export async function updateTransaction(
  id: string,
  data: Partial<Transaction>
): Promise<void> {
  return updateDocument("transactions", id, data as Record<string, unknown>);
}

// ── Properties ─────────────────────────────────────────────────

export async function getProperties(
  transactionId: string
): Promise<Property[]> {
  const results = await queryDocuments<Property>(
    "properties",
    where("transactionId", "==", transactionId)
  );
  return results.sort((a, b) => {
    const da = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
    const db2 = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
    return db2 - da;
  });
}

export async function createProperty(
  data: Omit<Property, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  return createDocument("properties", data as Record<string, unknown>);
}

export async function updateProperty(
  id: string,
  data: Partial<Property>
): Promise<void> {
  return updateDocument("properties", id, data as Record<string, unknown>);
}

export async function deleteProperty(id: string): Promise<void> {
  return removeDocument("properties", id);
}

// ── Finance Scenarios ──────────────────────────────────────────

export async function getFinanceScenarios(
  transactionId: string
): Promise<FinanceScenario[]> {
  const results = await queryDocuments<FinanceScenario>(
    "financeScenarios",
    where("transactionId", "==", transactionId)
  );
  return results.sort((a, b) => {
    const da = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
    const db2 = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
    return db2 - da;
  });
}

export async function createFinanceScenario(
  data: Omit<FinanceScenario, "id" | "createdAt">
): Promise<string> {
  return createDocument("financeScenarios", data as Record<string, unknown>);
}

export async function deleteFinanceScenario(id: string): Promise<void> {
  return removeDocument("financeScenarios", id);
}

// ── Offers ─────────────────────────────────────────────────────

export async function getOffers(transactionId: string): Promise<Offer[]> {
  const results = await queryDocuments<Offer>(
    "offers",
    where("transactionId", "==", transactionId)
  );
  return results.sort((a, b) => {
    const da = a.receivedAt instanceof Date ? a.receivedAt.getTime() : 0;
    const db2 = b.receivedAt instanceof Date ? b.receivedAt.getTime() : 0;
    return db2 - da;
  });
}

export async function createOffer(
  data: Omit<Offer, "id">
): Promise<string> {
  return createDocument("offers", data as Record<string, unknown>);
}

export async function updateOffer(
  id: string,
  data: Partial<Offer>
): Promise<void> {
  return updateDocument("offers", id, data as Record<string, unknown>);
}

// ── Listings ───────────────────────────────────────────────────

export async function getListing(
  transactionId: string
): Promise<Listing | null> {
  const results = await queryDocuments<Listing>(
    "listings",
    where("transactionId", "==", transactionId)
  );
  return results[0] ?? null;
}

export async function createListing(
  data: Omit<Listing, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  return createDocument("listings", data as Record<string, unknown>);
}

export async function updateListing(
  id: string,
  data: Partial<Listing>
): Promise<void> {
  return updateDocument("listings", id, data as Record<string, unknown>);
}

// ── Checklists ─────────────────────────────────────────────────

export async function getChecklist(
  transactionId: string
): Promise<ChecklistState | null> {
  return getDocument<ChecklistState>("checklists", transactionId);
}

export async function saveChecklist(
  transactionId: string,
  data: Partial<ChecklistState>
): Promise<void> {
  const existing = await getChecklist(transactionId);
  if (existing) {
    return updateDocument(
      "checklists",
      transactionId,
      data as Record<string, unknown>
    );
  }
  await addDoc(collection(db, "checklists"), {
    transactionId,
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// ── Messages ───────────────────────────────────────────────────

export function subscribeToMessages(
  brokerageId: string,
  clientId: string,
  callback: (messages: Message[]) => void
): Unsubscribe {
  const q = query(
    collection(db, "messages"),
    where("brokerageId", "==", brokerageId),
    where("threadId", "==", clientId)
  );
  return onSnapshot(q, (snap) => {
    const msgs = snap.docs
      .map((d) => ({ id: d.id, ...timestampToDate(d.data()) }) as Message)
      .sort((a, b) => {
        const da = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
        const db2 = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
        return da - db2; // ascending for messages
      });
    callback(msgs);
  });
}

export async function getMessages(
  brokerageId: string,
  clientId: string
): Promise<Message[]> {
  const results = await queryDocuments<Message>(
    "messages",
    where("brokerageId", "==", brokerageId),
    where("threadId", "==", clientId)
  );
  return results.sort((a, b) => {
    const da = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
    const db2 = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
    return da - db2; // ascending for messages
  });
}

export async function sendMessage(
  data: Omit<Message, "id" | "createdAt">
): Promise<string> {
  return createDocument("messages", data as Record<string, unknown>);
}

export async function markMessageRead(id: string): Promise<void> {
  return updateDocument("messages", id, { readAt: serverTimestamp() });
}

// ── Documents ──────────────────────────────────────────────────

export async function getDocuments(
  brokerageId: string,
  transactionId?: string
): Promise<DocType[]> {
  const constraints: QueryConstraint[] = [
    where("brokerageId", "==", brokerageId),
  ];
  if (transactionId) {
    constraints.push(where("transactionId", "==", transactionId));
  }
  const results = await queryDocuments<DocType>("documents", ...constraints);
  return results.sort((a, b) => {
    const da = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
    const db2 = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
    return db2 - da;
  });
}

export async function createDocumentRecord(
  data: Omit<DocType, "id" | "createdAt">
): Promise<string> {
  return createDocument("documents", data as Record<string, unknown>);
}

// ── Milestones (subcollection of transactions) ─────────────────

export function subscribeToMilestones(
  transactionId: string,
  callback: (milestones: Milestone[]) => void
): Unsubscribe {
  const q = query(
    collection(db, "transactions", transactionId, "milestones"),
    where("clientVisible", "==", true)
  );
  return onSnapshot(q, (snap) => {
    const milestones = snap.docs
      .map((d) => ({ id: d.id, ...timestampToDate(d.data()) }) as Milestone)
      .sort((a, b) => {
        // Sort by completedAt (completed items first, then by time)
        if (a.completed && !b.completed) return -1;
        if (!a.completed && b.completed) return 1;
        const da = a.completedAt instanceof Date ? a.completedAt.getTime() : 0;
        const db2 = b.completedAt instanceof Date ? b.completedAt.getTime() : 0;
        return da - db2;
      });
    callback(milestones);
  });
}

// ── Glossary ──────────────────────────────────────────────────

export function subscribeToGlossary(
  callback: (terms: GlossaryTerm[]) => void
): Unsubscribe {
  const q = query(collection(db, "glossary"));
  return onSnapshot(q, (snap) => {
    const terms = snap.docs
      .map((d) => ({ id: d.id, ...timestampToDate(d.data()) }) as GlossaryTerm)
      .sort((a, b) => a.term.localeCompare(b.term));
    callback(terms);
  });
}

export async function getGlossaryTerm(
  id: string
): Promise<GlossaryTerm | null> {
  return getDocument<GlossaryTerm>("glossary", id);
}

// ── Agent: All clients ─────────────────────────────────────────

export async function getAllClients(brokerageId: string): Promise<User[]> {
  const users = await queryDocuments<User>(
    "users",
    where("brokerageId", "==", brokerageId)
  );
  return users
    .filter((u) => !u.roles.includes("agent"))
    .sort((a, b) => a.displayName.localeCompare(b.displayName));
}

export async function getAllTransactions(
  brokerageId: string
): Promise<Transaction[]> {
  return queryDocuments<Transaction>(
    "transactions",
    where("brokerageId", "==", brokerageId)
  );
}
