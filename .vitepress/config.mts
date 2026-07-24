import { defineConfig } from 'vitepress'
import container from 'markdown-it-container'
import type MarkdownIt from 'markdown-it'

function makeCard(md: MarkdownIt, name: string) {
  md.use(container, name, {
    render(tokens: any[], idx: number) {
      const token = tokens[idx]
      const info = token.info.trim().slice(name.length).trim()
      if (token.nesting === 1) {
        return `<div class="paper-card paper-card-${name}">${
          info ? `<p class="paper-card-title">${info}</p>` : ''
        }\n`
      }
      return '</div>\n'
    }
  })
}

export default defineConfig({
  title: '任意门',
  base: '/memory/',
  description: '',
  lang: 'zh-CN',
  lastUpdated: true,
  cleanUrls: true,
  markdown: {
    config: (md) => {
      ;['lyric', 'memo', 'quote', 'highlight', 'note', 'love', 'dream'].forEach(
        (n) => makeCard(md, n)
      )
    }
  },

  themeConfig: {
    outline: { level: [2, 4], label: '本页目录' },
    sidebar: {
      '/diary/': [
        { text: '🔖 书签', link: '/bookmarks' }
        // 📖 目录 由 DiarySidebarList 组件动态渲染
      ],
      '/': [
        {
          text: '导航',
          items: [
            { text: '关于', link: '/about' },
            { text: '🔖 书签', link: '/bookmarks' },
            { text: '📖 目录', link: '/catalog' }
          ]
        }
      ]
    },
    // 关掉默认 prev/next,交给 DiaryPrevNext 按日期渲染
    docFooter: { prev: false, next: false },
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色',
    darkModeSwitchTitle: '切换到深色',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '返回顶部',
    lastUpdatedText: '最后更新',
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索', buttonAriaLabel: '搜索' },
          modal: {
            displayDetails: '显示详情',
            resetButtonTitle: '清除',
            backButtonTitle: '返回',
            noResultsText: '没有找到相关结果',
            footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' }
          }
        }
      }
    }
  }
})