"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  MessageCircle,
} from "lucide-react";

const items = [
  {
    href: "/agent/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard size={20} />,
  },
  { href: "/agent/clients", label: "Clients", icon: <Users size={20} /> },
  {
    href: "/agent/messages",
    label: "Messages",
    icon: <MessageCircle size={20} />,
  },
];

export function AgentNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden md:flex flex-col w-56 border-r border-border bg-surface p-4 gap-1">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-primary">Hearth</h2>
          <p className="text-xs text-text-secondary">Agent Portal</p>
        </div>
        {items.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-primary-light text-primary"
                  : "text-text-secondary hover:bg-primary-light/50 hover:text-text-primary"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Mobile bottom tabs */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border z-40">
        <div className="flex items-center justify-around px-2 py-1">
          {items.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 text-xs ${
                  active ? "text-primary" : "text-text-secondary"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
