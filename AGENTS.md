<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Bible content is a read-only CDN JSON asset extracted from the uploaded PDF, with source page numbers retained; Bible search stays client-side and separate from locally imported studies to avoid changing the study base.
- Bible search counts all matches and paginates only their display, never the search corpus; retain the original PDF alongside the extracted text for source verification.
