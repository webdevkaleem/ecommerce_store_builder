"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeSwitch() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  function toggleTheme() {
    if (theme === "dark") {
      // Whenever the user explicitly chooses light mode
      localStorage.theme = "light";
      document.documentElement.classList.toggle("dark");
      setTheme("light");
    } else {
      // Whenever the user explicitly chooses dark mode
      localStorage.theme = "dark";
      document.documentElement.classList.toggle("dark");
      setTheme("dark");
    }
  }

  useEffect(() => {
    if (localStorage.getItem("theme") === "light") {
      setTheme("light");
    } else if (localStorage.getItem("theme") === "dark") {
      setTheme("dark");
    }
  }, []);

  return (
    <div className="flex w-full gap-2">
      {theme === "dark" && (
        <div
          className="flex w-full items-center justify-between"
          onClick={toggleTheme}
        >
          <span>Light</span>
          <Sun className="w-4" />
        </div>
      )}

      {theme === "light" && (
        <div
          className="flex w-full items-center justify-between"
          onClick={toggleTheme}
        >
          <span>Dark</span>
          <Moon className="w-4" />
        </div>
      )}
    </div>
  );
}
