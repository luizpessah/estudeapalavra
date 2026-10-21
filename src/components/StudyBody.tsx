import { BOOKS } from "@/lib/content";
import type { ReactNode } from "react";

const REF = new RegExp(
  String.raw`\b((?:[1-3]\s)?(?:${Object.keys(BOOKS).join("|")}))\s(\d+):(\d+(?:[-–]\d+)?(?:,\s?\d+(?:[-–]\d+)?)*)`,
  "g",
);

function withRefs(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let k = 0;
  for (const m of text.matchAll(REF)) {
    const [full, book, ch, vs] = m;
    const parts = book.split(" ");
    const abbr = parts.length > 1 ? parts[1] : parts[0];
    const name = (parts.length > 1 ? parts[0] + " " : "") + BOOKS[abbr];
    out.push(text.slice(last, m.index));
    out.push(
      <a
        key={k++}
        href={`https://www.bibliaonline.com.br/acf/busca?q=${encodeURIComponent(`${name} ${ch}:${vs}`)}`}
        target="_blank"
        rel="noreferrer"
        title={`${name} ${ch}:${vs}`}
        className="whitespace-nowrap rounded px-0.5 font-sans text-[0.9em] font-medium text-primary underline decoration-primary/30 underline-offset-2 hover:decoration-primary"
      >
        {full}
      </a>,
    );
    last = (m.index ?? 0) + full.length;
  }
  out.push(text.slice(last));
  return out;
}

const ROMAN = /^([IVXLC]+)\s*[—–-]\s*(.+)$/;
const SUB = /^([a-z]{1,2}|\d{1,2})\s*[-–)]\s+(.+)$/;

export function StudyBody({ body }: { body: string }) {
  const lines = body.split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let key = 0;
  while (i < lines.length) {
    const line = lines[i].trim();
    if (!line) { i++; continue; }
    if (lines[i].includes("\t")) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].includes("\t")) {
        rows.push(lines[i].split("\t").map((c) => c.trim()));
        i++;
      }
      const [head, ...rest] = rows;
      blocks.push(
        <div key={key++} className="my-6 -mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
          <table className="w-full min-w-[560px] border-collapse overflow-hidden rounded-xl border text-left font-sans text-sm">
            <thead className="bg-muted">
              <tr>{head.map((c, j) => <th key={j} className="border-b p-3 font-semibold text-heading">{c}</th>)}</tr>
            </thead>
            <tbody>
              {rest.map((r, ri) => (
                <tr key={ri} className="border-b last:border-0">
                  {r.map((c, j) => <td key={j} className="p-3 align-top">{withRefs(c)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }
    const r = line.match(ROMAN);
    const s = line.match(SUB);
    if (r) {
      blocks.push(
        <h2 key={key++} className="mt-10 flex gap-3 font-sans text-[1.05em] font-semibold uppercase tracking-wide text-heading">
          <span className="text-primary">{r[1]}</span><span>{withRefs(r[2])}</span>
        </h2>,
      );
    } else if (s) {
      blocks.push(
        <p key={key++} className="mt-3 flex gap-3 pl-1">
          <span className="w-5 shrink-0 font-sans font-semibold text-primary">{s[1]}</span>
          <span>{withRefs(s[2])}</span>
        </p>,
      );
    } else if (line === line.toUpperCase() && /[A-ZÀ-Ú]{3}/.test(line) && line.length < 90) {
      blocks.push(<h3 key={key++} className="mt-8 font-sans font-semibold tracking-wide text-heading">{withRefs(line)}</h3>);
    } else {
      blocks.push(<p key={key++} className="mt-3">{withRefs(line)}</p>);
    }
    i++;
  }
  return <>{blocks}</>;
}
