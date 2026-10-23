import { useState, useMemo } from "react";
import {
  Lightbulb,
  Search,
  Copy,
  Check,
  Sparkles,
  BookOpen,
  RefreshCw,
  HelpCircle,
  Bookmark,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import curiosidadesData from "@/data/curiosidades.json";
import { Highlight } from "@/components/Highlight";
import { norm } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface Curiosidade {
  id: number;
  title: string;
  category: string;
  verse: string;
  content: string;
  facts: string[];
}

const CATEGORIES = [
  "Todas",
  "Estatísticas",
  "Manuscritos & História",
  "Personagens",
  "Ciência & Revelação",
  "Profecia",
  "Vida Cristã & Saúde",
];

export function CuriosidadesTab() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [featuredIndex, setFeaturedIndex] = useState(0);

  const list = curiosidadesData as Curiosidade[];

  const filtered = useMemo(() => {
    const q = norm(search.trim());
    return list.filter((item) => {
      const matchCat = category === "Todas" || item.category === category;
      if (!matchCat) return false;
      if (!q) return true;
      const full = norm(`${item.title} ${item.category} ${item.verse} ${item.content} ${item.facts.join(" ")}`);
      return full.includes(q);
    });
  }, [search, category, list]);

  const featured = list[featuredIndex] ?? list[0];

  const nextFeatured = () => {
    setFeaturedIndex((prev) => (prev + 1) % list.length);
  };

  const copyItem = async (item: Curiosidade) => {
    try {
      const text = `💡 ${item.title} (${item.verse})\n\n${item.content}\n\nFatos:\n${item.facts.map((f) => `• ${f}`).join("\n")}`;
      await navigator.clipboard.writeText(text);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner / Destaque de Curiosidades */}
      <div className="rounded-2xl border bg-gradient-to-br from-amber-500/10 via-card to-card p-6 shadow-soft md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              <Lightbulb className="h-3.5 w-3.5" /> Curiosidades Bíblicas
            </div>
            <h1 className="mt-3 font-serif text-2xl font-bold tracking-tight text-heading md:text-3xl">
              Fatos Fascinantes das Escrituras
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
              Descubra fatos históricos, arqueológicos, estatísticos e proféticos sobre a Bíblia
              Sagrada, seus idiomas originais, autores e manuscritos.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={nextFeatured}
            className="gap-2 text-xs font-medium"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Nova Curiosidade em Destaque
          </Button>
        </div>

        {/* Card Destaque Dinâmico */}
        {featured && (
          <div className="mt-6 rounded-xl border border-amber-500/20 bg-card/60 p-5 backdrop-blur">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Você sabia?
              </span>
              <Badge variant="outline" className="text-[10px]">
                {featured.verse}
              </Badge>
            </div>
            <h3 className="mt-2 font-serif text-lg font-bold text-heading">{featured.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{featured.content}</p>
          </div>
        )}
      </div>

      {/* Controles de Busca e Filtros */}
      <section className="space-y-3 rounded-2xl border bg-card p-4 shadow-soft md:p-6">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar por assunto, número, palavra ou versículo..."
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

        <div className="flex flex-wrap gap-1.5 pt-1">
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
      </section>

      {/* Lista de Curiosidades */}
      <section className="space-y-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{filtered.length} curiosidades disponíveis</span>
          {category !== "Todas" && (
            <button onClick={() => setCategory("Todas")} className="text-primary hover:underline">
              Limpar filtro ✕
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-2xl border bg-card p-6 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {item.category}
                  </Badge>
                  <span className="font-mono text-xs font-semibold text-primary">
                    {item.verse}
                  </span>
                </div>

                <h3 className="mt-3 font-serif text-xl font-bold text-heading">
                  <Highlight text={item.title} q={search} />
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  <Highlight text={item.content} q={search} />
                </p>

                {item.facts && item.facts.length > 0 && (
                  <div className="mt-4 space-y-2 rounded-xl bg-muted/40 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-heading">
                      Pontos Notáveis:
                    </p>
                    <ul className="space-y-1.5 text-xs text-foreground/80">
                      {item.facts.map((fact, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-primary">•</span>
                          <span>
                            <Highlight text={fact} q={search} />
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="mt-5 flex items-center justify-between border-t pt-4">
                <Button asChild variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground">
                  <Link to="/biblia">
                    <BookOpen className="h-3.5 w-3.5" /> Consultar Bíblia
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyItem(item)}
                  className="gap-1.5 text-xs"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-green-600" /> Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" /> Copiar
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full rounded-2xl border bg-card p-12 text-center text-muted-foreground">
              <HelpCircle className="mx-auto mb-3 h-8 w-8 opacity-40" />
              <p className="text-base font-medium">Nenhuma curiosidade encontrada com esse termo.</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearch("");
                  setCategory("Todas");
                }}
                className="mt-4 text-xs"
              >
                Limpar busca
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
