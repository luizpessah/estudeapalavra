export type BibleVerse = { book: string; chapter: number; verse: number; text: string; page: number };
export type BibleData = { version: string; pages: number; books: string[]; verses: BibleVerse[] };
export const normalizeBibleText = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export function searchBible(verses: BibleVerse[], query: string, book = "") {
  const term = normalizeBibleText(query.trim());
  if (!term) return { matches: [], occurrences: 0 };
  let occurrences = 0;
  const matches = verses.filter((verse) => {
    if (book && verse.book !== book) return false;
    const text = normalizeBibleText(verse.text);
    let count = 0;
    let position = text.indexOf(term);
    while (position !== -1) {
      count++;
      position = text.indexOf(term, position + term.length);
    }
    occurrences += count;
    return count > 0;
  });
  return { matches, occurrences };
}