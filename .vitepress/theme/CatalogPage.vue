<template>
  <div>
    <div class="catalog-header">
      <h1 class="catalog-h1">目录</h1>

      <div class="cal-wrap" ref="wrapRef">
        <button class="cal-trigger" @click="open = !open">
          <span>📅</span>
          <span>{{ label }}</span>
          <span class="caret">▾</span>
        </button>

        <div v-if="open" class="cal-pop" @click.stop>
          <div class="cal-year-row">
            <button class="nav" @click="viewYear--" :disabled="viewYear <= minYear">‹</button>
            <span class="year-label">{{ viewYear }}</span>
            <button class="nav" @click="viewYear++" :disabled="viewYear >= maxYear">›</button>
          </div>

          <div class="cal-months">
            <button
              v-for="m in 12"
              :key="m"
              class="mbtn"
              :class="{ active: currentYM === ymKey(viewYear, m), has: !!countMap[ymKey(viewYear, m)] }"
              :disabled="!countMap[ymKey(viewYear, m)]"
              @click="pick(viewYear, m)"
            >
              <span class="mnum">{{ m }} 月</span>
              <span v-if="countMap[ymKey(viewYear, m)]" class="mcount">
                {{ countMap[ymKey(viewYear, m)] }}
              </span>
            </button>
          </div>

          <div class="cal-foot">
            <button class="all-btn" :class="{ active: currentYM === 'all' }" @click="pick('all')">
              全部日记
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="catalog-list">
      <a
        v-for="post in filtered"
        :key="post.url"
        :href="withBase(post.url)"
        class="catalog-card"
      >
        <h2 class="catalog-title">{{ post.title }}</h2>
        <div class="catalog-meta">
          <span v-if="post.date">{{ post.date }}</span>
          <span v-if="post.words" class="catalog-words">· {{ post.words }} 字</span>
        </div>
        <p class="catalog-excerpt" v-if="post.excerpt">{{ post.excerpt }}</p>
      </a>
      <div v-if="!filtered.length" class="catalog-empty">这段时间还没有日记。</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { withBase } from 'vitepress'
import { data as posts } from './posts.data'

function parseYM(p) {
  const s = p.date || ''
  const iso = s.match(/(\d{4})-(\d{1,2})-(\d{1,2})/)
  const cn = s.match(/(\d{4})年(\d{1,2})月/)
  if (iso) return { y: +iso[1], m: +iso[2] }
  if (cn) return { y: +cn[1], m: +cn[2] }
  return { y: 0, m: 0 }
}
const ymKey = (y, m) => `${y}-${String(m).padStart(2, '0')}`

const enriched = posts.map(p => {
  const { y, m } = parseYM(p)
  return { ...p, y, m, ym: y ? ymKey(y, m) : '' }
}).sort((a, b) => (b.date || '').localeCompare(a.date || ''))

const countMap = computed(() => {
  const map = {}
  for (const p of enriched) if (p.ym) map[p.ym] = (map[p.ym] || 0) + 1
  return map
})

const years = computed(() => {
  const set = new Set(enriched.map(p => p.y).filter(Boolean))
  return [...set].sort((a, b) => a - b)
})
const minYear = computed(() => years.value[0] || new Date().getFullYear())
const maxYear = computed(() => years.value[years.value.length - 1] || new Date().getFullYear())

const currentYM = ref('all')
const viewYear = ref(maxYear.value)
const open = ref(false)
const wrapRef = ref(null)

const label = computed(() => {
  if (currentYM.value === 'all') return '全部'
  const [y, m] = currentYM.value.split('-')
  return `${y} 年 ${+m} 月`
})

function pick(y, m) {
  currentYM.value = y === 'all' ? 'all' : ymKey(y, m)
  open.value = false
}

const filtered = computed(() =>
  currentYM.value === 'all'
    ? enriched
    : enriched.filter(p => p.ym === currentYM.value)
)

function onDocClick(e) {
  if (wrapRef.value && !wrapRef.value.contains(e.target)) open.value = false
}
onMounted(() => document.addEventListener('click', onDocClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocClick))
</script>

