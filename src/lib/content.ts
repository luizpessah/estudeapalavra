import { BookOpen, Sprout, Scale, Hourglass, Landmark, Home, Flame, Infinity as InfinityIcon, type LucideIcon } from "lucide-react";

export type Category = { id: string; name: string; icon: LucideIcon; studies: number[] };

export const CATEGORIES: Category[] = [
  { id: "palavra", name: "A Palavra e a Divindade", icon: BookOpen, studies: [1, 2, 31, 32, 33, 64] },
  { id: "origens", name: "Origens e Redenção", icon: Sprout, studies: [3, 4, 5, 6, 7, 41, 42, 71] },
  { id: "lei", name: "A Lei e os Mandamentos", icon: Scale, studies: [14, 15, 28, 34, 35, 36, 37, 38, 49, 63] },
  { id: "profecias", name: "Profecias e Escatologia", icon: Hourglass, studies: [8, 9, 10, 11, 12, 13, 22, 23, 44, 45, 46, 47, 51, 54, 57, 58, 70] },
  { id: "santuario", name: "O Santuário Celestial", icon: Landmark, studies: [21, 22, 23, 39, 51] },
  { id: "igreja", name: "Igreja, Vida Cristã e Saúde", icon: Home, studies: [17, 24, 25, 26, 27, 29, 30, 40, 50, 52, 53, 55, 56, 59, 60, 61, 62, 65, 66, 67, 68, 69] },
  { id: "espirito", name: "Espírito Santo e Dons", icon: Flame, studies: [18, 19, 20, 43, 48] },
  { id: "eternidade", name: "Morte e Eternidade", icon: InfinityIcon, studies: [16, 10, 11] },
];

export const categoriesOf = (n: number) => CATEGORIES.filter((c) => c.studies.includes(n));

export const VERSES = [
  { ref: "Salmos 119:105", text: "Lâmpada para os meus pés é a tua palavra, e luz para o meu caminho." },
  { ref: "João 5:39", text: "Examinais as Escrituras, porque vós cuidais ter nelas a vida eterna, e são elas que de mim testificam." },
  { ref: "2 Timóteo 3:16-17", text: "Toda a Escritura é divinamente inspirada, e proveitosa para ensinar, para redarguir, para corrigir, para instruir em justiça; para que o homem de Deus seja perfeito, e perfeitamente instruído para toda a boa obra." },
  { ref: "Isaías 40:8", text: "Seca-se a erva, e caem as flores, mas a palavra de nosso Deus subsiste eternamente." },
  { ref: "Provérbios 3:5-6", text: "Confia no Senhor de todo o teu coração, e não te estribes no teu próprio entendimento. Reconhece-o em todos os teus caminhos, e ele endireitará as tuas veredas." },
  { ref: "João 14:1-3", text: "Não se turbe o vosso coração; credes em Deus, crede também em mim. Na casa de meu Pai há muitas moradas... virei outra vez, e vos levarei para mim mesmo, para que onde eu estiver estejais vós também." },
  { ref: "Apocalipse 14:12", text: "Aqui está a paciência dos santos; aqui estão os que guardam os mandamentos de Deus e a fé em Jesus." },
  { ref: "Romanos 15:4", text: "Porque tudo que dantes foi escrito, para nosso ensino foi escrito, para que pela paciência e consolação das Escrituras tenhamos esperança." },
  { ref: "Tiago 1:5", text: "E, se algum de vós tem falta de sabedoria, peça-a a Deus, que a todos dá liberalmente, e o não lança em rosto, e ser-lhe-á dada." },
  { ref: "Jeremias 29:11", text: "Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz, e não de mal, para vos dar o fim que esperais." },
  { ref: "Hebreus 11:6", text: "Ora, sem fé é impossível agradar-lhe; porque é necessário que aquele que se aproxima de Deus creia que ele existe, e que é galardoador dos que o buscam." },
  { ref: "Mateus 24:35", text: "O céu e a terra passarão, mas as minhas palavras não hão de passar." },
];

export const BOOKS: Record<string, string> = {
  Gn: "Gênesis", Ex: "Êxodo", Lv: "Levítico", Nm: "Números", Dt: "Deuteronômio", Js: "Josué", Jz: "Juízes", Rt: "Rute",
  Sm: "Samuel", Rs: "Reis", Cr: "Crônicas", Ed: "Esdras", Ne: "Neemias", Et: "Ester", Jó: "Jó", Sl: "Salmos", Pv: "Provérbios",
  Ec: "Eclesiastes", Ct: "Cantares", Is: "Isaías", Jr: "Jeremias", Lm: "Lamentações", Ez: "Ezequiel", Dn: "Daniel", Os: "Oséias",
  Jl: "Joel", Am: "Amós", Ob: "Obadias", Jn: "Jonas", Mq: "Miquéias", Na: "Naum", Hc: "Habacuque", Sf: "Sofonias", Ag: "Ageu",
  Zc: "Zacarias", Ml: "Malaquias", Mt: "Mateus", Mc: "Marcos", Lc: "Lucas", Jo: "João", At: "Atos", Rm: "Romanos", Co: "Coríntios",
  Gl: "Gálatas", Ef: "Efésios", Fp: "Filipenses", Cl: "Colossenses", Ts: "Tessalonicenses", Tm: "Timóteo", Tt: "Tito", Fm: "Filemom",
  Hb: "Hebreus", Tg: "Tiago", Pe: "Pedro", Jd: "Judas", Ap: "Apocalipse",
};
