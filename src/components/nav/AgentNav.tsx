"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  MessageCircle,
  UserCircle,
} from "lucide-react";

const items = [
  {
    href: "/agent/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard size={20} aria-hidden="true" />,
  },
  { href: "/agent/clients", label: "Clients", icon: <Users size={20} aria-hidden="true" /> },
  {
    href: "/agent/messages",
    label: "Messages",
    icon: <MessageCircle size={20} aria-hidden="true" />,
  },
  {
    href: "/agent/profile",
    label: "Profile",
    icon: <UserCircle size={20} aria-hidden="true" />,
  },
];

export function AgentNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop horizontal nav — embedded in header */}
      <nav aria-label="Main navigation" className="hidden md:flex items-center gap-1">
        {items.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
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

      {/* Mobile bottom tabs — glass effect */}
      <nav aria-label="Mobile navigation" className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--glass-bg)] backdrop-blur-xl border-t border-[var(--glass-border)] rounded-t-2xl z-40">
        <div className="flex items-center justify-around px-2 py-2">
          {items.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 text-xs rounded-xl transition-colors ${
                  active
                    ? "text-primary bg-primary-light"
                    : "text-text-secondary"
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
