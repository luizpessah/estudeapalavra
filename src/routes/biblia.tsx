import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { BookOpen, Search, ExternalLink, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Shell } from "@/components/Shell";
import { Highlight } from "@/components/Highlight";
import { Button } from "@/components/ui/button";
import bibleText from "@/assets/bible-text.json.asset.json";
import biblePdf from "@/assets/bible.pdf.asset.json";
import { searchBible, type BibleData } from "@/lib/bible-search";

export const Route = createFileRoute("/biblia")({
  head: () => ({ meta: [
    { title: "Pesquisar na Bíblia King James 1611 — Estudos Bíblicos" },
    { name: "description", content: "Pesquise todas as correspondências no documento anexado da Bíblia King James Fiel, Tradução 1611, de Gênesis a Malaquias." },
    { property: "og:title", content: "Bíblia King James Fiel — Pesquisa" },
    { property: "og:description", content: "Consulte os versículos e o PDF da Bíblia King James Fiel, Tradução 1611." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: BiblePage,
});

function BiblePage() {
  const [data, setData] = useState<BibleData | null>(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [query, setQuery] = useState("");
  const [term, setTerm] = useState("");
  const [book, setBook] = useState("");
  const [page, setPage] = useState(1);
  const [readingBook, setReadingBook] = useState("Gênesis");
  const [chapter, setChapter] = useState(1);
  useEffect(() => {
    const controller = new AbortController();
    setError(false);
    fetch(bibleText.url, { signal: controller.signal }).then((response) => {
      if (!response.ok) throw new Error("Bible unavailable");
      return response.json();
    }).then((result: BibleData) => setData(result)).catch(() => {
      if (!controller.signal.aborted) setError(true);
    });
    return () => controller.abort();
  }, [attempt]);
  useEffect(() => {
    const timer = setTimeout(() => { setTerm(query.trim()); setPage(1); }, 250);
    return () => clearTimeout(timer);
  }, [query]);
  const results = useMemo(() => searchBible(data?.verses ?? [], term, book), [data, term, book]);
  const totalPages = Math.ceil(results.matches.length / 50);
  const visible = results.matches.slice((page - 1) * 50, page * 50);
  const chapterCount = useMemo(() => Math.max(1, ...(data?.verses.filter((v) => v.book === readingBook).map((v) => v.chapter) ?? [])), [data, readingBook]);
  const reading = useMemo(() => data?.verses.filter((v) => v.book === readingBook && v.chapter === chapter) ?? [], [data, readingBook, chapter]);
  const selectClass = "h-10 min-w-0 rounded-md border bg-card px-3 text-sm text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
  const pagination = <nav aria-label="Páginas de resultados" className="flex flex-wrap items-center justify-between gap-3 border-t py-4">
    <span className="text-sm text-muted-foreground">Página {page} de {totalPages} · {((page - 1) * 50 + 1).toLocaleString("pt-BR")}–{Math.min(page * 50, results.matches.length).toLocaleString("pt-BR")} de {results.matches.length.toLocaleString("pt-BR")} versículos</span>
    <div className="flex gap-2">
      <Button variant="outline" size="icon" aria-label="Página anterior" title="Página anterior" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}><ChevronLeft /></Button>
      <Button variant="outline" size="icon" aria-label="Próxima página" title="Próxima página" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}><ChevronRight /></Button>
    </div>
  </nav>;
  return <Shell>
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="border-b pb-6">
        <p className="flex items-center gap-2 text-sm font-medium text-primary"><BookOpen className="h-4 w-4" />Bíblia anexada</p>
        <h1 className="mt-2 text-3xl font-bold text-heading">Bíblia King James Fiel</h1>
        <p className="mt-2 text-muted-foreground">Tradução 1611 · Antigo Testamento · Gênesis a Malaquias</p>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <Button asChild variant="outline"><a href={biblePdf.url} target="_blank" rel="noreferrer"><ExternalLink />Abrir PDF original</a></Button>
          <span className="text-xs text-muted-foreground">1.504 páginas{data && ` · ${data.verses.length.toLocaleString("pt-BR")} versículos`}</span>
        </div>
      </header>
      <section aria-label="Pesquisa na Bíblia" className="space-y-3">
        <label htmlFor="bible-search" className="text-sm font-medium text-heading">Pesquisar na Bíblia</label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input id="bible-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Pesquisar palavra ou expressão, ex.: perdão" className="h-14 w-full rounded-lg border bg-card pl-12 pr-12 text-heading outline-none focus:ring-2 focus:ring-ring [&::-webkit-search-cancel-button]:appearance-none" />
          {query && <Button variant="ghost" size="icon" aria-label="Limpar pesquisa" title="Limpar pesquisa" className="absolute right-2 top-1/2 -translate-y-1/2" onClick={() => setQuery("")}><X /></Button>}
        </div>
        <select aria-label="Filtrar pesquisa por livro" value={book} onChange={(e) => { setBook(e.target.value); setPage(1); }} className={`${selectClass} w-full sm:w-64`}>
          <option value="">Todos os livros</option>
          {data?.books.map((b) => <option key={b}>{b}</option>)}
        </select>
      </section>
      {error ? <div role="alert" className="space-y-3"><p className="text-destructive">Não foi possível carregar a Bíblia.</p><Button variant="outline" onClick={() => setAttempt((a) => a + 1)}>Tentar novamente</Button></div> : !data ? <p role="status" className="text-muted-foreground">Carregando Bíblia…</p> : term ? <section aria-live="polite" aria-busy={query.trim() !== term}>
        <h2 className="text-lg font-semibold text-heading">{results.occurrences.toLocaleString("pt-BR")} {results.occurrences === 1 ? "correspondência" : "correspondências"} em {results.matches.length.toLocaleString("pt-BR")} {results.matches.length === 1 ? "versículo" : "versículos"}</h2>
        <p className="mt-1 mb-4 break-words text-sm text-muted-foreground">“{term}”{book ? ` · ${book}` : " · Todos os livros"}</p>
        {results.matches.length === 0 ? <p className="border-t py-8 text-muted-foreground">Nenhuma correspondência encontrada no arquivo da Bíblia.</p> : <>
          {totalPages > 1 && pagination}
          <ol className="divide-y border-t">
            {visible.map((v) => <li key={`${v.book}-${v.chapter}-${v.verse}`} className="py-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-semibold text-primary">{v.book} {v.chapter}:{v.verse}</h3>
                <a className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary" href={`${biblePdf.url}#page=${v.page}`} target="_blank" rel="noreferrer">Página {v.page}<ExternalLink className="h-3 w-3" /></a>
              </div>
              <p className="mt-2 break-words font-serif text-base leading-relaxed"><Highlight text={v.text} q={term} /></p>
            </li>)}
          </ol>
          {totalPages > 1 && pagination}
        </>}
      </section> : <section>
        <h2 className="mb-4 text-lg font-semibold text-heading">Leitura da Bíblia</h2>
        <div className="mb-6 flex gap-3">
          <select aria-label="Livro para leitura" className={`${selectClass} flex-1`} value={readingBook} onChange={(e) => { setReadingBook(e.target.value); setChapter(1); }}>{data.books.map((b) => <option key={b}>{b}</option>)}</select>
          <select aria-label="Capítulo" className={selectClass} value={chapter} onChange={(e) => setChapter(Number(e.target.value))}>{Array.from({ length: chapterCount }, (_, i) => <option key={i} value={i + 1}>Capítulo {i + 1}</option>)}</select>
        </div>
        <h3 className="mb-4 font-serif text-xl font-bold text-heading">{readingBook} {chapter}</h3>
        <div className="space-y-3 font-serif text-base leading-relaxed">{reading.map((v) => <p key={v.verse}><span className="mr-2 font-sans text-xs font-semibold text-primary">{v.verse}</span>{v.text}</p>)}</div>
        <div className="mt-6 flex justify-between border-t pt-4"><Button variant="outline" disabled={chapter <= 1} onClick={() => setChapter((c) => c - 1)}><ChevronLeft />Anterior</Button><Button variant="outline" disabled={chapter >= chapterCount} onClick={() => setChapter((c) => c + 1)}>Próximo<ChevronRight /></Button></div>
      </section>}
    </div>
  </Shell>;
}