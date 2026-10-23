import { useMemo, useState } from "react";
import {
  Search,
  BookOpen,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Share2,
  Bookmark,
  BookMarked,
  RotateCcw,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import crencasData from "@/data/crencas.json";
import { Highlight } from "@/components/Highlight";
import { norm } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface Crenca {
  id: number;
  title: string;
  category: string;
  rawTitle: string;
  intro: string;
  content: string;
  charCount: number;
  snippet: string;
}

const CATEGORIES = [
  "Todas",
  "Deus",
  "Grande Conflito",
  "Criação",
  "Escrituras",
  "Lei de Deus",
  "Salvação",
  "Igreja e Ordenanças",
  "Santuário e Juízo",
  "Profecia",
  "Vida Cristã",
  "Escatologia",
];

export function CrencasTab() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const [fontSize, setFontSize] = useState<"normal" | "large" | "xlarge">("normal");
  const [copied, setCopied] = useState(false);

  // Filtra as crenças com base na categoria e busca
  const filteredCrencas = useMemo(() => {
    const q = norm(search.trim());
    return (crencasData as Crenca[]).filter((c) => {
      const matchCat = category === "Todas" || c.category === category;
      if (!matchCat) return false;
      if (!q) return true;
      const fullText = norm(`${c.id} ${c.title} ${c.category} ${c.content}`);
      return fullText.includes(q);
    });
  }, [search, category]);

  const selectedCrenca = useMemo(() => {
    if (!selectedId) return null;
    return (crencasData as Crenca[]).find((c) => c.id === selectedId) || null;
  }, [selectedId]);

  const copyContent = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handlePrev = () => {
    if (!selectedId) return;
    const prevId = selectedId > 1 ? selectedId - 1 : 30;
    setSelectedId(prevId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNext = () => {
    if (!selectedId) return;
    const nextId = selectedId < 30 ? selectedId + 1 : 1;
    setSelectedId(nextId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const fontSizeClass =
    fontSize === "large"
      ? "text-lg leading-relaxed"
      : fontSize === "xlarge"
        ? "text-xl leading-loose"
        : "text-base leading-relaxed";

  return (
    <div className="space-y-6">
      {/* Header com Descrição */}
      <div className="rounded-2xl border bg-gradient-to-br from-primary/10 via-card to-card p-6 shadow-soft md:p-8">
        <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Doutrinas Bíblicas
            </div>
            <h1 className="mt-3 font-serif text-2xl font-bold tracking-tight text-heading md:text-3xl">
              Crenças Fundamentais
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
              Explore as 30 crenças e doutrinas bíblicas fundamentais com fundamentação
              escriturística, textos seletos e comentários baseados no documento oficial.
            </p>
          </div>

          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <span className="rounded-xl border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-xs">
              30 Temas Bíblicos
            </span>
          </div>
        </div>
      </div>

      {/* SELETOR PRINCIPAL DE CRENÇAS & CONTROLES */}
      <section className="space-y-4 rounded-2xl border bg-card p-4 shadow-soft md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          {/* Seletor dropdown direto para todas as 30 crenças */}
          <div className="min-w-0 flex-1">
            <label
              htmlFor="crenca-selector"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Seletor de Crenças (1 a 30)
            </label>
            <div className="relative">
              <select
                id="crenca-selector"
                value={selectedId ?? ""}
                onChange={(e) => {
                  const val = e.target.value ? Number(e.target.value) : null;
                  setSelectedId(val);
                }}
                className="h-12 w-full cursor-pointer appearance-none rounded-xl border bg-background px-4 pr-10 text-sm font-medium text-heading shadow-xs outline-none transition focus:border-primary focus:ring-2 focus:ring-ring"
              >
                <option value="">-- Selecione uma crença para leitura direta --</option>
                {(crencasData as Crenca[]).map((c) => (
                  <option key={c.id} value={c.id}>
                    {String(c.id).padStart(2, "0")}. {c.title} ({c.category})
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                ▼
              </div>
            </div>
          </div>

          {/* Campo de Busca Rápida */}
          <div className="min-w-0 flex-1">
            <label
              htmlFor="crenca-search"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Pesquisar Conteúdo ou Referência
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="crenca-search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Ex: divindade, santuário, Dn 8:14, sábado, juízo..."
                className="h-12 w-full rounded-xl border bg-background pl-10 pr-4 text-sm text-heading shadow-xs outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-heading"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filtros de Categoria */}
        <div className="pt-2">
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => {
              const active = category === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${
                    active
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "border bg-muted/60 text-muted-foreground hover:bg-muted hover:text-heading"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* MODO DETALHES / LEITURA DA CRENÇA SELECIONADA */}
      {selectedCrenca ? (
        <article className="overflow-hidden rounded-2xl border bg-card shadow-soft">
          {/* Barra de Ações Superior */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-muted/40 p-4 md:px-6">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedId(null)}
                className="gap-1.5 text-xs font-medium"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Ver Todas as Crenças
              </Button>
              <Badge variant="secondary" className="font-mono text-xs">
                Crença {String(selectedCrenca.id).padStart(2, "0")} de 30
              </Badge>
              <Badge variant="outline" className="text-xs">
                {selectedCrenca.category}
              </Badge>
            </div>

            <div className="flex min-w-0 flex-wrap items-center gap-2">
              {/* Controles de tamanho de fonte */}
              <div className="hidden items-center gap-1 rounded-lg border bg-background p-0.5 text-xs sm:flex">
                <button
                  onClick={() => setFontSize("normal")}
                  className={`rounded px-2 py-1 ${fontSize === "normal" ? "bg-muted font-bold" : "text-muted-foreground"}`}
                  title="Fonte padrão"
                >
                  A
                </button>
                <button
                  onClick={() => setFontSize("large")}
                  className={`rounded px-2 py-1 text-sm ${fontSize === "large" ? "bg-muted font-bold" : "text-muted-foreground"}`}
                  title="Fonte grande"
                >
                  A+
                </button>
                <button
                  onClick={() => setFontSize("xlarge")}
                  className={`rounded px-2 py-1 text-base ${fontSize === "xlarge" ? "bg-muted font-bold" : "text-muted-foreground"}`}
                  title="Fonte muito grande"
                >
                  A++
                </button>
              </div>

              {/* Botão Copiar */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyContent(selectedCrenca.content)}
                className="gap-1.5 text-xs text-muted-foreground hover:text-heading"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copiado!" : "Copiar"}
              </Button>

              {/* Link para Bíblia Online */}
              <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs">
                <Link to="/biblia">
                  <BookOpen className="h-3.5 w-3.5" /> Bíblia
                </Link>
              </Button>
            </div>
          </div>

          {/* Conteúdo da Crença */}
          <div className="min-w-0 p-4 sm:p-6 md:p-10">
            <header className="mb-8 border-b pb-6">
              <span className="font-mono text-sm font-semibold text-primary">
                Crença Fundamental #{String(selectedCrenca.id).padStart(2, "0")}
              </span>
              <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight text-heading md:text-4xl">
                {selectedCrenca.title}
              </h2>
            </header>

            {/* Texto integral com formatação de parágrafos */}
            <div className={`prose max-w-none text-foreground ${fontSizeClass}`}>
              {selectedCrenca.content.split(/\n\n+/).map((para, i) => {
                const trimmed = para.trim();
                if (!trimmed) return null;

                // Títulos ou seções especiais (ex: I - Deus o Pai, Leituras Seletas:)
                const isHeading =
                  /^(I|II|III|IV|V|VI|VII|VIII|IX|X)\s*[-–]/i.test(trimmed) ||
                  /^(Leituras Seletas|A encarnação|A Não-Pecaminosidade|Como era|A Morte|A expiação|Qual é|A personalidade|4 Pilares|O Sábado Nos Dias):?$/i.test(
                    trimmed,
                  );

                // Citação bíblica com aspas
                const isQuote = trimmed.startsWith("“") || trimmed.startsWith('"');

                if (isHeading) {
                  return (
                    <h3
                      key={i}
                      className="mt-8 mb-3 font-serif text-xl font-bold tracking-tight text-heading border-l-4 border-primary pl-3"
                    >
                      {trimmed}
                    </h3>
                  );
                }

                if (isQuote) {
                  return (
                    <blockquote
                      key={i}
                      className="my-4 rounded-xl border-l-4 border-primary/60 bg-muted/30 p-4 font-serif italic text-heading md:p-5"
                    >
                      {trimmed}
                    </blockquote>
                  );
                }

                return (
                  <p key={i} className="mb-4 leading-relaxed text-foreground/90 whitespace-pre-line">
                    <Highlight text={trimmed} q={search} />
                  </p>
                );
              })}
            </div>

            {/* Navegação Entre Crenças */}
            <div className="mt-12 grid grid-cols-2 items-center gap-3 border-t pt-6 sm:grid-cols-[auto_minmax(0,1fr)_auto]">
              <Button
                variant="outline"
                onClick={handlePrev}
                className="gap-2 text-xs font-medium md:text-sm"
              >
                <ChevronLeft className="h-4 w-4" /> Anterior
              </Button>

              <div className="order-last col-span-2 text-center text-xs text-muted-foreground sm:order-none sm:col-span-1">
                Navegue pelas 30 crenças fundamentais
              </div>

              <Button
                variant="outline"
                onClick={handleNext}
                className="gap-2 text-xs font-medium md:text-sm"
              >
                Próxima <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </article>
      ) : (
        /* MODO GRADE / LISTA DE TODAS AS CRENÇAS */
        <section className="space-y-4">
          <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {filteredCrencas.length} {filteredCrencas.length === 1 ? "crença encontrada" : "crenças encontradas"}
            </h2>
            {category !== "Todas" && (
              <button
                onClick={() => setCategory("Todas")}
                className="text-xs text-primary hover:underline cursor-pointer"
              >
                Limpar filtro ({category}) ✕
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredCrencas.map((c) => (
              <div
                key={c.id}
                onClick={() => {
                  setSelectedId(c.id);
                  window.scrollTo({ top: 320, behavior: "smooth" });
                }}
                className="group flex flex-col justify-between rounded-2xl border bg-card p-5 shadow-soft transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:shadow-md cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-primary">
                      #{String(c.id).padStart(2, "0")}
                    </span>
                    <Badge variant="secondary" className="text-[10px] font-normal">
                      {c.category}
                    </Badge>
                  </div>

                  <h3 className="mt-3 font-serif text-lg font-bold leading-snug text-heading transition group-hover:text-primary">
                    <Highlight text={c.title} q={search} />
                  </h3>

                  <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                    <Highlight text={c.snippet} q={search} />
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
                  <span>{(c.charCount / 1000).toFixed(1)}k caracteres</span>
                  <span className="inline-flex items-center gap-1 font-medium text-primary group-hover:underline">
                    Ler estudo <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            ))}

            {filteredCrencas.length === 0 && (
              <div className="col-span-full rounded-2xl border bg-card p-12 text-center text-muted-foreground">
                <Search className="mx-auto mb-3 h-8 w-8 opacity-40" />
                <p className="text-base font-medium">Nenhuma crença encontrada com os critérios informados.</p>
                <p className="mt-1 text-xs">Tente buscar por outro termo ou selecione "Todas" as categorias.</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearch("");
                    setCategory("Todas");
                  }}
                  className="mt-4 text-xs"
                >
                  Restaurar lista
                </Button>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
