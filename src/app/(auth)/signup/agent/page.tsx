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
import { MaterialIcon } from "@/components/ui/MaterialIcon";

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
    "w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50";

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat p-4"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, rgba(47,82,51,0.45), rgba(26,60,94,0.55)), url('/images/house-bg.png')",
      }}
    >
      {/* Frosted glass card */}
      <div className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 sm:p-10">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">
            Agent Sign Up
          </h1>
          <p className="text-on-surface-variant mt-2">
            Create your brokerage account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label
              htmlFor="displayName"
              className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5"
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
              className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5"
            >
              Email Address
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
                className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  className={`${inputClass} pr-10`}
                  placeholder="6+ characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-on-surface-variant hover:text-on-surface transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <MaterialIcon name="visibility_off" size={16} /> : <MaterialIcon name="visibility" size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5"
              >
                Confirm
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  required
                  value={form.confirmPassword}
                  onChange={(e) => update("confirmPassword", e.target.value)}
                  className={`${inputClass} pr-10`}
                  placeholder="Repeat password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-on-surface-variant hover:text-on-surface transition-colors"
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? <MaterialIcon name="visibility_off" size={16} /> : <MaterialIcon name="visibility" size={16} />}
                </button>
              </div>
            </div>
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5"
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
              className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5"
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
                className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5"
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
                className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5"
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
            <p role="alert" className="text-sm text-error bg-red-50 p-3 rounded-xl">
              {error}
            </p>
          )}

          <Button
            type="submit"
            variant="cta"
            size="lg"
            loading={loading}
            className="w-full rounded-full"
          >
            Create Account
          </Button>
        </form>

        <p className="text-center text-sm text-on-surface-variant mt-6">
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
  );
}
