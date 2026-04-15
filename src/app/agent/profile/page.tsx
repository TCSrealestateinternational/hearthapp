"use client";

import { useAuth } from "@/hooks/useAuth";
import { useBrokerage } from "@/hooks/useBrokerage";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

const SUPPORT_EMAIL = "toni@tcsrealestateinternational.com";

export default function AgentProfilePage() {
  const { user, signOut } = useAuth();
  const { brokerage } = useBrokerage();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-extrabold tracking-tight text-on-surface font-serif">
        Profile
      </h1>

      {/* Agent info */}
      <Card>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-primary-container flex items-center justify-center">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.displayName}
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <MaterialIcon name="account_circle" size={32} className="text-primary" />
            )}
          </div>
          <div>
            <p className="text-xl font-bold text-on-surface">
              {user?.displayName}
            </p>
            <div className="flex items-center gap-1 text-sm text-on-surface-variant">
              <MaterialIcon name="mail" size={14} />
              <span>{user?.email}</span>
            </div>
            {user?.phone && (
              <div className="flex items-center gap-1 text-sm text-on-surface-variant">
                <MaterialIcon name="phone" size={14} />
                <span>{user.phone}</span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Brokerage info */}
      {brokerage && (
        <Card>
          <div className="flex items-center gap-3 mb-3">
            <MaterialIcon name="apartment" size={20} className="text-primary" />
            <p className="text-lg font-bold text-on-surface">
              {brokerage.name}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-on-surface-variant">Title</p>
              <p className="text-on-surface font-medium">
                {brokerage.agentTitle}
              </p>
            </div>
            {brokerage.licenseNumber && (
              <div>
                <p className="text-on-surface-variant">License #</p>
                <p className="text-on-surface font-medium">
                  {brokerage.licenseNumber}
                </p>
              </div>
            )}
            <div>
              <p className="text-on-surface-variant">Slug</p>
              <p className="text-on-surface font-medium">
                {brokerage.slug}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Help */}
      <Card>
        <div className="flex items-center gap-3 mb-2">
          <MaterialIcon name="help" size={20} className="text-primary" />
          <p className="text-lg font-bold text-on-surface">Need Help?</p>
        </div>
        <p className="text-sm text-on-surface-variant mb-4">
          Have a question or running into an issue? Reach out and we&apos;ll get
          back to you as soon as possible.
        </p>
        <a
          href={`mailto:${SUPPORT_EMAIL}?subject=Hearth Support Request`}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <MaterialIcon name="mail" size={16} />
          Contact Support
        </a>
      </Card>

      {/* Sign out */}
      <Button
        variant="secondary"
        onClick={signOut}
        className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
      >
        <MaterialIcon name="logout" size={16} />
        Sign Out
      </Button>
    </div>
  );
}
