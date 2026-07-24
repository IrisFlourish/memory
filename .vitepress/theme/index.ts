import { h } from 'vue'
import type { Theme } from 'vitepress'
import { useRoute } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import DiaryMeta from './DiaryMeta.vue'
import Bookmark from './Bookmark.vue'
import BookmarkList from './BookmarkList.vue'
import CatalogPage from './CatalogPage.vue'
import DiarySidebarList from './DiarySidebarList.vue'
import './custom.css'

// 去掉 base 前缀，得到站内相对路径
function stripBase(path: string) {
  const base = (import.meta as any).env.BASE_URL as string // 例如 '/memory/'
  if (base && base !== '/' && path.startsWith(base)) {
    return '/' + path.slice(base.length)
  }
  return path
}

// 判断当前是否为日记正文页(排除 /diary 和 /diary/index)
function isDiaryArticle(path: string) {
  const p = stripBase(path).replace(/\.html$/, '').replace(/\/$/, '')
  return p.startsWith('/diary/') && p !== '/diary' && p !== '/diary/index'
}

// 判断是否在日记板块内(包括列表页和文章页)
function isInDiarySection(path: string) {
  return stripBase(path).startsWith('/diary/')
}

export default {
  extends: DefaultTheme,
  Layout() {
    const route = useRoute()
    return h(DefaultTheme.Layout, null, {
      'layout-bottom': () =>
        isDiaryArticle(route.path) ? h(Bookmark) : null,
      'sidebar-nav-after': () =>
        isInDiarySection(route.path) ? h(DiarySidebarList) : null
    })
  },
  enhanceApp({ app }) {
    app.component('DiaryMeta', DiaryMeta)
    app.component('Bookmark', Bookmark)
    app.component('BookmarkList', BookmarkList)
    app.component('CatalogPage', CatalogPage)
  }
} satisfies Theme