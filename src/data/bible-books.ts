export interface BibleBook {
  name: string;
  abbrev: string;
  slug: string;
  testament: "AT" | "NT";
  category: string;
}

export const BASE_BIBLE_URL = "https://www.bibliaonline.com.br/ara";

export const BIBLE_BOOKS: BibleBook[] = [
  // Antigo Testamento (39)
  // Pentateuco (5)
  { name: "Gênesis", abbrev: "Gn", slug: "gn", testament: "AT", category: "Pentateuco" },
  { name: "Êxodo", abbrev: "Ex", slug: "ex", testament: "AT", category: "Pentateuco" },
  { name: "Levítico", abbrev: "Lv", slug: "lv", testament: "AT", category: "Pentateuco" },
  { name: "Números", abbrev: "Nm", slug: "nm", testament: "AT", category: "Pentateuco" },
  { name: "Deuteronômio", abbrev: "Dt", slug: "dt", testament: "AT", category: "Pentateuco" },

  // Livros Históricos (12)
  { name: "Josué", abbrev: "Js", slug: "js", testament: "AT", category: "Históricos" },
  { name: "Juízes", abbrev: "Jz", slug: "jz", testament: "AT", category: "Históricos" },
  { name: "Rute", abbrev: "Rt", slug: "rt", testament: "AT", category: "Históricos" },
  { name: "1 Samuel", abbrev: "1Sm", slug: "1sm", testament: "AT", category: "Históricos" },
  { name: "2 Samuel", abbrev: "2Sm", slug: "2sm", testament: "AT", category: "Históricos" },
  { name: "1 Reis", abbrev: "1Rs", slug: "1rs", testament: "AT", category: "Históricos" },
  { name: "2 Reis", abbrev: "2Rs", slug: "2rs", testament: "AT", category: "Históricos" },
  { name: "1 Crônicas", abbrev: "1Cr", slug: "1cr", testament: "AT", category: "Históricos" },
  { name: "2 Crônicas", abbrev: "2Cr", slug: "2cr", testament: "AT", category: "Históricos" },
  { name: "Esdras", abbrev: "Ed", slug: "ed", testament: "AT", category: "Históricos" },
  { name: "Neemias", abbrev: "Ne", slug: "ne", testament: "AT", category: "Históricos" },
  { name: "Ester", abbrev: "Et", slug: "et", testament: "AT", category: "Históricos" },

  // Poéticos e Sabedoria (5)
  { name: "Jó", abbrev: "Jó", slug: "j%C3%B3", testament: "AT", category: "Poéticos" },
  { name: "Salmos", abbrev: "Sl", slug: "sl", testament: "AT", category: "Poéticos" },
  { name: "Provérbios", abbrev: "Pv", slug: "pv", testament: "AT", category: "Poéticos" },
  { name: "Eclesiastes", abbrev: "Ec", slug: "ec", testament: "AT", category: "Poéticos" },
  { name: "Cânticos", abbrev: "Ct", slug: "ct", testament: "AT", category: "Poéticos" },

  // Profetas Maiores (5)
  { name: "Isaías", abbrev: "Is", slug: "is", testament: "AT", category: "Profetas Maiores" },
  { name: "Jeremias", abbrev: "Jr", slug: "jr", testament: "AT", category: "Profetas Maiores" },
  { name: "Lamentações", abbrev: "Lm", slug: "lm", testament: "AT", category: "Profetas Maiores" },
  { name: "Ezequiel", abbrev: "Ez", slug: "ez", testament: "AT", category: "Profetas Maiores" },
  { name: "Daniel", abbrev: "Dn", slug: "dn", testament: "AT", category: "Profetas Maiores" },

  // Profetas Menores (12)
  { name: "Oseias", abbrev: "Os", slug: "os", testament: "AT", category: "Profetas Menores" },
  { name: "Joel", abbrev: "Jl", slug: "jl", testament: "AT", category: "Profetas Menores" },
  { name: "Amós", abbrev: "Am", slug: "am", testament: "AT", category: "Profetas Menores" },
  { name: "Obadias", abbrev: "Ob", slug: "ob", testament: "AT", category: "Profetas Menores" },
  { name: "Jonas", abbrev: "Jn", slug: "jn", testament: "AT", category: "Profetas Menores" },
  { name: "Miqueias", abbrev: "Mq", slug: "mq", testament: "AT", category: "Profetas Menores" },
  { name: "Naum", abbrev: "Na", slug: "na", testament: "AT", category: "Profetas Menores" },
  { name: "Habacuque", abbrev: "Hc", slug: "hc", testament: "AT", category: "Profetas Menores" },
  { name: "Sofonias", abbrev: "Sf", slug: "sf", testament: "AT", category: "Profetas Menores" },
  { name: "Ageu", abbrev: "Ag", slug: "ag", testament: "AT", category: "Profetas Menores" },
  { name: "Zacarias", abbrev: "Zc", slug: "zc", testament: "AT", category: "Profetas Menores" },
  { name: "Malaquias", abbrev: "Ml", slug: "ml", testament: "AT", category: "Profetas Menores" },

  // Novo Testamento (27)
  // Evangelhos (4)
  { name: "Mateus", abbrev: "Mt", slug: "mt", testament: "NT", category: "Evangelhos" },
  { name: "Marcos", abbrev: "Mc", slug: "mc", testament: "NT", category: "Evangelhos" },
  { name: "Lucas", abbrev: "Lc", slug: "lc", testament: "NT", category: "Evangelhos" },
  { name: "João", abbrev: "Jo", slug: "jo", testament: "NT", category: "Evangelhos" },

  // Histórico (1)
  { name: "Atos", abbrev: "At", slug: "atos", testament: "NT", category: "Histórico" },

  // Cartas Paulinas (14)
  { name: "Romanos", abbrev: "Rm", slug: "rm", testament: "NT", category: "Cartas Paulinas" },
  { name: "1 Coríntios", abbrev: "1Co", slug: "1co", testament: "NT", category: "Cartas Paulinas" },
  { name: "2 Coríntios", abbrev: "2Co", slug: "2co", testament: "NT", category: "Cartas Paulinas" },
  { name: "Gálatas", abbrev: "Gl", slug: "gl", testament: "NT", category: "Cartas Paulinas" },
  { name: "Efésios", abbrev: "Ef", slug: "ef", testament: "NT", category: "Cartas Paulinas" },
  { name: "Filipenses", abbrev: "Fp", slug: "fp", testament: "NT", category: "Cartas Paulinas" },
  { name: "Colossenses", abbrev: "Cl", slug: "cl", testament: "NT", category: "Cartas Paulinas" },
  { name: "1 Tessalonicenses", abbrev: "1Ts", slug: "1ts", testament: "NT", category: "Cartas Paulinas" },
  { name: "2 Tessalonicenses", abbrev: "2Ts", slug: "2ts", testament: "NT", category: "Cartas Paulinas" },
  { name: "1 Timóteo", abbrev: "1Tm", slug: "1tm", testament: "NT", category: "Cartas Paulinas" },
  { name: "2 Timóteo", abbrev: "2Tm", slug: "2tm", testament: "NT", category: "Cartas Paulinas" },
  { name: "Tito", abbrev: "Tt", slug: "tt", testament: "NT", category: "Cartas Paulinas" },
  { name: "Filemom", abbrev: "Fm", slug: "fm", testament: "NT", category: "Cartas Paulinas" },
  { name: "Hebreus", abbrev: "Hb", slug: "hb", testament: "NT", category: "Cartas Paulinas" },

  // Cartas Gerais (7)
  { name: "Tiago", abbrev: "Tg", slug: "tg", testament: "NT", category: "Cartas Gerais" },
  { name: "1 Pedro", abbrev: "1Pe", slug: "1pe", testament: "NT", category: "Cartas Gerais" },
  { name: "2 Pedro", abbrev: "2Pe", slug: "2pe", testament: "NT", category: "Cartas Gerais" },
  { name: "1 João", abbrev: "1Jo", slug: "1jo", testament: "NT", category: "Cartas Gerais" },
  { name: "2 João", abbrev: "2Jo", testament: "NT", slug: "2jo", category: "Cartas Gerais" },
  { name: "3 João", abbrev: "3Jo", testament: "NT", slug: "3jo", category: "Cartas Gerais" },
  { name: "Judas", abbrev: "Jd", slug: "jd", testament: "NT", category: "Cartas Gerais" },

  // Profético (1)
  { name: "Apocalipse", abbrev: "Ap", slug: "ap", testament: "NT", category: "Profético" },
];
