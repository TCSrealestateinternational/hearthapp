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
import {
  createUser,
  createTransaction,
  getUsersByEmail,
  updateUser,
} from "@/lib/firestore";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import type { User, UserRole } from "@/types";
import { Mail, CheckCircle, AlertTriangle } from "lucide-react";

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
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [sentTo, setSentTo] = useState("");
  const [error, setError] = useState("");
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
  const [existingUser, setExistingUser] = useState<User | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Check if this email already exists in any brokerage
      const existing = await getUsersByEmail(email);

      if (existing.length > 0) {
        const inThisBrokerage = existing.find(
          (u) => u.brokerageId === brokerageId
        );
        if (inThisBrokerage) {
          setError("This client is already in your brokerage.");
          setLoading(false);
          return;
        }

        // Also check brokerageIds for clients pending a switch
        const inThisBrokerageViaIds = existing.find(
          (u) => u.brokerageIds?.includes(brokerageId)
        );
        if (inThisBrokerageViaIds) {
          setError("This client already has a pending switch to your brokerage.");
          setLoading(false);
          return;
        }

        // Exists in a different brokerage — show warning
        setExistingUser(existing[0]);
        setShowDuplicateWarning(true);
        setLoading(false);
        return;
      }

      // No existing user — proceed with normal creation
      await createNewClient();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to create client";
      setError(message);
      setLoading(false);
    }
  }

  async function createNewClient() {
    try {
      const cred = await createUserWithEmailAndPassword(
        secondaryAuth,
        email,
        randomPlaceholder()
      );

      await updateProfile(cred.user, { displayName });

      const roles: UserRole[] =
        role === "dual" ? ["buyer", "seller", "dual"] : [role];

      const userData: Record<string, unknown> = {
        id: cred.user.uid,
        brokerageId,
        brokerageIds: [brokerageId],
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

      await signOut(secondaryAuth);

      const appUrl =
        typeof window !== "undefined" ? window.location.origin : "";
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

  async function createDuplicateClient() {
    if (!existingUser) return;
    setLoading(true);
    setError("");

    try {
      const roles: UserRole[] =
        role === "dual" ? ["buyer", "seller", "dual"] : [role];

      // Update existing user doc: add pending brokerage + per-brokerage profile
      const currentIds = existingUser.brokerageIds || [
        existingUser.brokerageId,
      ];
      const updatedIds = currentIds.includes(brokerageId)
        ? currentIds
        : [...currentIds, brokerageId];

      const currentProfiles = existingUser.brokerageProfiles || {};

      await updateUser(existingUser.id, {
        brokerageIds: updatedIds,
        pendingBrokerageId: brokerageId,
        brokerageProfiles: {
          ...currentProfiles,
          [brokerageId]: { roles, displayName },
        },
      } as Partial<User>);

      // Create transactions under the new brokerage
      const clientName = displayName || existingUser.displayName;
      if (role === "dual" || role === "buyer") {
        await createTransaction({
          brokerageId,
          clientId: existingUser.id,
          type: "buying",
          status: "active",
          label: `${clientName} - Buying`,
        });
      }
      if (role === "dual" || role === "seller") {
        await createTransaction({
          brokerageId,
          clientId: existingUser.id,
          type: "selling",
          status: "active",
          label: `${clientName} - Selling`,
        });
      }

      // No Firebase Auth creation needed — account already exists
      // No password reset email — they already have credentials

      setSentTo(email);
      setIsDuplicate(true);
      setSuccess(true);
      onCreated();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to add client";
      setError(message);
    } finally {
      setLoading(false);
      setShowDuplicateWarning(false);
    }
  }

  function handleClose() {
    setDisplayName("");
    setEmail("");
    setPhone("");
    setRole("buyer");
    setSuccess(false);
    setIsDuplicate(false);
    setSentTo("");
    setError("");
    setShowDuplicateWarning(false);
    setExistingUser(null);
    onClose();
  }

  return (
    <Modal open={open} onClose={handleClose} title="Add New Client">
      {showDuplicateWarning ? (
        <div className="space-y-4">
          <div className="bg-warning/10 border border-warning/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle
                size={20}
                className="text-warning mt-0.5 shrink-0"
              />
              <p className="text-sm text-text-primary font-medium">
                This client is already attached to an agent in our system.
                Please confirm with the client that they do not have a current
                contract with them before continuing.
              </p>
            </div>
          </div>

          {error && (
            <p
              role="alert"
              className="text-sm text-error bg-red-50 p-2 rounded-lg"
            >
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={handleClose}>
              Come Back Later
            </Button>
            <Button
              variant="cta"
              onClick={createDuplicateClient}
              loading={loading}
            >
              Confirm
            </Button>
          </div>
        </div>
      ) : success ? (
        <div className="space-y-4">
          <div className="bg-primary-light rounded-lg p-4 text-center">
            <CheckCircle size={40} className="mx-auto mb-3 text-success" />
            <p className="text-lg font-semibold text-text-primary mb-1">
              {isDuplicate ? "Client Added!" : "Invite Sent!"}
            </p>
            {isDuplicate ? (
              <p className="text-sm text-text-secondary">
                This client already has a Hearth account. They can log in with
                their existing credentials and will be prompted to switch to
                your brokerage.
              </p>
            ) : (
              <>
                <p className="text-sm text-text-secondary">
                  A setup email has been sent to:
                </p>
                <p className="text-sm font-mono font-medium text-primary mt-1">
                  {sentTo}
                </p>
              </>
            )}
          </div>
          {!isDuplicate && (
            <div className="bg-surface rounded-lg p-3 border border-border">
              <div className="flex items-start gap-2">
                <Mail size={16} className="text-text-secondary mt-0.5" />
                <div className="text-sm text-text-secondary">
                  <p>
                    Your client will receive an email to set up their password.
                  </p>
                  <p className="mt-1">
                    Once they set their password, they can log in to the portal.
                  </p>
                </div>
              </div>
            </div>
          )}
          <Button variant="primary" onClick={handleClose} className="w-full">
            Done
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label
              htmlFor="client-name"
              className="block text-sm font-medium text-text-primary mb-1"
            >
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
            <label
              htmlFor="client-email"
              className="block text-sm font-medium text-text-primary mb-1"
            >
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
            <label
              htmlFor="client-phone"
              className="block text-sm font-medium text-text-primary mb-1"
            >
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
            <label
              htmlFor="client-role"
              className="block text-sm font-medium text-text-primary mb-1"
            >
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
            <p
              role="alert"
              className="text-sm text-error bg-red-50 p-2 rounded-lg"
            >
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
