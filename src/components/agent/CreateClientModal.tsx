"use client";

import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  signOut,
} from "firebase/auth";
import { secondaryAuth } from "@/lib/firebase-secondary";
import { auth } from "@/lib/firebase";
import { createUser, createTransaction } from "@/lib/firestore";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import type { UserRole } from "@/types";
import { Mail, CheckCircle } from "lucide-react";

interface CreateClientModalProps {
  open: boolean;
  onClose: () => void;
  brokerageId: string;
  onCreated: () => void;
}

// Random placeholder password - client will never see or use this
function randomPlaceholder(): string {
  return crypto.randomUUID() + "!Aa1";
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
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [sentTo, setSentTo] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Create account with a random password (client will never use it)
      const cred = await createUserWithEmailAndPassword(
        secondaryAuth,
        email,
        randomPlaceholder()
      );

      await updateProfile(cred.user, { displayName });

      const roles: UserRole[] =
        role === "dual" ? ["buyer", "seller", "dual"] : [role];

      // Create Firestore user doc (pending until client sets password and logs in)
      const userData: Record<string, unknown> = {
        id: cred.user.uid,
        brokerageId,
        email,
        displayName,
        roles,
        status: "pending",
      };
      if (phone) {
        userData.phone = phone;
      }
      await createUser(userData as Parameters<typeof createUser>[0]);

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

      // Send password reset email (acts as the invite)
      // continueUrl sends them to the login page after setting their password
      const appUrl = typeof window !== "undefined" ? window.location.origin : "";
      await sendPasswordResetEmail(auth, email, {
        url: `${appUrl}/login`,
        handleCodeInApp: false,
      });

      setSentTo(email);
      setSuccess(true);
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
    setSuccess(false);
    setSentTo("");
    setError("");
    onClose();
  }

  return (
    <Modal open={open} onClose={handleClose} title="Add New Client">
      {success ? (
        <div className="space-y-4">
          <div className="bg-primary-light rounded-lg p-4 text-center">
            <CheckCircle size={40} className="mx-auto mb-3 text-success" />
            <p className="text-lg font-semibold text-text-primary mb-1">
              Invite Sent!
            </p>
            <p className="text-sm text-text-secondary">
              A setup email has been sent to:
            </p>
            <p className="text-sm font-mono font-medium text-primary mt-1">
              {sentTo}
            </p>
          </div>
          <div className="bg-surface rounded-lg p-3 border border-border">
            <div className="flex items-start gap-2">
              <Mail size={16} className="text-text-secondary mt-0.5" />
              <div className="text-sm text-text-secondary">
                <p>Your client will receive an email to set up their password.</p>
                <p className="mt-1">
                  Once they set their password, they can log in to the portal.
                </p>
              </div>
            </div>
          </div>
          <Button variant="primary" onClick={handleClose} className="w-full">
            Done
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="client-name" className="block text-sm font-medium text-text-primary mb-1">
              Full Name
            </label>
            <input
              id="client-name"
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Jane Smith"
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text-primary"
            />
          </div>

          <div>
            <label htmlFor="client-email" className="block text-sm font-medium text-text-primary mb-1">
              Email
            </label>
            <input
              id="client-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@example.com"
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text-primary"
            />
          </div>

          <div>
            <label htmlFor="client-phone" className="block text-sm font-medium text-text-primary mb-1">
              Phone (optional)
            </label>
            <input
              id="client-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 123-4567"
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text-primary"
            />
          </div>

          <div>
            <label htmlFor="client-role" className="block text-sm font-medium text-text-primary mb-1">
              Role
            </label>
            <select
              id="client-role"
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

          <div className="bg-primary-light/50 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Mail size={16} className="text-primary mt-0.5" />
              <p className="text-sm text-text-secondary">
                Your client will receive an email invitation to set up their
                password and access the portal.
              </p>
            </div>
          </div>

          {error && (
            <p role="alert" className="text-sm text-error bg-red-50 p-2 rounded-lg">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" type="button" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="cta" type="submit" loading={loading}>
              Send Invite
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
