"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import type { UserRole } from "@/types";

interface CreateClientModalProps {
  open: boolean;
  onClose: () => void;
  brokerageId: string;
  onCreated: () => void;
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

    try {
      const roles: UserRole[] =
        role === "dual" ? ["buyer", "seller", "dual"] : [role];

      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          displayName,
          phone,
          roles,
          brokerageId,
          password: password || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create client");
        return;
      }

      setResult({
        email: data.email,
        tempPassword: password || data.tempPassword,
      });
      onCreated();
    } catch {
      setError("Something went wrong. Please try again.");
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
              Temporary Password (optional)
            </label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Auto-generated if left blank"
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text-primary"
            />
            <p className="text-xs text-text-secondary mt-1">
              Must be at least 6 characters. Leave blank to auto-generate.
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
