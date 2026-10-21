import { describe, expect, it } from "vitest";
import { searchBible, type BibleVerse } from "./bible-search";

const verses: BibleVerse[] = [
  { book: "Salmos", chapter: 130, verse: 4, text: "Mas há perdão contigo, para que sejas temido.", page: 1029 },
  { book: "Daniel", chapter: 9, verse: 9, text: "Ao Elohim nosso Yahuh pertencem as misericórdias e o perdão, embora tenhamos nos rebelado contra ele,", page: 1423 },
];
describe("Bible document search", () => {
  it("returns every correspondence for perdão", () => {
    expect(searchBible(verses, "perdão").matches).toEqual(verses);
    expect(searchBible(verses, "perdão").occurrences).toBe(2);
  });
  it("finds the same matches without accents or with uppercase", () => {
    expect(searchBible(verses, " PERDAO ").matches).toEqual(verses);
  });
  it("does not limit results for common terms", () => {
    const many = Array.from({ length: 501 }, (_, index) => ({ ...verses[0], verse: index + 1 }));
    expect(searchBible(many, "perdão").matches).toHaveLength(501);
  });
  it("counts repeated occurrences within a verse", () => {
    expect(searchBible([{ ...verses[0], text: "perdão e perdão" }], "perdão").occurrences).toBe(2);
  });
  it("supports a book filter without searching other books", () => {
    expect(searchBible(verses, "perdão", "Daniel").matches).toEqual([verses[1]]);
  });
});