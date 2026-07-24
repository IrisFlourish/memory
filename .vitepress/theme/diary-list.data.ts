import { createContentLoader } from 'vitepress'

export interface DiaryPost {
  title: string
  url: string
  date: number
}

declare const data: DiaryPost[]
export { data }

export default createContentLoader('diary/*.md', {
  includeSrc: true,
  transform(raw): DiaryPost[] {
    return raw
      .filter(({ url }) => url !== '/diary/' && !url.endsWith('/diary/index'))
      .map(({ url, frontmatter, src }) => {
        const h1Match = src?.match(/^#\s+(.+)$/m)
        const slug = url.split('/').filter(Boolean).pop() || ''
        const title =
          frontmatter.title ||
          (h1Match ? h1Match[1].trim() : decodeURIComponent(slug))
        return {
          title,
          url: url.replace(/\.html$/, '').replace(/\/$/, ''),
          date: frontmatter.date ? +new Date(frontmatter.date) : 0
        }
      })
      .sort((a, b) => b.date - a.date)
  }
})