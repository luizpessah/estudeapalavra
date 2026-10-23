import { createFileRoute, redirect } from "@tanstack/react-router";

// Imports are administered in the Lovable editor, never in the public app.
export const Route = createFileRoute("/importar")({
  beforeLoad: () => { throw redirect({ to: "/", replace: true }); },
  head: () => ({ meta: [
    { title: "Estudos Bíblicos — Página inicial" },
    { name: "description", content: "Leia os estudos bíblicos temáticos." },
    { property: "og:title", content: "Estudos Bíblicos — Página inicial" },
    { property: "og:description", content: "Leia os estudos bíblicos temáticos." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ] }),
});
