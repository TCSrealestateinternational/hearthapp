"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

const items = [
  { href: "/agent/dashboard", label: "Dashboard", icon: "space_dashboard" },
  { href: "/agent/clients", label: "Clients", icon: "group" },
  { href: "/agent/messages", label: "Messages", icon: "chat_bubble" },
  { href: "/agent/profile", label: "Profile", icon: "account_circle" },
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
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                active
                  ? "bg-primary-container text-on-primary-container"
                  : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
              }`}
            >
              <MaterialIcon name={item.icon} size={20} filled={active} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Mobile bottom tabs — pill-shaped */}
      <nav aria-label="Mobile navigation" className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)] border-t border-[var(--glass-border)] rounded-t-[3rem] z-40">
        <div className="flex items-center justify-around px-2 py-2">
          {items.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center gap-0.5 px-4 py-1.5 text-xs transition-all ${
                  active
                    ? "text-on-primary-container bg-primary-container rounded-full scale-100"
                    : "text-on-surface-variant scale-90"
                }`}
              >
                <MaterialIcon name={item.icon} size={20} filled={active} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