<style scoped>
.catalog-header {
  display: flex; align-items: center; justify-content: space-between;
  gap: 1em; margin-top: 1.2em;
}
.catalog-h1 {
  margin: 0; border: none; padding: 0;
  font-family: "Kaiti SC", "STKaiti", serif;
  font-size: 2em; letter-spacing: 0.2em; color: #4a3c28;
}

.cal-wrap { position: relative; }
.cal-trigger {
  display: inline-flex; align-items: center; gap: 6px;
  font-family: "STFangsong", serif; font-size: 0.9em;
  padding: 5px 14px;
  border: 1px solid rgba(160, 130, 96, 0.35);
  border-radius: 999px;
  background: rgba(255, 250, 240, 0.5);
  color: #7a6a54; cursor: pointer; transition: all 0.2s;
}
.cal-trigger:hover { border-color: #c98a5b; color: #5a4a34; }
.caret { font-size: 0.7em; opacity: 0.7; }

.cal-pop {
  position: absolute; top: calc(100% + 8px); right: 0; z-index: 30;
  width: 280px; padding: 12px;
  background: #fbf6ec;
  border: 1px solid rgba(160, 130, 96, 0.3);
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(80, 60, 30, 0.12);
}
.cal-year-row {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 10px; padding: 0 6px;
}
.cal-year-row .nav {
  width: 26px; height: 26px; border-radius: 50%; border: none;
  background: transparent; color: #7a6a54; cursor: pointer; font-size: 16px;
}
.cal-year-row .nav:hover:not(:disabled) { background: rgba(201, 138, 91, 0.12); }
.cal-year-row .nav:disabled { opacity: 0.25; cursor: not-allowed; }
.year-label {
  font-family: "Kaiti SC", serif; font-size: 1.1em;
  color: #4a3c28; letter-spacing: 0.1em;
}

.cal-months { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
.mbtn {
  position: relative; padding: 10px 4px;
  border: 1px solid transparent; border-radius: 8px;
  background: transparent; color: #b8a892;
  font-family: "STFangsong", serif; font-size: 0.9em;
  cursor: not-allowed; transition: all 0.15s;
}
.mbtn.has {
  color: #5a4a34; cursor: pointer;
  background: rgba(201, 138, 91, 0.08);
}
.mbtn.has:hover { background: rgba(201, 138, 91, 0.2); }
.mbtn.active {
  background: #c98a5b !important; color: #fff !important; border-color: #c98a5b;
}
.mnum { display: block; }
.mcount { position: absolute; top: 3px; right: 6px; font-size: 0.7em; opacity: 0.75; }

.cal-foot {
  margin-top: 10px; padding-top: 10px;
  border-top: 1px dashed rgba(160, 130, 96, 0.25);
  text-align: center;
}
.all-btn {
  font-family: "STFangsong", serif; font-size: 0.88em;
  padding: 4px 16px; border-radius: 999px;
  border: 1px solid rgba(160, 130, 96, 0.35);
  background: transparent; color: #7a6a54; cursor: pointer;
}
.all-btn:hover { border-color: #c98a5b; color: #5a4a34; }
.all-btn.active { background: #c98a5b; border-color: #c98a5b; color: #fff; }

.catalog-list { display: flex; flex-direction: column; gap: 1em; margin-top: 1.5em; }
.catalog-card {
  display: block; padding: 1.1em 1.4em;
  border-radius: 6px;
  border: 1px solid rgba(160, 130, 96, 0.25);
  background: rgba(255, 250, 240, 0.4);
  text-decoration: none !important; color: inherit;
  transition: all 0.25s ease;
}
.catalog-card:hover {
  border-color: rgba(160, 130, 96, 0.5);
  background: rgba(255, 250, 240, 0.8);
  transform: translateY(-1px);
}
.catalog-title {
  margin: 0 0 0.35em; font-size: 1.25em;
  color: #7a4a2a; border: none; padding: 0; text-indent: 0;
}
.catalog-meta { font-size: 0.82em; color: #a89680; margin-bottom: 0.35em; }
.catalog-words { margin-left: 0.4em; }
.catalog-excerpt {
  margin: 0; padding: 0; text-indent: 0;
  color: #6a5d4f; font-size: 0.85em; line-height: 1.5;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.catalog-empty {
  padding: 2em 0; text-align: center;
  color: #a89680; font-family: "STFangsong", serif;
}
</style>