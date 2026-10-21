import { norm } from "@/lib/store";

/** Highlights accent-insensitive matches of `q` inside `text`. */
export function Highlight({ text, q }: { text: string; q: string }) {
  const nq = norm(q.trim());
  if (!nq) return <>{text}</>;
  const nt = norm(text);
  const out: React.ReactNode[] = [];
  let i = 0;
  let k = 0;
  while (true) {
    const f = nt.indexOf(nq, i);
    if (f < 0) break;
    out.push(text.slice(i, f), <mark key={k++}>{text.slice(f, f + nq.length)}</mark>);
    i = f + nq.length;
  }
  out.push(text.slice(i));
  return <>{out}</>;
}
