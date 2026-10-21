export type Study = {
  id: number;
  series: number;
  number: number;
  title: string;
  body: string;
};

const HEADER = /^\s*S[ÉE]RIE\s*(\d+)\s*[—–-]+\s*ESTUDO\s*(\d+)\s*$/i;

function titleCase(s: string) {
  const t = s.trim();
  if (t !== t.toUpperCase()) return t.charAt(0).toUpperCase() + t.slice(1);
  const small = new Set(["a", "o", "e", "de", "da", "do", "das", "dos", "em", "na", "no", "por", "para", "as", "os", "à", "ao", "sua", "seu"]);
  return t
    .toLowerCase()
    .split(/\s+/)
    .map((w, i) => (i > 0 && small.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}

/** Splits the consolidated document text into individual studies. */
export function parseStudies(raw: string): Study[] {
  const lines = raw.replace(/^\uFEFF/, "").normalize("NFC").replace(/\r/g, "").split("\n");
  const heads: { idx: number; titleIdx: number; series: number; number: number }[] = [];
  lines.forEach((l, i) => {
    const m = l.match(HEADER);
    if (!m) return;
    let j = i - 1;
    while (j >= 0 && !lines[j]!.trim()) j--;
    heads.push({ idx: i, titleIdx: j, series: +m[1]!, number: +m[2]! });
  });
  return heads.map((h, k) => {
    const end = k + 1 < heads.length ? heads[k + 1]!.titleIdx : lines.length;
    const body = lines
      .slice(h.idx + 1, end)
      .join("\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
    return {
      id: h.number,
      series: h.series,
      number: h.number,
      title: titleCase(h.titleIdx >= 0 ? lines[h.titleIdx]! : `Estudo ${h.number}`),
      body,
    };
  });
}
