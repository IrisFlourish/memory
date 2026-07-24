<script setup lang="ts">
import { useData, useRoute } from 'vitepress'
import { computed, ref, onMounted, nextTick, watch } from 'vue'

const { frontmatter } = useData()
const route = useRoute()

const title = computed(() => frontmatter.value.title || '')

const dateText = computed(() => {
  const d = frontmatter.value.date
  if (!d) return ''
  const dt = new Date(d)
  if (isNaN(dt.getTime())) return ''
  const y = dt.getFullYear()
  const m = String(dt.getMonth() + 1).padStart(2, '0')
  const day = String(dt.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
})

const wordCount = ref(0)

const countWords = () => {
  const el = document.querySelector('.vp-doc') as HTMLElement | null
  if (!el) return
  // 克隆一份，剔除代码块，避免代码字符污染
  const clone = el.cloneNode(true) as HTMLElement
  clone.querySelectorAll('pre, code, .diary-title').forEach(n => n.remove())
  const text = clone.innerText || ''
  // 中文按字，英文按单词
  const chinese = (text.match(/[\u4e00-\u9fa5]/g) || []).length
  const english = (text.match(/[A-Za-z0-9]+/g) || []).length
  wordCount.value = chinese + english
}

onMounted(async () => {
  await nextTick()
  countWords()
})

// 切换文章时重新统计
watch(() => route.path, async () => {
  await nextTick()
  countWords()
})
</script>

<template>
  <header v-if="title" class="diary-title">
    <h1>{{ title }}</h1>
    <div class="diary-meta">
      <span v-if="dateText" class="diary-date">{{ dateText }}</span>
      <span v-if="wordCount" class="diary-words">{{ wordCount }} 字</span>
    </div>
  </header>
</template>

<style scoped>
.diary-title {
  margin: 0 0 1.6em;
}
.diary-title h1 {
  font-size: 2.4rem;
  line-height: 1.25;
  letter-spacing: -0.01em;
  margin: 0 0 0.35em;
  font-weight: 700;
}
.diary-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  color: var(--vp-c-text-3);
  font-variant-numeric: tabular-nums;
}
.diary-date {
  /* 左侧 */
}
.diary-words {
  /* 右侧 */
  color: var(--vp-c-text-3);
}
@media (max-width: 640px) {
  .diary-title h1 { font-size: 1.9rem; }
  .diary-meta { font-size: 12px; }
}
</style>