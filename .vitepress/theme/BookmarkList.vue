<script setup>
import { ref, onMounted } from 'vue'
import { withBase, useRouter } from 'vitepress'

const bookmarks = ref([])
const router = useRouter()

function stripBase(path) {
  const base = import.meta.env.BASE_URL
  if (base && base !== '/' && path.startsWith(base)) {
    return '/' + path.slice(base.length)
  }
  return path
}

function load() {
  const raw = JSON.parse(localStorage.getItem('bookmarks') || '[]')
  // 兼容老数据:如果存的URL带了 base,自动剥掉
  bookmarks.value = raw.map(b => ({ ...b, url: stripBase(b.url) }))
}

onMounted(load)

function go(e, url) {
  e.preventDefault()
  // 拆出 path 和 hash
  const [path, hash] = url.split('#')
  const target = withBase(path) + (hash ? '#' + hash : '')
  router.go(target)
}

function remove(i) {
  const raw = JSON.parse(localStorage.getItem('bookmarks') || '[]')
  raw.splice(i, 1)
  localStorage.setItem('bookmarks', JSON.stringify(raw))
  load()
}

function clearAll() {
  if (!confirm('确定清空所有书签吗？')) return
  localStorage.removeItem('bookmarks')
  load()
}
</script>

<template>
  <div class="bm-list">
    <div v-if="bookmarks.length === 0" class="bm-empty">
      还没有书签，去文章里点右下角 📌 收藏一下吧。
    </div>

    <div v-else>
      <div class="bm-header">
        <span>共 {{ bookmarks.length }} 条</span>
        <button class="bm-clear" @click="clearAll">清空</button>
      </div>

      <ul>
        <li v-for="(b, i) in bookmarks" :key="b.url + b.time">
          <a :href="withBase(b.url)" @click="go($event, b.url)">
            <div class="bm-title">{{ b.title }}</div>
            <div v-if="b.section" class="bm-section">§ {{ b.section }}</div>
            <div class="bm-time">{{ b.time }}</div>
          </a>
          <button class="bm-remove" @click="remove(i)" title="删除">✕</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.bm-list { margin-top: 1em; }
.bm-empty {
  padding: 2em;
  text-align: center;
  color: var(--vp-c-text-3);
}
.bm-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8em;
  color: var(--vp-c-text-2);
  font-size: 13px;
}
.bm-clear {
  border: 1px solid var(--vp-c-divider);
  background: transparent;
  color: var(--vp-c-text-2);
  padding: 3px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}
.bm-clear:hover { color: var(--vp-c-brand-1); border-color: var(--vp-c-brand-1); }

ul { list-style: none; padding: 0; margin: 0; }
li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-bottom: 1px solid var(--vp-c-divider);
}
li a {
  flex: 1;
  text-decoration: none;
  color: inherit;
  display: block;
}
.bm-title {
  font-weight: 600;
  color: var(--vp-c-text-1);
}
.bm-section {
  font-size: 13px;
  color: var(--vp-c-text-2);
  margin-top: 2px;
}
.bm-time {
  font-size: 12px;
  color: var(--vp-c-text-3);
  margin-top: 2px;
}
li a:hover .bm-title { color: var(--vp-c-brand-1); }

.bm-remove {
  border: none;
  background: transparent;
  color: var(--vp-c-text-3);
  cursor: pointer;
  font-size: 14px;
  padding: 4px 8px;
}
.bm-remove:hover { color: #e55; }
</style>