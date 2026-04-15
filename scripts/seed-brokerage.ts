/**
 * Seed script for Life Built in Kentucky brokerage document.
 *
 * Usage:
 *   npx ts-node scripts/seed-brokerage.ts
 *
 * Prerequisites:
 *   - Firebase project set up
 *   - Service account key at ./serviceAccountKey.json (or use GOOGLE_APPLICATION_CREDENTIALS env)
 */

import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Initialize Firebase Admin
initializeApp({
  credential: cert("./serviceAccountKey.json"),
});

const db = getFirestore();

async function seed() {
  const brokerageRef = db.collection("brokerages").doc();

  await brokerageRef.set({
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
      cta: "#8B6914",
      ctaHover: "#725610",
      background: "#FAF9F6",
      surface: "#FFFFFF",
      textPrimary: "#2C2C2C",
      textSecondary: "#6B7280",
      border: "#E5E7EB",
      success: "#16A34A",
      warning: "#A16207",
      error: "#DC2626",
    },
    driveFolderUrl: "",
    createdAt: new Date(),
  });

  console.log(`Brokerage seeded with ID: ${brokerageRef.id}`);
  console.log("Slug: life-built-in-kentucky");
  console.log("\nDone!");
}

seed().catch(console.error);
