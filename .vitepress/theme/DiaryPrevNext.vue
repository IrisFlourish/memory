<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, withBase } from 'vitepress'
import { data as posts } from './diary-list.data'

const route = useRoute()

function normalize(p: string) {
  const base = (import.meta as any).env.BASE_URL as string
  let cur = decodeURIComponent(p)
  if (base && base !== '/' && cur.startsWith(base)) {
    cur = '/' + cur.slice(base.length)
  }
  return cur.replace(/\.html$/, '').replace(/\/$/, '')
}

const currentIndex = computed(() =>
  posts.findIndex((p: any) => p.url === normalize(route.path))
)

// posts 按日期倒序:index-1 = 更新的(下一篇), index+1 = 更早的(上一篇)
const newer = computed(() => {
  const i = currentIndex.value
  return i > 0 ? posts[i - 1] : null
})
const older = computed(() => {
  const i = currentIndex.value
  return i >= 0 && i < posts.length - 1 ? posts[i + 1] : null
})
</script>

<template>
  <nav v-if="newer || older" class="diary-prevnext">
    <a v-if="older" :href="withBase(older.url)" class="pn pn-prev">
      <span class="pn-label">← 上一篇（更早）</span>
      <span class="pn-title">{{ older.title }}</span>
    </a>
    <span v-else class="pn-placeholder" />

    <a v-if="newer" :href="withBase(newer.url)" class="pn pn-next">
      <span class="pn-label">下一篇（更新）→</span>
      <span class="pn-title">{{ newer.title }}</span>
    </a>
    <span v-else class="pn-placeholder" />
  </nav>
</template>

<style scoped>
.diary-prevnext {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-top: 3em;
  padding-top: 1.4em;
  border-top: 1px solid var(--vp-c-divider);
}
.pn {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-width: 48%;
  text-decoration: none;
  color: var(--vp-c-text-2);
  transition: color 0.2s;
}
.pn-next {
  text-align: right;
  margin-left: auto;
}
.pn-label {
  font-size: 12px;
  color: var(--vp-c-text-3);
}
.pn-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.pn:hover,
.pn:hover .pn-title {
  color: var(--vp-c-brand-1);
}
.pn-placeholder {
  flex: 1;
}
@media (max-width: 640px) {
  .diary-prevnext { gap: 12px; }
  .pn-title { font-size: 13px; }
}
</style>