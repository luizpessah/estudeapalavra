import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FileUp, Download, RotateCcw, Save, Pencil } from "lucide-react";
import { useState } from "react";
import { Shell } from "@/components/Shell";
import { parseStudies, type Study } from "@/lib/parser";
import { saveStudies, useStudies } from "@/lib/store";

export const Route = createFileRoute("/importar")({
  head: () => ({
    meta: [
      { title: "Importar documento — Estudos Bíblicos" },
      { name: "description", content: "Importe o documento Word consolidado de estudos bíblicos e valide os estudos extraídos." },
      { property: "og:title", content: "Importar documento de estudos" },
      { property: "og:description", content: "Envie o arquivo .docx e revise cada estudo antes de publicar." },
    ],
  }),
  component: ImportPage,
});

function ImportPage() {
  const current = useStudies();
  const navigate = useNavigate();
  const [preview, setPreview] = useState<Study[] | null>(null);
  const [editing, setEditing] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const onFile = async (f: File) => {
    setError(""); setBusy(true);
    try {
      let text = "";
      if (f.name.toLowerCase().endsWith(".docx")) {
        const mammoth = await import("mammoth");
        text = (await mammoth.extractRawText({ arrayBuffer: await f.arrayBuffer() })).value;
      } else if (/\.(txt|md)$/i.test(f.name)) {
        text = await f.text();
      } else {
        throw new Error("Formato não suportado. Salve o documento como .docx no Word.");
      }
      const parsed = parseStudies(text);
      if (!parsed.length) throw new Error("Nenhum cabeçalho “SÉRIE X — ESTUDO Y” foi encontrado.");
      setPreview(parsed);
    } catch (e) {
      setError((e as Error).message);
    } finally { setBusy(false); }
  };

  const update = (i: number, patch: Partial<Study>) =>
    setPreview((p) => p && p.map((s, j) => (j === i ? { ...s, ...patch } : s)));

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(current, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "estudos.json";
    a.click();
  };

  const btn = "inline-flex items-center gap-2 rounded-lg border bg-card px-4 py-2 text-sm text-heading hover:bg-muted";

  return (
    <Shell>
      <div className="mx-auto max-w-3xl space-y-6">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-heading">Documento master</h1>
          <p className="mt-2 text-muted-foreground">Base atual: {current.length} estudos. Envie uma nova versão do documento para atualizar.</p>
        </header>

        <label className="flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed bg-card p-10 text-center hover:border-primary">
          <FileUp className="h-8 w-8 text-primary" />
          <span className="font-medium text-heading">{busy ? "Processando…" : "Selecionar arquivo .docx"}</span>
          <span className="text-sm text-muted-foreground">ESTUDOS BÍBLICOS TEMÁTICOS - VERSÃO COMPLETA</span>
          <input type="file" accept=".docx,.txt" className="hidden" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
        </label>
        {error && <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}

        <div className="flex flex-wrap gap-2">
          <button className={btn} onClick={exportJson}><Download className="h-4 w-4" />Exportar base (JSON)</button>
          <button className={btn} onClick={() => saveStudies(null)}><RotateCcw className="h-4 w-4" />Restaurar base original</button>
        </div>

        {preview && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-0 md:items-center md:p-6">
            <div className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-t-2xl bg-card shadow-soft md:rounded-2xl">
              <div className="border-b p-5">
                <h2 className="text-lg font-semibold text-heading">Pré-visualização: {preview.length} estudos extraídos</h2>
                <p className="text-sm text-muted-foreground">Revise e corrija antes de publicar.</p>
              </div>
              <ul className="flex-1 divide-y overflow-y-auto">
                {preview.map((s, i) => (
                  <li key={i} className="p-4">
                    <div className="flex items-center gap-3">
                      <span className="w-14 shrink-0 font-mono text-xs text-muted-foreground">S{s.series}·E{s.number}</span>
                      <input value={s.title} onChange={(e) => update(i, { title: e.target.value })} className="min-w-0 flex-1 rounded border-transparent bg-transparent px-1 font-medium text-heading outline-none focus:bg-muted" />
                      <span className="hidden shrink-0 text-xs text-muted-foreground sm:inline">{s.body.length.toLocaleString("pt-BR")} car.</span>
                      <button onClick={() => setEditing(editing === i ? null : i)} aria-label="Editar conteúdo" className="rounded p-1.5 text-muted-foreground hover:bg-muted"><Pencil className="h-4 w-4" /></button>
                    </div>
                    {editing === i && (
                      <textarea value={s.body} onChange={(e) => update(i, { body: e.target.value })} className="mt-3 h-64 w-full rounded-lg border bg-background p-3 font-mono text-xs outline-none focus:ring-2 focus:ring-ring" />
                    )}
                  </li>
                ))}
              </ul>
              <div className="flex justify-end gap-2 border-t p-4">
                <button className={btn} onClick={() => setPreview(null)}>Cancelar</button>
                <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                  onClick={() => { saveStudies(preview); setPreview(null); navigate({ to: "/" }); }}>
                  <Save className="h-4 w-4" />Publicar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Shell>
  );
}
