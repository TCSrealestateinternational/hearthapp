"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { collection, addDoc, doc, setDoc, serverTimestamp, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

const BROKERAGE_DATA = {
  slug: "life-built-in-kentucky",
  name: "Life Built in Kentucky",
  agentName: "Toni Schafer",
  agentTitle: "Real Estate Agent",
  agentEmail: "toni@lifebuiltinkentucky.com",
  agentPhone: "",
  licenseNumber: "",
  logoUrl: "",
  brandTokens: {
    primary: "#2F5233",
    primaryLight: "#E8F0E9",
    secondary: "#1A3C5E",
    cta: "#C4A35A",
    ctaHover: "#B8933F",
    background: "#FAF9F6",
    surface: "#FFFFFF",
    textPrimary: "#2C2C2C",
    textSecondary: "#6B7280",
    border: "#E5E7EB",
    success: "#16A34A",
    warning: "#EAB308",
    error: "#DC2626",
  },
  driveFolderUrl: "",
};

export default function SetupPage() {
  const { firebaseUser, user } = useAuth();
  const [status, setStatus] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [running, setRunning] = useState(false);

  function log(msg: string) {
    setStatus((prev) => [...prev, msg]);
  }

  async function runSetup() {
    if (!firebaseUser) {
      log("ERROR: Not logged in. Please log in first at /login.");
      return;
    }

    setRunning(true);

    try {
      // 1. Check if brokerage already exists
      log("Checking for existing brokerage...");
      const brokerageQuery = query(
        collection(db, "brokerages"),
        where("slug", "==", "life-built-in-kentucky")
      );
      const brokerageSnap = await getDocs(brokerageQuery);

      let brokerageId: string;

      if (brokerageSnap.empty) {
        log("Creating brokerage: Life Built in Kentucky...");
        const brokerageRef = await addDoc(collection(db, "brokerages"), {
          ...BROKERAGE_DATA,
          createdAt: serverTimestamp(),
        });
        brokerageId = brokerageRef.id;
        log(`Brokerage created with ID: ${brokerageId}`);
      } else {
        brokerageId = brokerageSnap.docs[0].id;
        log(`Brokerage already exists with ID: ${brokerageId}`);
      }

      // 2. Create or update user document
      log(`Setting up user document for ${firebaseUser.email}...`);
      const userRef = doc(db, "users", firebaseUser.uid);
      await setDoc(
        userRef,
        {
          brokerageId,
          email: firebaseUser.email || "",
          displayName: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
          roles: ["agent"],
          status: "active",
          lastLoginAt: serverTimestamp(),
          ...(user ? {} : { createdAt: serverTimestamp() }),
        },
        { merge: true }
      );
      log(`User document set for UID: ${firebaseUser.uid}`);

      // 3. Create a buying transaction for testing
      log("Checking for existing transactions...");
      const txQuery = query(
        collection(db, "transactions"),
        where("brokerageId", "==", brokerageId)
      );
      const txSnap = await getDocs(txQuery);

      if (txSnap.empty) {
        log("Creating sample buying transaction...");
        await addDoc(collection(db, "transactions"), {
          brokerageId,
          clientId: firebaseUser.uid,
          type: "buying",
          status: "active",
          label: "Home Search",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        log("Sample transaction created.");
      } else {
        log(`${txSnap.size} transaction(s) already exist.`);
      }

      log("");
      log("Setup complete! You can now use the app.");
      log("Go to /dashboard to get started.");
      setDone(true);
    } catch (err) {
      log(`ERROR: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Hearth App Setup</h1>
        <p className="text-sm text-gray-600 mb-6">
          This will create the brokerage, user, and sample data in Firestore.
        </p>

        {!firebaseUser && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-yellow-800">
              You need to be logged in first.{" "}
              <a href="/login" className="underline font-medium">Go to login</a>
            </p>
          </div>
        )}

        <button
          onClick={runSetup}
          disabled={running || done || !firebaseUser}
          className="w-full bg-green-700 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {running ? "Setting up..." : done ? "Setup Complete" : "Run Setup"}
        </button>

        {status.length > 0 && (
          <div className="mt-6 bg-gray-900 rounded-lg p-4 font-mono text-sm text-green-400 max-h-64 overflow-y-auto">
            {status.map((line, i) => (
              <div key={i} className={line.startsWith("ERROR") ? "text-red-400" : ""}>
                {line || "\u00A0"}
              </div>
            ))}
          </div>
        )}

        {done && (
          <a
            href="/dashboard"
            className="block mt-4 text-center bg-green-100 text-green-800 py-2 px-4 rounded-lg font-medium hover:bg-green-200 transition-colors"
          >
            Go to Dashboard
          </a>
        )}
      </div>
    </div>
  );
}
