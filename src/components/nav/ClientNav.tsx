"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { usePermissions } from "@/hooks/usePermissions";

interface NavItem {
  href: string;
  label: string;
  icon: string;
  permissionKey?: string;
}

interface ClientNavProps {
  role: "buyer" | "seller";
  unreadCount: number;
  transactionId?: string;
}

export function ClientNav({ role, unreadCount, transactionId }: ClientNavProps) {
  const pathname = usePathname();
  const { hasPermission } = usePermissions(transactionId);

  const buyerItems: NavItem[] = [
    { href: "/dashboard", label: "Home", icon: "space_dashboard" },
    { href: "/buyer/properties", label: "Properties", icon: "home", permissionKey: "property" },
    {
      href: "/finance",
      label: "Finance",
      icon: "calculate",
      permissionKey: "finance",
    },
    {
      href: "/buyer/checklist",
      label: "Checklist",
      icon: "checklist",
      permissionKey: "checklist",
    },
    {
      href: "/glossary",
      label: "Glossary",
      icon: "menu_book",
    },
  ];

  const sellerItems: NavItem[] = [
    { href: "/dashboard", label: "Home", icon: "space_dashboard" },
    { href: "/seller/listing", label: "Listing", icon: "home", permissionKey: "property" },
    {
      href: "/seller/offers",
      label: "Offers",
      icon: "local_offer",
      permissionKey: "offers",
    },
    {
      href: "/finance",
      label: "Finance",
      icon: "calculate",
      permissionKey: "finance",
    },
    {
      href: "/seller/checklist",
      label: "Checklist",
      icon: "checklist",
      permissionKey: "checklist",
    },
    {
      href: "/glossary",
      label: "Glossary",
      icon: "menu_book",
    },
  ];

  const allItems = role === "buyer" ? buyerItems : sellerItems;
  // Filter by permission
  const items = allItems.filter(
    (item) => !item.permissionKey || hasPermission(item.permissionKey as never),
  );

  const allBottomItems: NavItem[] = [
    {
      href: "/messages",
      label: "Messages",
      icon: "chat_bubble",
      permissionKey: "messages",
    },
    { href: "/profile", label: "Profile", icon: "account_circle" },
  ];
  const bottomItems = allBottomItems.filter(
    (item) => !item.permissionKey || hasPermission(item.permissionKey as never),
  );

  // Mobile: 4 items — Dashboard, first role-specific, Messages (if allowed), Profile
  const mobileItems: NavItem[] = [
    items[0], // Dashboard
    items[1] || items[0], // Properties (buyer) or Listing (seller), fallback to dashboard
    ...bottomItems,
  ].filter(Boolean).slice(0, 4);

  return (
    <>
      {/* Desktop horizontal nav — embedded in header */}
      <nav aria-label="Main navigation" className="hidden md:flex items-center gap-1">
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

      {/* Mobile bottom tabs — 4 items, pill-shaped */}
      <nav aria-label="Mobile navigation" className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)] shadow-[0_-8px_32px_rgba(57,56,49,0.06)] rounded-t-[3rem] z-40 safe-area-bottom">
        <div className="flex items-center justify-around px-2 py-2">
          {mobileItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                aria-label={item.href === "/messages" && unreadCount > 0 ? `${item.label}, ${unreadCount} unread` : item.label}
                className={`flex flex-col items-center gap-0.5 min-w-0 px-4 py-1.5 text-[11px] relative transition-all ${
                  active
                    ? "text-on-primary-container bg-primary-container rounded-full scale-100"
                    : "text-on-surface-variant scale-90"
                }`}
              >
                <MaterialIcon name={item.icon} size={20} filled={active} />
                <span className="truncate max-w-[56px]">{item.label}</span>
                {item.href === "/messages" && unreadCount > 0 && (
                  <span className="absolute -top-0.5 right-0 bg-error text-on-error text-[10px] rounded-full w-4 h-4 flex items-center justify-center" aria-hidden="true">
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
      aria-current={active ? "page" : undefined}
      aria-label={badge && badge > 0 ? `${item.label}, ${badge} unread` : undefined}
      className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors relative ${
        active
          ? "bg-primary-container text-on-primary-container"
          : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
      }`}
    >
      <MaterialIcon name={item.icon} size={20} filled={active} />
      <span className="hidden lg:inline">{item.label}</span>
      {badge && badge > 0 ? (
        <span className="bg-error text-on-error text-xs rounded-full w-5 h-5 flex items-center justify-center" aria-hidden="true">
          {badge}
        </span>
      ) : null}
    </Link>
  );
}
