import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useRef } from "react";
import {
  BookOpen,
  Search,
  RotateCcw,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  BookMarked,
  Sparkles,
} from "lucide-react";
import { Shell } from "@/components/Shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BIBLE_BOOKS, BASE_BIBLE_URL, type BibleBook } from "@/data/bible-books";

export const Route = createFileRoute("/biblia")({
  head: () => ({
    meta: [
      { title: "Bíblia Online (ARA) — Estudos Bíblicos" },
      {
        name: "description",
        content:
          "Leia e consulte a Bíblia Sagrada online na versão Almeida Revista e Atualizada (ARA) diretamente no aplicativo.",
      },
      { property: "og:title", content: "Bíblia Sagrada Online (ARA)" },
      {
        property: "og:description",
        content:
          "Navegue pelos 66 livros do Antigo e Novo Testamento na versão Almeida Revista e Atualizada.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BiblePage,
});

type TestamentFilter = "todos" | "AT" | "NT";

function BiblePage() {
  const [selectedBook, setSelectedBook] = useState<BibleBook | null>(null);
  const [testamentFilter, setTestamentFilter] = useState<TestamentFilter>("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const readerSectionRef = useRef<HTMLDivElement>(null);

  // Computa a URL do iframe
  const currentUrl = useMemo(() => {
    if (!selectedBook) return BASE_BIBLE_URL;
    return `${BASE_BIBLE_URL}/${selectedBook.slug}`;
  }, [selectedBook]);

  // Filtra os livros por testamento e busca
  const filteredBooks = useMemo(() => {
    return BIBLE_BOOKS.filter((b) => {
      const matchTestament =
        testamentFilter === "todos" ? true : b.testament === testamentFilter;
      const normalizedSearch = searchTerm.trim().toLowerCase();
      const matchSearch =
        normalizedSearch === "" ||
        b.name.toLowerCase().includes(normalizedSearch) ||
        b.abbrev.toLowerCase().includes(normalizedSearch) ||
        b.category.toLowerCase().includes(normalizedSearch);
      return matchTestament && matchSearch;
    });
  }, [testamentFilter, searchTerm]);

  // Agrupa livros por categoria
  const booksByCategory = useMemo(() => {
    const map = new Map<string, BibleBook[]>();
    for (const book of filteredBooks) {
      const list = map.get(book.category) ?? [];
      list.push(book);
      map.set(book.category, list);
    }
    return map;
  }, [filteredBooks]);

  const handleSelectBook = (book: BibleBook | null) => {
    setSelectedBook(book);
    // Rolagem suave até o leitor caso o usuário selecione um livro na grade
    if (readerSectionRef.current) {
      readerSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const currentIndex = selectedBook
    ? BIBLE_BOOKS.findIndex((b) => b.slug === selectedBook.slug)
    : -1;

  const handlePrevBook = () => {
    if (currentIndex > 0) {
      handleSelectBook(BIBLE_BOOKS[currentIndex - 1] ?? null);
    }
  };

  const handleNextBook = () => {
    if (currentIndex >= 0 && currentIndex < BIBLE_BOOKS.length - 1) {
      handleSelectBook(BIBLE_BOOKS[currentIndex + 1] ?? null);
    } else if (currentIndex === -1) {
      handleSelectBook(BIBLE_BOOKS[0] ?? null);
    }
  };

  const handleReload = () => {
    if (iframeRef.current) {
      iframeRef.current.src = currentUrl;
    }
  };

  return (
    <Shell>
      <div className="space-y-6">
        {/* Cabeçalho */}
        <header className="border-b pb-6">
          <div className="grid min-w-0 grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
            <div className="min-w-0">
              <p className="flex items-center gap-2 text-sm font-medium text-primary">
                <BookOpen className="h-4 w-4" />
                Bíblia Sagrada Integrada
              </p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-heading">
                Bíblia Online (ARA)
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Versão Almeida Revista e Atualizada · Antigo Testamento (39 livros) e Novo Testamento (27 livros)
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant={selectedBook === null ? "default" : "outline"}
                size="sm"
                onClick={() => handleSelectBook(null)}
                className="gap-1.5"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Início da ARA
              </Button>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground"
              >
                <a
                  href={currentUrl}
                  target="_blank"
                  rel="noreferrer"
                  title="Abrir no site da Bíblia Online em nova guia"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Abrir no site
                </a>
              </Button>
            </div>
          </div>
        </header>

        {/* Barra de Filtro e Seleção de Livros */}
        <section
          aria-label="Seleção e navegação de livros"
          className="rounded-2xl border bg-card p-4 shadow-sm md:p-6"
        >
          <div className="flex flex-col gap-4">
            {/* Abas de Testamento + Busca rápida */}
            <div className="grid min-w-0 gap-3 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-center">
              <div className="grid min-w-0 grid-cols-3 items-stretch rounded-lg border bg-muted/40 p-1">
                <button
                  type="button"
                  onClick={() => setTestamentFilter("todos")}
                  className={`min-w-0 rounded-md px-1 py-2 text-xs font-semibold transition-all sm:text-sm ${
                    testamentFilter === "todos"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Todos (66)
                </button>
                <button
                  type="button"
                  onClick={() => setTestamentFilter("AT")}
                  className={`min-w-0 rounded-md px-1 py-2 text-xs font-semibold transition-all sm:text-sm ${
                    testamentFilter === "AT"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Antigo Testamento (39)
                </button>
                <button
                  type="button"
                  onClick={() => setTestamentFilter("NT")}
                  className={`min-w-0 rounded-md px-1 py-2 text-xs font-semibold transition-all sm:text-sm ${
                    testamentFilter === "NT"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Novo Testamento (27)
                </button>
              </div>

              {/* Busca rápida de livro */}
              <div className="relative min-w-0 w-full">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filtrar livro (ex: Salmos)..."
                  className="h-9 w-full rounded-lg border bg-background pl-9 pr-3 text-xs outline-none focus:ring-2 focus:ring-ring sm:text-sm"
                />
              </div>
            </div>

            {/* Menu Dropdown de Seleção Rápida */}
            <div className="grid min-w-0 gap-2 border-t pt-3 sm:flex sm:flex-wrap sm:items-center">
              <span className="text-xs font-medium text-muted-foreground">
                Escolher livro rápido:
              </span>
              <select
                aria-label="Escolher livro da Bíblia"
                value={selectedBook?.slug ?? ""}
                onChange={(e) => {
                  const slug = e.target.value;
                  const found = BIBLE_BOOKS.find((b) => b.slug === slug) ?? null;
                  handleSelectBook(found);
                }}
                className="h-10 w-full min-w-0 sm:max-w-xs rounded-md border bg-background px-3 text-xs text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:text-sm"
              >
                <option value="">📖 Página Inicial ARA (Visão Geral)</option>
                <optgroup label="Antigo Testamento (Gênesis a Malaquias)">
                  {BIBLE_BOOKS.filter((b) => b.testament === "AT").map((b) => (
                    <option key={b.slug} value={b.slug}>
                      {b.name} ({b.abbrev})
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Novo Testamento (Mateus a Apocalipse)">
                  {BIBLE_BOOKS.filter((b) => b.testament === "NT").map((b) => (
                    <option key={b.slug} value={b.slug}>
                      {b.name} ({b.abbrev})
                    </option>
                  ))}
                </optgroup>
              </select>

              {selectedBook && (
                <Badge variant="secondary" className="gap-1 text-xs">
                  <BookMarked className="h-3 w-3" />
                  Livro ativo: <strong className="font-semibold">{selectedBook.name}</strong>
                </Badge>
              )}
            </div>

            {/* Grade de Livros com Categorias Bíblicas */}
            <div className="space-y-4 border-t pt-3">
              {Array.from(booksByCategory.entries()).map(([category, books]) => (
                <div key={category} className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {category}
                    </span>
                    <span className="h-px flex-1 bg-border/60" />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {books.map((b) => {
                      const isSelected = selectedBook?.slug === b.slug;
                      return (
                        <button
                          key={b.slug}
                          type="button"
                          onClick={() => handleSelectBook(b)}
                          className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                            isSelected
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "bg-muted/70 text-foreground hover:bg-muted hover:text-primary"
                          }`}
                        >
                          <span className="font-semibold">{b.abbrev}</span>
                          <span className="opacity-90">{b.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {filteredBooks.length === 0 && (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  Nenhum livro encontrado com o termo “{searchTerm}”.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Seção do Leitor da Bíblia Online (Dentro do Aplicativo) */}
        <section
          ref={readerSectionRef}
          aria-label="Leitor da Bíblia Online"
          className={`space-y-3 transition-all ${
            isFullscreen
              ? "fixed inset-0 z-50 flex min-h-0 flex-col bg-background p-2 sm:p-4"
              : "relative"
          }`}
        >
          {/* Barra de controle do leitor */}
          <div className="grid min-w-0 grid-cols-1 gap-2 rounded-xl border bg-card px-2 py-2.5 shadow-sm lg:grid-cols-[minmax(0,1fr)_auto]">
            <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled={currentIndex <= 0}
                onClick={handlePrevBook}
                title="Livro anterior"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Anterior</span>
              </Button>

              <div className="flex min-w-0 flex-col items-center justify-center gap-1 px-1 sm:flex-row">
                <span className="max-w-full truncate text-sm font-semibold text-heading">
                  {selectedBook ? selectedBook.name : "Bíblia Online ARA"}
                </span>
                {selectedBook && (
                  <Badge variant="outline" className="text-[10px]">
                    {selectedBook.testament === "AT"
                      ? "Antigo Testamento"
                      : "Novo Testamento"}
                  </Badge>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                disabled={currentIndex >= BIBLE_BOOKS.length - 1}
                onClick={handleNextBook}
                title="Próximo livro"
              >
                <span className="hidden sm:inline">Próximo</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex shrink-0 items-center justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReload}
                title="Recarregar página da Bíblia"
                className="gap-1 text-xs text-muted-foreground"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Recarregar</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFullscreen((prev) => !prev)}
                title={isFullscreen ? "Sair da tela cheia" : "Modo expandido"}
                className="gap-1 text-xs text-muted-foreground"
              >
                {isFullscreen ? (
                  <>
                    <Minimize2 className="h-3.5 w-3.5" />
                    <span>Sair</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="h-3.5 w-3.5" />
                    <span>Expandir</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Iframe incorporado dentro do App */}
          <div
            className={`overflow-hidden rounded-2xl border bg-card shadow-sm ${
              isFullscreen ? "min-h-0 flex-1" : "h-[75dvh] min-h-[360px] max-h-[1000px]"
            }`}
          >
            <iframe
              ref={iframeRef}
              src={currentUrl}
              title="Bíblia Online - Versão Almeida Revista e Atualizada"
              className="h-full w-full border-0"
              loading="lazy"
              allow="clipboard-write; fullscreen"
            />
          </div>
        </section>
      </div>
    </Shell>
  );
}
