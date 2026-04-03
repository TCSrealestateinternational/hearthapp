import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, displayName, phone, roles, brokerageId, password } = body;

    if (!email || !displayName || !roles || !brokerageId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create Firebase Auth user
    const userRecord = await adminAuth.createUser({
      email,
      password: password || generateTempPassword(),
      displayName,
    });

    // Create Firestore user document
    await adminDb
      .collection("users")
      .doc(userRecord.uid)
      .set({
        brokerageId,
        email,
        displayName,
        phone: phone || "",
        roles,
        createdAt: FieldValue.serverTimestamp(),
        lastLoginAt: FieldValue.serverTimestamp(),
      });

    // Create transactions for each role
    const transactionRoles = roles.filter(
      (r: string) => r === "buyer" || r === "seller" || r === "dual"
    );

    for (const role of transactionRoles) {
      if (role === "dual" || role === "buyer") {
        await adminDb.collection("transactions").add({
          brokerageId,
          clientId: userRecord.uid,
          type: "buying",
          status: "active",
          label: `${displayName} - Buying`,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        });
      }
      if (role === "dual" || role === "seller") {
        await adminDb.collection("transactions").add({
          brokerageId,
          clientId: userRecord.uid,
          type: "selling",
          status: "active",
          label: `${displayName} - Selling`,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        });
      }
    }

    return NextResponse.json({
      uid: userRecord.uid,
      email: userRecord.email,
      tempPassword: password || "See generated password",
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create client";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function generateTempPassword(): string {
  const chars =
    "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$";
  let password = "";
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}
