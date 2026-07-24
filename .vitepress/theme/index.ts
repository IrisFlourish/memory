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

// 判断当前是否为日记正文页(排除 /diary 和 /diary/index)
function isDiaryArticle(path: string) {
  const p = path.replace(/\.html$/, '').replace(/\/$/, '')
  return p.startsWith('/diary/') && p !== '/diary' && p !== '/diary/index'
}

export default {
  extends: DefaultTheme,
  Layout() {
    const route = useRoute()
    return h(DefaultTheme.Layout, null, {
      'layout-bottom': () =>
        isDiaryArticle(route.path) ? h(Bookmark) : null,
      'sidebar-nav-after': () =>
        route.path.startsWith('/diary/') ? h(DiarySidebarList) : null
    })
  },
  enhanceApp({ app }) {
    app.component('DiaryMeta', DiaryMeta)
    app.component('Bookmark', Bookmark)
    app.component('BookmarkList', BookmarkList)
    app.component('CatalogPage', CatalogPage)
  }
} satisfies Theme