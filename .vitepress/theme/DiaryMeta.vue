<template>
  <div class="diary-meta" :class="seasonClass">
    <span v-if="date" class="meta-item">📅 {{ date }}</span>
    <span v-if="weekday" class="meta-item">📝 {{ weekday }}</span>
    <span v-if="weather" class="meta-item">☁️ {{ weather }}</span>
    <span v-if="mood" class="meta-item">💭 {{ mood }}</span>
    <span v-if="words" class="meta-item meta-words">✍️ {{ words }} 字</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'
import { data as posts } from './posts.data'

const props = defineProps({
  date: String,
  weekday: String,
  weather: String,
  mood: String
})

const { page } = useData()

const words = computed(() => {
  const rel = (page.value.relativePath || '').replace(/\.md$/, '')
  const key = '/' + rel
  const post = posts.find(p => {
    const u = (p.url || '').replace(/\/$/, '')
    return u === key.replace(/\/$/, '')
  })
  return post?.words || 0
})

const seasonClass = computed(() => {
  const s = props.date || ''
  let month = 0
  const cn = s.match(/(\d{1,2})月/)
  const iso = s.match(/-(\d{1,2})-/)
  if (cn) month = parseInt(cn[1])
  else if (iso) month = parseInt(iso[1])
  if (month >= 3 && month <= 5) return 'season-spring'
  if (month >= 6 && month <= 8) return 'season-summer'
  if (month >= 9 && month <= 11) return 'season-autumn'
  if (month === 12 || (month >= 1 && month <= 2)) return 'season-winter'
  return 'season-autumn'
})
</script>

<style scoped>
.diary-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1.4em;
  padding: 0.75em 1.2em;
  margin: 1em 0 2em;
  border-radius: 6px;
  background: var(--meta-bg);
  border-left: 4px solid var(--meta-accent);
  color: #5a4d3f;
  font-size: 0.95em;
  transition: all 0.3s ease;
}
.season-spring { --meta-accent: #a3b18a; --meta-bg: #ecefe1; }
.season-summer { --meta-accent: #7fa9ae; --meta-bg: #e5eeed; }
.season-autumn { --meta-accent: #c98a5b; --meta-bg: #f2ebdf; }
.season-winter { --meta-accent: #8a7095; --meta-bg: #ebe5ec; }
.meta-item { white-space: nowrap; }
.meta-words { opacity: 0.75; }
</style>