import DOMPurify from "isomorphic-dompurify";

/**
 * Tiptap outputs real HTML, so unlike the old markdown-lite approach we
 * need to sanitize before it ever touches the database — not just at
 * render time. Sanitizing on save (here) plus again defensively at render
 * time in the entry card covers both the write path and any other code
 * that might read this field directly in the future.
 */
export function sanitizeJournalHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "p", "br", "strong", "em", "u", "s",
      "ul", "ol", "li",
      "h1", "h2", "h3",
      "blockquote", "code", "pre",
    ],
    ALLOWED_ATTR: [],
  });
}