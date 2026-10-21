import { useEffect, useState } from "react";
import base from "@/data/studies.json";
import type { Study } from "./parser";

const KEY = "estudos-base-v1";
const EVT = "estudos-updated";

export const defaultStudies = base as Study[];

function read(): Study[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as Study[];
  } catch {}
  return defaultStudies;
}

export function saveStudies(s: Study[] | null) {
  if (s) localStorage.setItem(KEY, JSON.stringify(s));
  else localStorage.removeItem(KEY);
  window.dispatchEvent(new Event(EVT));
}

/** Studies list: bundled base, overridden by a locally imported document. */
export function useStudies() {
  const [studies, setStudies] = useState<Study[]>(defaultStudies);
  useEffect(() => {
    const sync = () => setStudies(read());
    sync();
    window.addEventListener(EVT, sync);
    return () => window.removeEventListener(EVT, sync);
  }, []);
  return studies;
}

export const norm = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
