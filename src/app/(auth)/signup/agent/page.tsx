"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  createUser,
  createBrokerage,
  generateId,
  getBrokerageBySlug,
} from "@/lib/firestore";
import { useAuth } from "@/hooks/useAuth";
import { defaultTokens } from "@/lib/brand";
import { slugify } from "@/lib/slugify";
import { Button } from "@/components/ui/Button";

export default function AgentSignupPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [form, setForm] = useState({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    brokerageName: "",
    agentTitle: "",
    licenseNumber: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      // 1. Create Firebase Auth account
      const cred = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      // 2. Generate slug and check uniqueness
      let slug = slugify(form.brokerageName);
      const existing = await getBrokerageBySlug(slug);
      if (existing) {
        slug = `${slug}-${Date.now().toString(36)}`;
      }

      // 3. Pre-generate brokerage doc ID
      const brokerageId = generateId("brokerages");

      // 4. Create User doc (self-create is allowed by Firestore rules)
      await createUser({
        id: cred.user.uid,
        brokerageId,
        email: form.email,
        displayName: form.displayName,
        phone: form.phone || undefined,
        roles: ["agent"],
        status: "active",
      });

      // 5. Create Brokerage doc (hasAgentRole() now passes)
      await createBrokerage({
        id: brokerageId,
        slug,
        name: form.brokerageName,
        agentName: form.displayName,
        agentTitle: form.agentTitle || "Real Estate Agent",
        agentEmail: form.email,
        agentPhone: form.phone,
        licenseNumber: form.licenseNumber,
        logoUrl: "",
        brandTokens: { ...defaultTokens },
      });

      // 6. Refresh auth state so hooks pick up the new Firestore docs
      await refreshUser();

      // 7. Redirect to agent dashboard
      router.push("/agent/dashboard");
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code || "";
      if (code === "auth/email-already-in-use") {
        setError("An account with this email already exists.");
      } else if (code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (code === "auth/weak-password") {
        setError("Password is too weak. Use at least 6 characters.");
      } else {
        setError(
          (err as Error)?.message || "Signup failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50";

  return (
    <div className="min-h-screen flex">
      {/* Left panel — desktop only, editorial gradient */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary to-secondary flex-col justify-center px-12 lg:px-16">
        <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Grow your
          <br />
          brokerage.
        </h2>
        <p className="mt-4 text-lg text-white/70 max-w-md">
          Create your Hearth account, invite clients, and manage transactions —
          all from one dashboard.
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">
              Agent Sign Up
            </h1>
            <p className="text-text-secondary mt-2">
              Create your brokerage account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label
                htmlFor="displayName"
                className="block text-sm font-semibold text-text-primary mb-1.5"
              >
                Full Name
              </label>
              <input
                id="displayName"
                type="text"
                required
                value={form.displayName}
                onChange={(e) => update("displayName", e.target.value)}
                className={inputClass}
                placeholder="Jane Smith"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-text-primary mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className={inputClass}
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-text-primary mb-1.5"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  className={inputClass}
                  placeholder="6+ characters"
                />
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-semibold text-text-primary mb-1.5"
                >
                  Confirm
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={form.confirmPassword}
                  onChange={(e) => update("confirmPassword", e.target.value)}
                  className={inputClass}
                  placeholder="Repeat password"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-semibold text-text-primary mb-1.5"
              >
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className={inputClass}
                placeholder="(555) 555-5555"
              />
            </div>

            {/* Brokerage Name */}
            <div>
              <label
                htmlFor="brokerageName"
                className="block text-sm font-semibold text-text-primary mb-1.5"
              >
                Brokerage Name
              </label>
              <input
                id="brokerageName"
                type="text"
                required
                value={form.brokerageName}
                onChange={(e) => update("brokerageName", e.target.value)}
                className={inputClass}
                placeholder="Acme Realty"
              />
            </div>

            {/* Title & License */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="agentTitle"
                  className="block text-sm font-semibold text-text-primary mb-1.5"
                >
                  Title
                </label>
                <input
                  id="agentTitle"
                  type="text"
                  value={form.agentTitle}
                  onChange={(e) => update("agentTitle", e.target.value)}
                  className={inputClass}
                  placeholder="Broker / Agent"
                />
              </div>
              <div>
                <label
                  htmlFor="licenseNumber"
                  className="block text-sm font-semibold text-text-primary mb-1.5"
                >
                  License #
                </label>
                <input
                  id="licenseNumber"
                  type="text"
                  value={form.licenseNumber}
                  onChange={(e) => update("licenseNumber", e.target.value)}
                  className={inputClass}
                  placeholder="Optional"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-error bg-red-50 p-3 rounded-xl">
                {error}
              </p>
            )}

            <Button
              type="submit"
              variant="cta"
              size="lg"
              loading={loading}
              className="w-full"
            >
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-text-secondary mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
