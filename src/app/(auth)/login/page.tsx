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
    <div className="min-h-screen flex">
      {/* Left panel — desktop only, editorial gradient */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary to-secondary flex-col justify-center px-12 lg:px-16">
        <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Your home journey,
          <br />
          organized.
        </h2>
        <p className="mt-4 text-lg text-white/70 max-w-md">
          Every milestone, document, and conversation — all in one place.
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            {brokerage?.logoUrl && (
              <img
                src={brokerage.logoUrl}
                alt={brokerage.name}
                className="h-16 mx-auto mb-4"
              />
            )}
            <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">
              Welcome to Hearth
            </h1>
            <p className="text-text-secondary mt-2">
              {brokerage?.name || "Your Real Estate Portal"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="you@example.com"
              />
            </div>

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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Your password"
              />
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
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-text-secondary mt-8">
            Are you an agent?{" "}
            <a
              href="/signup/agent"
              className="font-semibold text-primary hover:underline"
            >
              Create your account
            </a>
          </p>

          <p className="text-center text-xs text-text-secondary mt-3">
            Clients: your agent will set up your account.
            <br />
            Contact them if you need access.
          </p>
        </div>
      </div>
    </div>
  );
}
