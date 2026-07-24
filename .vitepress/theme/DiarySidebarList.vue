<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, withBase } from 'vitepress'
import { data as posts } from './diary-list.data'

const route = useRoute()
const collapsed = ref(false)

const isActive = (url: string) => {
  const base = (import.meta as any).env.BASE_URL as string
  let current = decodeURIComponent(route.path)
  if (base && base !== '/' && current.startsWith(base)) {
    current = '/' + current.slice(base.length)
  }
  current = current.replace(/\.html$/, '').replace(/\/$/, '')
  return current === url
}

// 把时间戳格式化为 MM-DD
const formatMD = (ts: number) => {
  if (!ts) return ''
  const d = new Date(ts)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${mm}-${dd}`
}

// 按 年-月 分组。posts 已按日期倒序排好。
const groups = computed(() => {
  const map = new Map<string, { label: string; items: typeof posts }>()
  for (const p of posts) {
    const d = p.date ? new Date(p.date) : null
    const key = d
      ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      : 'unknown'
    const label = d ? `${d.getFullYear()} 年 ${d.getMonth() + 1} 月` : '未分类'
    if (!map.has(key)) map.set(key, { label, items: [] })
    map.get(key)!.items.push(p)
  }
  return Array.from(map, ([key, v]) => ({ key, ...v }))
})
</script>

<template>
  <div class="diary-sidebar-list">
    <button
      class="diary-sidebar-title"
      :class="{ collapsed }"
      @click="collapsed = !collapsed"
    >
      <span>📖 目录</span>
      <span class="chevron">›</span>
    </button>

    <div v-show="!collapsed" class="diary-sidebar-groups">
      <div v-for="g in groups" :key="g.key" class="diary-sidebar-group">
        <div class="diary-sidebar-month">{{ g.label }}</div>
        <ul class="diary-sidebar-items">
          <li v-for="post in g.items" :key="post.url">
            <a
              :href="withBase(post.url)"
              class="diary-sidebar-link"
              :class="{ active: isActive(post.url) }"
            >
              <span v-if="post.date" class="diary-sidebar-date">{{ formatMD(post.date) }}</span>
              <span class="diary-sidebar-text">{{ post.title }}</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.diary-sidebar-list {
  padding: 0;
  margin-top: -12px;
}
.diary-sidebar-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 4px 0;
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
}
.chevron {
  display: inline-block;
  font-size: 14px;
  color: var(--vp-c-text-2);
  transform: rotate(90deg);
  transition: transform 0.25s;
}
.diary-sidebar-title.collapsed .chevron {
  transform: rotate(0deg);
}

.diary-sidebar-groups {
  margin-top: 2px;
}
.diary-sidebar-group + .diary-sidebar-group {
  margin-top: 10px;
}
.diary-sidebar-month {
  padding: 6px 0 4px 0;
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--vp-c-text-3);
  text-transform: none;
}

.diary-sidebar-items {
  list-style: none;
  padding: 0;
  margin: 0;
}
.diary-sidebar-link {
  position: relative;
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 3px 0 3px 12px;
  font-size: 13px;
  color: var(--vp-c-text-2);
  text-decoration: none;
  border-left: 2px solid transparent;
  transition: color 0.2s;
}
.diary-sidebar-date {
  flex-shrink: 0;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  color: var(--vp-c-text-3);
}
.diary-sidebar-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.diary-sidebar-link:hover,
.diary-sidebar-link:hover .diary-sidebar-date {
  color: var(--vp-c-brand-1);
}
.diary-sidebar-link.active {
  color: var(--vp-c-brand-1);
  font-weight: 600;
  border-left-color: var(--vp-c-brand-1);
}
.diary-sidebar-link.active .diary-sidebar-date {
  color: var(--vp-c-brand-1);
}
</style>