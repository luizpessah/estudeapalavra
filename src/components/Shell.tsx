import { Link } from "@tanstack/react-router";
import {
  BookMarked,
  BookOpen,
  Moon,
  Sun,
  Upload,
  Home,
  BookmarkCheck,
  Lightbulb,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

function useTheme() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const d = saved
      ? saved === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
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
  const nav =
    "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-heading";

  return (
    <div className="min-h-screen pb-24 md:pb-0">
      <header className="no-print sticky top-0 z-30 border-b bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 font-semibold text-heading">
            <BookMarked className="h-5 w-5 text-primary" />
            <span>Estudos Bíblicos</span>
          </Link>
          <nav className="flex items-center gap-1">
            <Link to="/" className={`${nav} hidden md:inline-flex`}>
              <Home className="h-4 w-4" />
              Início
            </Link>
            <a
              href="/?tab=crencas"
              onClick={(e) => {
                if (window.location.pathname === "/") {
                  e.preventDefault();
                  const url = new URL(window.location.href);
                  url.searchParams.set("tab", "crencas");
                  window.history.replaceState({}, "", url.toString());
                  window.dispatchEvent(new Event("popstate"));
                  window.location.search = "?tab=crencas";
                }
              }}
              className={`${nav} hidden md:inline-flex`}
            >
              <BookmarkCheck className="h-4 w-4 text-primary" />
              Crenças
            </a>
            <a
              href="/?tab=curiosidades"
              onClick={(e) => {
                if (window.location.pathname === "/") {
                  e.preventDefault();
                  const url = new URL(window.location.href);
                  url.searchParams.set("tab", "curiosidades");
                  window.history.replaceState({}, "", url.toString());
                  window.dispatchEvent(new Event("popstate"));
                  window.location.search = "?tab=curiosidades";
                }
              }}
              className={`${nav} hidden md:inline-flex`}
            >
              <Lightbulb className="h-4 w-4 text-amber-500" />
              Curiosidades
            </a>
            <Button
              asChild
              variant="ghost"
              className="hidden text-muted-foreground md:inline-flex"
            >
              <Link to="/biblia">
                <BookOpen className="h-4 w-4" />
                Bíblia
              </Link>
            </Button>
            <Link to="/importar" className={`${nav} hidden md:inline-flex`}>
              <Upload className="h-4 w-4" />
              Importar
            </Link>
            <button onClick={toggle} aria-label="Alternar tema" className={nav}>
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6 md:py-10">{children}</main>
      <nav className="no-print fixed inset-x-4 bottom-4 z-30 flex justify-around rounded-2xl border bg-card p-1.5 shadow-soft md:hidden">
        <Link to="/" className={nav}>
          <Home className="h-4 w-4" />
          <span className="text-xs">Início</span>
        </Link>
        <a href="/?tab=crencas" className={nav}>
          <BookmarkCheck className="h-4 w-4 text-primary" />
          <span className="text-xs">Crenças</span>
        </a>
        <a href="/?tab=curiosidades" className={nav}>
          <Lightbulb className="h-4 w-4 text-amber-500" />
          <span className="text-xs">Curiosidades</span>
        </a>
        <Button asChild variant="ghost" className="text-muted-foreground">
          <Link to="/biblia">
            <BookOpen className="h-4 w-4" />
            <span className="text-xs">Bíblia</span>
          </Link>
        </Button>
      </nav>
    </div>
  );
}
