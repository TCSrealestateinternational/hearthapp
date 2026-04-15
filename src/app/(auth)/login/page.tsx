"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useBrokerage } from "@/hooks/useBrokerage";
import { Button } from "@/components/ui/Button";
import { BrokerageSwitch } from "@/components/BrokerageSwitch";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { user, login, pendingSwitch, confirmSwitch, declineSwitch } =
    useAuth();
  const { brokerage } = useBrokerage();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const loggedInUser = await login(email, password);
      if (loggedInUser) {
        if (loggedInUser.roles.includes("agent")) {
          router.push("/agent/dashboard");
        } else {
          router.push("/dashboard");
        }
      }
      // If null, pendingSwitch will be set — BrokerageSwitch renders
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code || "";
      if (
        code === "auth/user-not-found" ||
        code === "auth/wrong-password" ||
        code === "auth/invalid-credential"
      ) {
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

  async function handleConfirmSwitch() {
    const updatedUser = await confirmSwitch();
    if (updatedUser) {
      if (updatedUser.roles.includes("agent")) {
        router.push("/agent/dashboard");
      } else {
        router.push("/dashboard");
      }
    }
    return updatedUser;
  }

  async function handleDeclineSwitch() {
    await declineSwitch();
    if (user) {
      if (user.roles.includes("agent")) {
        router.push("/agent/dashboard");
      } else {
        router.push("/dashboard");
      }
    }
  }

  // Show brokerage switch prompt if pending
  if (pendingSwitch && user) {
    return (
      <BrokerageSwitch
        user={user}
        pendingSwitch={pendingSwitch}
        onConfirm={handleConfirmSwitch}
        onDecline={handleDeclineSwitch}
      />
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat p-4"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, rgba(47,82,51,0.30), rgba(26,60,94,0.50)), url('/images/house-bg.jpg')",
      }}
    >
      {/* Frosted glass card */}
      <div className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 sm:p-10">
        <div className="text-center mb-8">
          {brokerage?.logoUrl && (
            <img
              src={brokerage.logoUrl}
              alt={brokerage.name}
              className="h-16 mx-auto mb-4"
            />
          )}
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface font-serif">
            Welcome Back
          </h1>
          <p className="text-on-surface-variant mt-2">
            {brokerage?.name || "Your Real Estate Portal"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="you@example.com"
            />
          </div>

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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 rounded-xl border border-outline-variant bg-surface text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-on-surface-variant hover:text-on-surface transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <MaterialIcon name="visibility_off" size={18} /> : <MaterialIcon name="visibility" size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <p
              role="alert"
              className="text-sm text-error bg-red-50 p-3 rounded-xl"
            >
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
            Sign In
          </Button>
        </form>

        <p className="text-center text-sm text-on-surface-variant mt-8">
          Are you an agent?{" "}
          <a
            href="/signup/agent"
            className="font-semibold text-primary hover:underline"
          >
            Create your account
          </a>
        </p>

        <p className="text-center text-xs text-on-surface-variant mt-3">
          Clients: your agent will set up your account.
          <br />
          Contact them if you need access.
        </p>
      </div>
    </div>
  );
}
