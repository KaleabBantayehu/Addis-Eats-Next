"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Menu, ShoppingBag, UserRound, ClipboardList } from "lucide-react";

export default function MobileNavigation({ session }) {
  const pathname = usePathname();
  const items = [
    { label: "Home", href: "/", Icon: Home },
    { label: "Menu", href: "/menu", Icon: Menu },
    { label: "Cart", href: "/cart", Icon: ShoppingBag },
    session
      ? { label: "Orders", href: "/orders", Icon: ClipboardList }
      : { label: "Sign In", href: "/signin", Icon: UserRound },
  ];

  return (
    <nav aria-label="Primary mobile navigation" className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 px-2 pt-1 shadow-elevated backdrop-blur-sm lg:hidden" style={{ paddingBottom: "max(0.25rem, env(safe-area-inset-bottom))" }}>
      <ul className="mx-auto grid max-w-xl grid-cols-4 gap-1">
        {items.map(({ label, href, Icon }) => {
          const isActive = href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-lg px-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary ${isActive ? "bg-primary text-primary-foreground" : "text-foreground-muted hover:bg-surface-muted hover:text-foreground"}`}
              >
                <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
