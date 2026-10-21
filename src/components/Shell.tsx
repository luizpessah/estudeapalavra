import { Link } from "@tanstack/react-router";
import { BookMarked, Moon, Sun, Upload, Home } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

function useTheme() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const d = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(d);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);
  const toggle = () => {
    localStorage.setItem("theme", dark ? "light" : "dark");
    setDark(!dark);
  };
  return { dark, toggle };
}

export function Shell({ children }: { children: ReactNode }) {
  const { dark, toggle } = useTheme();
  const nav = "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-heading";
  return (
    <div className="min-h-screen pb-24 md:pb-0">
      <header className="no-print sticky top-0 z-30 border-b bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 font-semibold text-heading">
            <BookMarked className="h-5 w-5 text-primary" />
            <span>Estudos Bíblicos</span>
          </Link>
          <nav className="flex items-center gap-1">
            <Link to="/" className={`${nav} hidden md:inline-flex`}><Home className="h-4 w-4" />Início</Link>
            <Link to="/importar" className={`${nav} hidden md:inline-flex`}><Upload className="h-4 w-4" />Importar</Link>
            <button onClick={toggle} aria-label="Alternar tema" className={nav}>
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6 md:py-10">{children}</main>
      <nav className="no-print fixed inset-x-4 bottom-4 z-30 flex justify-around rounded-2xl border bg-card p-1 shadow-soft md:hidden">
        <Link to="/" className={nav}><Home className="h-4 w-4" />Início</Link>
        <Link to="/importar" className={nav}><Upload className="h-4 w-4" />Importar</Link>
      </nav>
    </div>
  );
}
