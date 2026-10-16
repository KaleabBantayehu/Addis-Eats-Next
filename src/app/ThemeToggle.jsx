"use client";

import { useEffect, useRef } from "react";
import { Moon, Sun } from "lucide-react";

const STORAGE_KEY = "addis-eats-theme";

function syncButton(button, isDark) {
  button?.setAttribute("aria-pressed", String(isDark));
  button?.setAttribute("aria-label", `Switch to ${isDark ? "light" : "dark"} mode`);
  button?.setAttribute("title", `Switch to ${isDark ? "light" : "dark"} mode`);
}

export default function ThemeToggle() {
  const buttonRef = useRef(null);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem(STORAGE_KEY);
    const shouldUseDark = savedTheme
      ? savedTheme === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;

    document.documentElement.classList.toggle("dark", shouldUseDark);
    syncButton(buttonRef.current, shouldUseDark);
  }, []);

  function toggleTheme() {
    const nextIsDark = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", nextIsDark);
    window.localStorage.setItem(STORAGE_KEY, nextIsDark ? "dark" : "light");
    syncButton(buttonRef.current, nextIsDark);
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={toggleTheme}
      aria-label="Switch to dark mode"
      aria-pressed="false"
      title="Switch to dark mode"
      className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-lg text-foreground-muted transition-colors hover:bg-surface-muted hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
    >
      <Moon aria-hidden="true" className="h-5 w-5 dark:hidden" />
      <Sun aria-hidden="true" className="hidden h-5 w-5 dark:block" />
    </button>
  );
}
