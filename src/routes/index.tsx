import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Copy,
  RefreshCw,
  Search,
  Check,
  ArrowRight,
  BookOpen,
  Sparkles,
  Lightbulb,
  BookmarkCheck,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Shell } from "@/components/Shell";
import { Highlight } from "@/components/Highlight";
import { CATEGORIES, VERSES, categoriesOf } from "@/lib/content";
import { norm, useStudies } from "@/lib/store";
import { CrencasTab } from "@/components/CrencasTab";
import { CuriosidadesTab } from "@/components/CuriosidadesTab";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Estudos Bíblicos Temáticos — Leitura e Pesquisa" },
      {
        name: "description",
        content:
          "Leia, pesquise e navegue por 71 estudos bíblicos temáticos, 30 crenças fundamentais e curiosidades bíblicas.",
      },
      { property: "og:title", content: "Estudos Bíblicos Temáticos e Crenças Fundamentais" },
      {
        property: "og:description",
        content:
          "Explore estudos bíblicos organizados por séries, 30 crenças fundamentais com seletor e fatos fascinantes das Escrituras.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function VerseCard() {
  const [i, setI] = useState(0);
  const [copied, setCopied] = useState(false);
  useEffect(() => setI(Math.floor(Math.random() * VERSES.length)), []);
  const v = VERSES[i] ?? VERSES[0]!;
  const next = () =>
    setI((c) => (c + 1 + Math.floor(Math.random() * (VERSES.length - 1))) % VERSES.length);
  const copy = async () => {
    await navigator.clipboard.writeText(`"${v.text}" — ${v.ref}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <section className="rounded-2xl border bg-card p-6 shadow-soft md:p-8">
      <p className="text-xs font-medium uppercase tracking-widest text-primary">
        Versículo do dia
      </p>
      <blockquote className="mt-3 font-serif text-lg leading-relaxed text-heading md:text-2xl">
        “{v.text}”
      </blockquote>
      <div className="mt-4 grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <cite className="text-sm not-italic text-muted-foreground">{v.ref}</cite>
        <div className="flex min-w-0 flex-wrap gap-2">
          <button
            onClick={next}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-heading cursor-pointer transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Novo versículo
          </button>
          <button
            onClick={copy}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-heading cursor-pointer transition-colors"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copiado" : "Copiar"}
          </button>
        </div>
      </div>
    </section>
  );
}

type MainTab = "estudos" | "crencas" | "curiosidades";

function Index() {
  const studies = useStudies();
  const [activeTab, setActiveTab] = useState<MainTab>("estudos");
  const [q, setQ] = useState("");
  const [dq, setDq] = useState("");
  const [series, setSeries] = useState<number | 0>(0);
  const [cat, setCat] = useState("");
  const input = useRef<HTMLInputElement>(null);

  // Sincroniza com parâmetros de URL inicial (?tab=crencas etc)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab") || params.get("aba");
      if (tabParam === "crencas" || tabParam === "crenca") {
        setActiveTab("crencas");
      } else if (tabParam === "curiosidades" || tabParam === "curiosidade") {
        setActiveTab("curiosidades");
      } else if (tabParam === "estudos") {
        setActiveTab("estudos");
      }
    }
  }, []);

  const handleTabChange = (tab: MainTab) => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (tab === "estudos") {
        url.searchParams.delete("tab");
        url.searchParams.delete("aba");
      } else {
        url.searchParams.set("tab", tab);
      }
      window.history.replaceState({}, "", url.toString());
    }
  };

  useEffect(() => {
    const t = setTimeout(() => setDq(q), 250);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const typing =
        (e.target as HTMLElement)?.tagName === "INPUT" ||
        (e.target as HTMLElement)?.tagName === "TEXTAREA";
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        if (activeTab === "estudos") {
          e.preventDefault();
          input.current?.focus();
        }
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [activeTab]);

  const seriesList = useMemo(
    () => [...new Set(studies.map((s) => s.series))].sort(),
    [studies],
  );

  const results = useMemo(() => {
    const nq = norm(dq.trim());
    return studies
      .filter((s) => !series || s.series === series)
      .filter((s) => !cat || categoriesOf(s.number).some((c) => c.id === cat))
      .map((s) => {
        if (!nq) return { s, snippet: "" };
        const cats = categoriesOf(s.number)
          .map((c) => c.name)
          .join(" ");
        const head = norm(`${s.title} estudo ${s.number} serie ${s.series} ${cats}`);
        const nb = norm(s.body);
        const f = nb.indexOf(nq);
        if (!head.includes(nq) && f < 0) return null;
        let snippet = "";
        if (f >= 0) {
          const a = Math.max(0, f - 60);
          snippet =
            (a > 0 ? "…" : "") +
            s.body.slice(a, f + nq.length + 80).replace(/\s+/g, " ") +
            "…";
        }
        return { s, snippet };
      })
      .filter(Boolean) as { s: (typeof studies)[number]; snippet: string }[];
  }, [studies, dq, series, cat]);

  const chip = (active: boolean) =>
    `rounded-full border px-3 py-1 text-sm transition-colors cursor-pointer ${
      active
        ? "border-primary bg-accent text-accent-foreground font-medium shadow-xs"
        : "bg-card text-muted-foreground hover:text-heading"
    }`;

  return (
    <Shell>
      <div className="space-y-8">
        <VerseCard />

        {/* NAVEGAÇÃO DE ABAS NA TELA PRINCIPAL */}
        <section className="flex flex-col gap-2 border-b pb-2">
          <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-3">
            <button
              onClick={() => handleTabChange("estudos")}
              className={`inline-flex min-w-0 items-center justify-center gap-2 whitespace-normal rounded-xl px-3 py-2.5 text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "estudos"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-card text-muted-foreground hover:bg-muted hover:text-heading border"
              }`}
            >
              <BookOpen className="h-4 w-4 shrink-0" />
              <span>Estudos Bíblicos</span>
              <span
                className={`ml-1 rounded-full px-2 py-0.5 text-xs ${
                  activeTab === "estudos"
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                71
              </span>
            </button>

            <button
              onClick={() => handleTabChange("crencas")}
              className={`inline-flex min-w-0 items-center justify-center gap-2 whitespace-normal rounded-xl px-3 py-2.5 text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "crencas"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-card text-muted-foreground hover:bg-muted hover:text-heading border"
              }`}
            >
              <BookmarkCheck className="h-4 w-4 shrink-0" />
              <span>Crenças Fundamentais</span>
              <span
                className={`ml-1 rounded-full px-2 py-0.5 text-xs ${
                  activeTab === "crencas"
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                30
              </span>
            </button>

            <button
              onClick={() => handleTabChange("curiosidades")}
              className={`inline-flex min-w-0 items-center justify-center gap-2 whitespace-normal rounded-xl px-3 py-2.5 text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "curiosidades"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-card text-muted-foreground hover:bg-muted hover:text-heading border"
              }`}
            >
              <Lightbulb className="h-4 w-4 shrink-0" />
              <span>Curiosidades Bíblicas</span>
            </button>
          </div>
        </section>

        {/* CONTEÚDO DA ABA SELECIONADA */}
        {activeTab === "crencas" && <CrencasTab />}

        {activeTab === "curiosidades" && <CuriosidadesTab />}

        {activeTab === "estudos" && (
          <div className="space-y-8">
            <section className="space-y-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  ref={input}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Pesquisar título, tema, tópico ou referência (ex: santuário, Dn 8:14)"
                  className="h-14 w-full rounded-2xl border bg-card pl-12 pr-4 md:pr-16 text-base text-heading shadow-soft outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
                />
                <kbd className="absolute right-4 top-1/2 hidden -translate-y-1/2 rounded border bg-muted px-1.5 py-0.5 text-xs text-muted-foreground md:block">
                  Ctrl K
                </kbd>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  className={chip(series === 0)}
                  onClick={() => setSeries(0)}
                >
                  Todas as séries
                </button>
                {seriesList.map((n) => (
                  <button
                    key={n}
                    className={chip(series === n)}
                    onClick={() => setSeries(n)}
                  >
                    Série {n}
                  </button>
                ))}
              </div>
            </section>

            {!dq && !cat && (
              <section>
                <h2 className="mb-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">
                  Categorias temáticas
                </h2>
                <div className="grid grid-cols-1 gap-3 min-[360px]:grid-cols-2 md:grid-cols-4">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setCat(c.id)}
                      className="group min-w-0 rounded-xl border bg-card p-4 text-left shadow-soft transition hover:-translate-y-0.5 hover:border-primary cursor-pointer"
                    >
                      <c.icon className="h-5 w-5 text-primary" />
                      <p className="mt-3 text-sm font-medium leading-snug text-heading">
                        {c.name}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {c.studies.length} estudos
                      </p>
                    </button>
                  ))}
                </div>
              </section>
            )}

            <section>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
                  {results.length} {results.length === 1 ? "estudo" : "estudos"}
                </h2>
                {cat && (
                  <button
                    className={chip(true)}
                    onClick={() => setCat("")}
                  >
                    {CATEGORIES.find((c) => c.id === cat)?.name} ✕
                  </button>
                )}
              </div>
              <ul className="divide-y overflow-hidden rounded-2xl border bg-card shadow-soft">
                {results.map(({ s, snippet }) => (
                  <li key={s.id}>
                    <Link
                      to="/estudo/$id"
                      params={{ id: String(s.id) }}
                      className="group flex items-start gap-4 p-4 transition-colors hover:bg-muted md:p-5"
                    >
                      <span className="mt-0.5 w-8 shrink-0 text-right font-mono text-sm text-muted-foreground">
                        {s.number}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-heading">
                          <Highlight text={s.title} q={dq} />
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          Série {s.series} ·{" "}
                          {categoriesOf(s.number)
                            .map((c) => c.name)
                            .join(" · ") || "Geral"}
                        </p>
                        {snippet && (
                          <p className="mt-2 line-clamp-2 font-serif text-sm text-foreground">
                            <Highlight text={snippet} q={dq} />
                          </p>
                        )}
                      </div>
                      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
                {results.length === 0 && (
                  <li className="p-8 text-center text-muted-foreground">
                    Nenhum estudo encontrado.
                  </li>
                )}
              </ul>
            </section>
          </div>
        )}
      </div>
    </Shell>
  );
}
