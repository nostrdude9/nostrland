import DOMPurify from "dompurify"

export function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })
}

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html)
}

