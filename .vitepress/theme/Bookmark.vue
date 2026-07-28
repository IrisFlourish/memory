<script setup>
import { ref, nextTick, watch, onMounted } from 'vue'
import { useRoute } from 'vitepress'

const toast = ref('')
const isDoc = ref(false)
const bookmarked = ref(false)
const route = useRoute()

function stripBase(path) {
  const base = import.meta.env.BASE_URL
  if (base && base !== '/' && path.startsWith(base)) {
    return '/' + path.slice(base.length)
  }
  return path
}

function nearestHeading() {
  const hs = [...document.querySelectorAll('.vp-doc h1, .vp-doc h2, .vp-doc h3')]
  let best = null
  for (const h of hs) {
    const r = h.getBoundingClientRect()
    if (r.top < 200) best = h
    else break
  }
  return best
}

function currentUrl() {
  const h = nearestHeading()
  const id = h ? h.id : ''
  return stripBase(location.pathname) + (id ? '#' + id : '')
}

function refreshBookmarked() {
  const list = JSON.parse(localStorage.getItem('bookmarks') || '[]')
  bookmarked.value = list.some(b => b.url === currentUrl())
}

function checkIsDoc() {
  if (typeof document === 'undefined') return
  setTimeout(() => {
    isDoc.value = !!document.querySelector('.vp-doc')
    if (isDoc.value) refreshBookmarked()
  }, 50)
}

onMounted(() => {
  checkIsDoc()
  watch(
    () => route.path,
    async () => {
      await nextTick()
      checkIsDoc()
    }
  )
  // 滚动时刷新一下按钮状态(因为 nearestHeading 会变)
  window.addEventListener('scroll', refreshBookmarked, { passive: true })
})

function addBookmark() {
  const h = nearestHeading()
  const title = document.title.split(' | ')[0]
  const section = h ? h.innerText.replace('#', '').trim() : ''
  const url = currentUrl()

  const list = JSON.parse(localStorage.getItem('bookmarks') || '[]')
  const idx = list.findIndex(b => b.url === url)

  if (idx >= 0) {
    list.splice(idx, 1)
    toast.value = '✕ 已取消收藏'
  } else {
    list.unshift({
      url,
      title,
      section,
      time: new Date().toLocaleString('zh-CN', { hour12: false })
    })
    toast.value = '✓ 已收藏'
  }
  localStorage.setItem('bookmarks', JSON.stringify(list))
  refreshBookmarked()
  setTimeout(() => (toast.value = ''), 1600)
}
</script>

<template>
  <button
    v-if="isDoc"
    class="bm-btn"
    :class="{ 'bm-btn-active': bookmarked }"
    @click="addBookmark"
    :title="bookmarked ? '取消收藏' : '收藏当前位置'"
  >{{ bookmarked ? '📍' : '📌' }}</button>
  <div v-if="toast" class="bm-toast">{{ toast }}</div>
</template>

<style scoped>
.bm-btn {
  position: fixed;
  right: 24px;
  bottom: 30px;
  width: 46px; height: 46px;
  border-radius: 50%;
  border: none;
  background: var(--vp-c-brand-1);
  color: #fff;
  font-size: 18px;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(0,0,0,0.15);
  z-index: 999;
  transition: background 0.2s;
}
.bm-btn:hover { opacity: 0.9; }
.bm-btn-active {
  background: #e55;
}
.bm-toast {
  position: fixed;
  right: 24px; bottom: 86px;
  padding: 8px 14px;
  background: var(--vp-c-brand-3);
  color: #fff;
  border-radius: 6px;
  font-size: 13px;
  z-index: 999;
  font-family: "STFangsong", serif;
}
</style>