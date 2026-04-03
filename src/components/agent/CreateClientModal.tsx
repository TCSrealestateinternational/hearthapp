"use client";

import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";
import { secondaryAuth } from "@/lib/firebase-secondary";
import { createUser, createTransaction } from "@/lib/firestore";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import type { UserRole } from "@/types";

interface CreateClientModalProps {
  open: boolean;
  onClose: () => void;
  brokerageId: string;
  onCreated: () => void;
}

function generateTempPassword(): string {
  const chars =
    "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$";
  let pw = "";
  for (let i = 0; i < 12; i++) {
    pw += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pw;
}

export function CreateClientModal({
  open,
  onClose,
  brokerageId,
  onCreated,
}: CreateClientModalProps) {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"buyer" | "seller" | "dual">("buyer");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    email: string;
    tempPassword: string;
  } | null>(null);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const tempPassword = password || generateTempPassword();

    if (tempPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      // Use secondary auth instance so the agent stays signed in
      const cred = await createUserWithEmailAndPassword(
        secondaryAuth,
        email,
        tempPassword
      );

      await updateProfile(cred.user, { displayName });

      const roles: UserRole[] =
        role === "dual" ? ["buyer", "seller", "dual"] : [role];

      // Create Firestore user doc
      await createUser({
        id: cred.user.uid,
        brokerageId,
        email,
        displayName,
        phone: phone || undefined,
        roles,
      } as Parameters<typeof createUser>[0]);

      // Create transactions
      if (role === "dual" || role === "buyer") {
        await createTransaction({
          brokerageId,
          clientId: cred.user.uid,
          type: "buying",
          status: "active",
          label: `${displayName} - Buying`,
        });
      }
      if (role === "dual" || role === "seller") {
        await createTransaction({
          brokerageId,
          clientId: cred.user.uid,
          type: "selling",
          status: "active",
          label: `${displayName} - Selling`,
        });
      }

      // Sign out of secondary auth instance
      await signOut(secondaryAuth);

      setResult({ email, tempPassword });
      onCreated();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to create client";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setDisplayName("");
    setEmail("");
    setPhone("");
    setRole("buyer");
    setPassword("");
    setResult(null);
    setError("");
    onClose();
  }

  return (
    <Modal open={open} onClose={handleClose} title="Add New Client">
      {result ? (
        <div className="space-y-4">
          <div className="bg-primary-light rounded-lg p-4">
            <p className="text-sm font-medium text-primary mb-2">
              Client created successfully!
            </p>
            <p className="text-sm text-text-primary">
              Share these login credentials with your client:
            </p>
            <div className="mt-3 space-y-2 bg-surface rounded-lg p-3 border border-border">
              <div>
                <span className="text-xs text-text-secondary">Email: </span>
                <span className="text-sm font-mono font-medium text-text-primary">
                  {result.email}
                </span>
              </div>
              <div>
                <span className="text-xs text-text-secondary">
                  Temporary Password:{" "}
                </span>
                <span className="text-sm font-mono font-medium text-text-primary">
                  {result.tempPassword}
                </span>
              </div>
            </div>
            <p className="text-xs text-text-secondary mt-2">
              Save this password now - it will not be shown again.
            </p>
          </div>
          <Button variant="primary" onClick={handleClose} className="w-full">
            Done
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Jane Smith"
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@example.com"
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Phone (optional)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 123-4567"
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Role
            </label>
            <select
              value={role}
              onChange={(e) =>
                setRole(e.target.value as "buyer" | "seller" | "dual")
              }
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text-primary"
            >
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
              <option value="dual">Buyer & Seller</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Temporary Password
            </label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Auto-generated if left blank"
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text-primary"
            />
            <p className="text-xs text-text-secondary mt-1">
              Min 6 characters. Leave blank to auto-generate.
            </p>
          </div>

          {error && (
            <p className="text-sm text-error bg-red-50 p-2 rounded-lg">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" type="button" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="cta" type="submit" loading={loading}>
              Create Client
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
