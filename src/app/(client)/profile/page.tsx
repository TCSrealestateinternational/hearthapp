"use client";

import { useAuth } from "@/hooks/useAuth";
import { useBrokerage } from "@/hooks/useBrokerage";
import { Card, CardTitle } from "@/components/ui/Card";
import { DocumentVault } from "@/components/shared/DocumentVault";
import { UserCircle, Mail, Phone } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();
  const { brokerage } = useBrokerage();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-xl font-bold text-text-primary">Profile</h1>

      {/* Profile info */}
      <Card>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.displayName}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <UserCircle size={32} className="text-primary" />
            )}
          </div>
          <div>
            <p className="text-lg font-semibold text-text-primary">
              {user?.displayName}
            </p>
            <div className="flex items-center gap-1 text-sm text-text-secondary">
              <Mail size={14} />
              <span>{user?.email}</span>
            </div>
            {user?.phone && (
              <div className="flex items-center gap-1 text-sm text-text-secondary">
                <Phone size={14} />
                <span>{user.phone}</span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Document vault */}
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-3">
          Documents
        </h2>
        <DocumentVault
          brokerageId={brokerage?.id || ""}
          userId={user?.id || ""}
          driveFolderUrl={brokerage?.driveFolderUrl}
        />
      </div>
    </div>
  );
}
