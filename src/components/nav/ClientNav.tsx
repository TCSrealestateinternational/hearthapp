"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Home,
  Calculator,
  CheckSquare,
  MessageCircle,
  UserCircle,
  BookOpen,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface ClientNavProps {
  role: "buyer" | "seller";
  unreadCount: number;
}

export function ClientNav({ role, unreadCount }: ClientNavProps) {
  const pathname = usePathname();

  const buyerItems: NavItem[] = [
    { href: "/dashboard", label: "Home", icon: <LayoutDashboard size={20} /> },
    { href: "/buyer/properties", label: "Properties", icon: <Home size={20} /> },
    {
      href: "/buyer/finance",
      label: "Finance",
      icon: <Calculator size={20} />,
    },
    {
      href: "/buyer/checklist",
      label: "Checklist",
      icon: <CheckSquare size={20} />,
    },
    {
      href: "/glossary",
      label: "Glossary",
      icon: <BookOpen size={20} />,
    },
  ];

  const sellerItems: NavItem[] = [
    { href: "/dashboard", label: "Home", icon: <LayoutDashboard size={20} /> },
    { href: "/seller/listing", label: "Listing", icon: <Home size={20} /> },
    {
      href: "/seller/offers",
      label: "Offers",
      icon: <Calculator size={20} />,
    },
    {
      href: "/seller/checklist",
      label: "Checklist",
      icon: <CheckSquare size={20} />,
    },
    {
      href: "/glossary",
      label: "Glossary",
      icon: <BookOpen size={20} />,
    },
  ];

  const items = role === "buyer" ? buyerItems : sellerItems;

  const bottomItems: NavItem[] = [
    {
      href: "/messages",
      label: "Messages",
      icon: <MessageCircle size={20} />,
    },
    { href: "/profile", label: "Profile", icon: <UserCircle size={20} /> },
  ];

  // Mobile: 4 items — Dashboard, Properties/Listing, Messages, Profile
  const mobileItems: NavItem[] = [
    items[0], // Dashboard
    items[1], // Properties (buyer) or Listing (seller)
    bottomItems[0], // Messages
    bottomItems[1], // Profile
  ];

  return (
    <>
      {/* Desktop horizontal nav — embedded in header */}
      <nav className="hidden md:flex items-center gap-1">
        {items.map((item) => (
          <DesktopNavLink key={item.href} item={item} active={pathname === item.href} />
        ))}
        {bottomItems.map((item) => (
          <DesktopNavLink
            key={item.href}
            item={item}
            active={pathname === item.href}
            badge={item.href === "/messages" ? unreadCount : undefined}
          />
        ))}
      </nav>

      {/* Mobile bottom tabs — 4 items, glass effect */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--glass-bg)] backdrop-blur-xl border-t border-[var(--glass-border)] rounded-t-2xl z-40 safe-area-bottom">
        <div className="flex items-center justify-around px-2 py-2">
          {mobileItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 min-w-0 px-3 py-1.5 text-[11px] relative rounded-xl transition-colors ${
                  active
                    ? "text-primary bg-primary-light"
                    : "text-text-secondary"
                }`}
              >
                {item.icon}
                <span className="truncate max-w-[56px]">{item.label}</span>
                {item.href === "/messages" && unreadCount > 0 && (
                  <span className="absolute -top-0.5 right-0 bg-error text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

function DesktopNavLink({
  item,
  active,
  badge,
}: {
  item: NavItem;
  active: boolean;
  badge?: number;
}) {
  return (
    <Link
      href={item.href}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors relative ${
        active
          ? "bg-primary-light text-primary"
          : "text-text-secondary hover:bg-primary-light/50 hover:text-text-primary"
      }`}
    >
      {item.icon}
      {item.label}
      {badge && badge > 0 ? (
        <span className="bg-error text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {badge}
        </span>
      ) : null}
    </Link>
  );
}
