import { createContentLoader } from 'vitepress'

export interface Post {
  url: string
  title: string
  date: string
  excerpt: string
  words: number
}

declare const data: Post[]
export { data }

export default createContentLoader('diary/*.md', {
  includeSrc: true,
  transform(raw): Post[] {
    return raw
      .map(({ url, frontmatter, src }) => ({
        url,
        title: frontmatter.title || extractTitle(src) || url,
        date: toDateString(frontmatter.date),
        excerpt: firstParagraph(src),
        words: stripForCount(src).length
      }))
      .sort((a, b) => {
        // 没有 date 的排最后；有 date 的按倒序
        if (!a.date && !b.date) return 0
        if (!a.date) return 1
        if (!b.date) return -1
        return b.date.localeCompare(a.date)
      })
  }
})

function toDateString(d: unknown): string {
  if (!d) return ''
  if (typeof d === 'string') return d
  if (d instanceof Date) {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }
  return String(d)
}

function stripFrontmatter(src: string | undefined): string {
  return (src || '').replace(/^---[\s\S]*?---\r?\n/, '')
}

function extractTitle(src: string | undefined): string {
  const body = stripFrontmatter(src)
  const m = body.match(/^#\s+(.+)$/m)
  return m ? m[1].trim() : ''
}

function firstParagraph(src: string | undefined): string {
  const body = stripFrontmatter(src)

  const cleanedLines = body.split(/\r?\n/).filter((line) => {
    const t = line.trim()
    if (!t) return true
    if (/^#{1,6}\s/.test(t)) return false
    if (/^-{3,}$/.test(t)) return false
    if (/^\*{3,}$/.test(t)) return false
    if (/^<[A-Za-z][^>]*\/?>$/.test(t)) return false
    if (/^<\/[A-Za-z]+>$/.test(t)) return false
    if (/^!\[/.test(t)) return false
    return true
  })

  const paras = cleanedLines
    .join('\n')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)

  for (const p of paras) {
    if (/^:::/.test(p)) continue
    if (/^>/.test(p)) continue
    if (/^```/.test(p)) continue
    const text = p
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/`(.+?)`/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[#>*_`]/g, '')
      .replace(/\u200B/g, '')
      .replace(/&[a-zA-Z]+;/g, '')
      .replace(/\s+/g, ' ')
      .trim()
    if (text) {
      return text.length > 50 ? text.slice(0, 50) + '…' : text
    }
  }
  return ''
}

function stripForCount(src: string | undefined): string {
  return stripFrontmatter(src)
    .replace(/<[^>]+>/g, '')
    .replace(/[#>*`_\-\[\]!\(\)\n\r\s]/g, '')
}