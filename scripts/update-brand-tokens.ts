/**
 * One-time script to update brandTokens for all brokerages in Firestore
 * to match the WCAG 2.1 AA compliant colors.
 *
 * Usage:
 *   npx ts-node scripts/update-brand-tokens.ts
 *
 * Prerequisites:
 *   - Service account key at ./serviceAccountKey.json (or use GOOGLE_APPLICATION_CREDENTIALS env)
 */

import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({
  credential: cert("./serviceAccountKey.json"),
});

const db = getFirestore();

const updatedTokens = {
  "brandTokens.cta": "#8B6914",
  "brandTokens.ctaHover": "#725610",
  "brandTokens.warning": "#A16207",
};

async function updateAllBrokerages() {
  const snapshot = await db.collection("brokerages").get();

  if (snapshot.empty) {
    console.log("No brokerages found.");
    return;
  }

  let updated = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const tokens = data.brandTokens;

    // Only update brokerages still using the old color values
    if (
      tokens?.cta === "#C4A35A" ||
      tokens?.ctaHover === "#B8933F" ||
      tokens?.warning === "#EAB308"
    ) {
      await doc.ref.update(updatedTokens);
      console.log(`Updated: ${data.slug || data.name} (${doc.id})`);
      updated++;
    } else {
      console.log(`Skipped (already current): ${data.slug || data.name} (${doc.id})`);
    }
  }

  console.log(`\nDone! Updated ${updated} of ${snapshot.size} brokerages.`);
}

updateAllBrokerages().catch(console.error);
