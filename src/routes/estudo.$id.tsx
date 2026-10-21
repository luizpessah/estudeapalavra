import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Copy, Printer, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { Shell } from "@/components/Shell";
import { StudyBody } from "@/components/StudyBody";
import { categoriesOf } from "@/lib/content";
import { defaultStudies, useStudies } from "@/lib/store";

export const Route = createFileRoute("/estudo/$id")({
  head: ({ params }) => {
    const s = defaultStudies.find((x) => String(x.id) === params.id);
    const title = s ? `${s.title} — Estudo ${s.number}` : "Estudo bíblico";
    const desc = s ? `Série ${s.series}, Estudo ${s.number}: ${s.title}. Estudo bíblico temático com referências.` : "Estudo bíblico temático.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: StudyPage,
});

function StudyPage() {
  const { id } = Route.useParams();
  const studies = useStudies();
  const idx = studies.findIndex((s) => String(s.id) === id);
  const s = studies[idx];
  const [size, setSize] = useState(18);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const v = Number(localStorage.getItem("font-size"));
    if (v) setSize(v);
  }, []);
  const changeSize = (d: number) => {
    const v = Math.min(26, Math.max(14, size + d));
    setSize(v);
    localStorage.setItem("font-size", String(v));
  };

  if (!s) {
    return (
      <Shell>
        <p className="text-center text-muted-foreground">Estudo não encontrado. <Link to="/" className="text-primary">Voltar</Link></p>
      </Shell>
    );
  }
  const prev = studies[idx - 1];
  const next = studies[idx + 1];
  const btn = "inline-flex items-center gap-1.5 rounded-lg border bg-card px-3 py-1.5 text-sm text-muted-foreground hover:text-heading";

  return (
    <Shell>
      <article key={s.id} className="mx-auto max-w-3xl animate-in fade-in slide-in-from-bottom-2 duration-300">
        <Link to="/" className="no-print mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-heading">
          <ArrowLeft className="h-4 w-4" /> Todos os estudos
        </Link>
        <header className="border-b pb-6">
          <p className="text-xs font-medium uppercase tracking-widest text-primary">Série {s.series} · Estudo {s.number}</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-heading md:text-4xl">{s.title}</h1>
          <div className="mt-3 flex flex-wrap gap-2">
            {categoriesOf(s.number).map((c) => (
              <span key={c.id} className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-0.5 text-xs text-accent-foreground">
                <c.icon className="h-3 w-3" />{c.name}
              </span>
            ))}
          </div>
          <div className="no-print mt-5 flex flex-wrap gap-2">
            <button className={btn} onClick={() => changeSize(-1)} aria-label="Diminuir fonte">A−</button>
            <button className={btn} onClick={() => changeSize(1)} aria-label="Aumentar fonte">A+</button>
            <button className={btn} onClick={async () => {
              await navigator.clipboard.writeText(`${s.title}\nSérie ${s.series} — Estudo ${s.number}\n\n${s.body}`);
              setCopied(true); setTimeout(() => setCopied(false), 1500);
            }}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? "Copiado" : "Copiar estudo"}
            </button>
            <button className={btn} onClick={() => window.print()}><Printer className="h-4 w-4" /> Imprimir / PDF</button>
          </div>
        </header>

        <div className="font-serif leading-[1.85] text-foreground" style={{ fontSize: size }}>
          <StudyBody body={s.body} />
        </div>

        <nav className="no-print mt-14 grid gap-3 border-t pt-6 sm:grid-cols-2">
          {prev ? (
            <Link to="/estudo/$id" params={{ id: String(prev.id) }} className="rounded-xl border bg-card p-4 shadow-soft hover:border-primary">
              <span className="flex items-center gap-1 text-xs text-muted-foreground"><ArrowLeft className="h-3 w-3" />Estudo anterior</span>
              <span className="mt-1 block font-medium text-heading">{prev.title}</span>
            </Link>
          ) : <span />}
          {next && (
            <Link to="/estudo/$id" params={{ id: String(next.id) }} className="rounded-xl border bg-card p-4 text-right shadow-soft hover:border-primary">
              <span className="flex items-center justify-end gap-1 text-xs text-muted-foreground">Próximo estudo<ArrowRight className="h-3 w-3" /></span>
              <span className="mt-1 block font-medium text-heading">{next.title}</span>
            </Link>
          )}
        </nav>
      </article>
    </Shell>
  );
}
