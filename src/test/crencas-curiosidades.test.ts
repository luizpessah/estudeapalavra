import { describe, expect, it } from "vitest";
import crencasData from "@/data/crencas.json";
import curiosidadesData from "@/data/curiosidades.json";

describe("Crenças Fundamentais Data", () => {
  it("contains all 30 fundamental beliefs", () => {
    expect(crencasData).toHaveLength(30);
  });

  it("each belief has required fields and content", () => {
    crencasData.forEach((c, index) => {
      expect(c.id).toBe(index + 1);
      expect(c.title).toBeTruthy();
      expect(c.category).toBeTruthy();
      expect(c.content.length).toBeGreaterThan(100);
      expect(c.snippet).toBeTruthy();
    });
  });

  it("contains specific critical themes like A Divindade, Santuário, O Sábado", () => {
    const titles = crencasData.map((c) => c.title);
    expect(titles.some((t) => t.includes("A Divindade"))).toBe(true);
    expect(titles.some((t) => t.includes("O Sábado"))).toBe(true);
    expect(titles.some((t) => t.includes("O Santuário"))).toBe(true);
    expect(titles.some((t) => t.includes("O Juízo"))).toBe(true);
    expect(titles.some((t) => t.includes("A Nova Terra"))).toBe(true);
  });
});

describe("Curiosidades Bíblicas Data", () => {
  it("contains curated biblical curiosities", () => {
    expect(curiosidadesData.length).toBeGreaterThanOrEqual(5);
  });

  it("each curiosity has category, verse, content, and facts", () => {
    curiosidadesData.forEach((item) => {
      expect(item.title).toBeTruthy();
      expect(item.category).toBeTruthy();
      expect(item.verse).toBeTruthy();
      expect(item.content).toBeTruthy();
      expect(item.facts.length).toBeGreaterThan(0);
    });
  });
});
