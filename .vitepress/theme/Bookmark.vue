<script setup>
import { ref, nextTick, watch } from 'vue'
import { useRoute } from 'vitepress'

const toast = ref('')
const isDoc = ref(false)
const route = useRoute()

watch(
  () => route.path,
  async () => {
    await nextTick()
    // 等 DOM 渲染完再检测
    setTimeout(() => {
      isDoc.value = !!document.querySelector('.vp-doc')
    }, 50)
  },
  { immediate: true }
)

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

function addBookmark() {
  const h = nearestHeading()
  const title = document.title.split(' | ')[0]
  const section = h ? h.innerText.replace('#', '').trim() : ''
  const id = h ? h.id : ''
  const list = JSON.parse(localStorage.getItem('bookmarks') || '[]')
  const url = location.pathname + (id ? '#' + id : '')
  if (list.some(b => b.url === url)) {
    toast.value = '已经收藏过啦'
  } else {
    list.unshift({
      url,
      title,
      section,
      time: new Date().toLocaleString('zh-CN', { hour12: false })
    })
    localStorage.setItem('bookmarks', JSON.stringify(list))
    toast.value = '✓ 已收藏'
  }
  setTimeout(() => (toast.value = ''), 1600)
}
</script>

<template>
  <button v-if="isDoc" class="bm-btn" @click="addBookmark" title="收藏当前位置">📌</button>
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
}
.bm-btn:hover { opacity: 0.9; }
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