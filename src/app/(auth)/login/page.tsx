"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useBrokerage } from "@/hooks/useBrokerage";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { brokerage } = useBrokerage();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user?.roles.includes("agent")) {
        router.push("/agent/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code || "";
      if (code === "auth/user-not-found" || code === "auth/wrong-password" || code === "auth/invalid-credential") {
        setError("Invalid email or password. Please try again.");
      } else if (code === "auth/invalid-api-key") {
        setError("App configuration error. Please contact support.");
      } else {
        setError((err as Error)?.message || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          {brokerage?.logoUrl && (
            <img
              src={brokerage.logoUrl}
              alt={brokerage.name}
              className="h-16 mx-auto mb-4"
            />
          )}
          <h1 className="text-2xl font-bold text-text-primary">
            Welcome to Hearth
          </h1>
          <p className="text-text-secondary mt-1">
            {brokerage?.name || "Your Real Estate Portal"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-text-primary mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-text-primary mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Your password"
            />
          </div>

          {error && (
            <p className="text-sm text-error bg-red-50 p-2 rounded-lg">
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
            Sign In
          </Button>
        </form>

        <p className="text-center text-xs text-text-secondary mt-8">
          Your agent will set up your account.
          <br />
          Contact them if you need access.
        </p>
      </div>
    </div>
  );
}
