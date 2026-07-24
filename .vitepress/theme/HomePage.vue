<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vitepress'
import { data as posts } from './posts.data'

const router = useRouter()
const latestUrl = computed(() => posts[0]?.url || '/catalog')

function go(url: string) {
  router.go(url)
}
</script>

<template>
  <div class="hp">
    <div class="hp-inner">
      <!-- Hero -->
      <section class="hp-hero">
        <h1 class="hp-name">任意门</h1>

        <div class="hp-sub">
          <span class="hp-line"></span>
          <span>下个路口见</span>
          <span class="hp-line"></span>
        </div>

        <p class="hp-tagline">那些被记录的时间</p>

        <div class="hp-actions">
          <a class="hp-btn primary" :href="latestUrl" @click.prevent="go(latestUrl)">
            开始阅读 <span class="arrow">→</span>
          </a>
          <a class="hp-btn ghost" href="/about" @click.prevent="go('/about')">
            关于
          </a>
        </div>
      </section>

      <!-- Entries -->
      <section class="hp-entries">
        <a class="hp-entry" href="/catalog" @click.prevent="go('/catalog')">
          <span class="hp-entry-icon">📖</span>
          <span class="hp-entry-body">
            <span class="hp-entry-title">目录</span>
            <span class="hp-entry-desc">朝花夕拾</span>
          </span>
        </a>
        <a class="hp-entry" href="/bookmarks" @click.prevent="go('/bookmarks')">
          <span class="hp-entry-icon">📌</span>
          <span class="hp-entry-body">
            <span class="hp-entry-title">书签</span>
            <span class="hp-entry-desc">风敲叶响</span>
          </span>
        </a>
      </section>

      <footer class="hp-foot">— 光明自由 —</footer>
    </div>
  </div>
</template>

<style scoped>
.hp {
  min-height: calc(100vh - var(--vp-nav-height, 64px));
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 32px;
  color: var(--vp-c-text-1);
}
.hp-inner {
  width: 100%;
  max-width: 760px;
  text-align: center;
}

/* ---------- Hero ---------- */
.hp-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hp-name {
  font-family: "Kaiti SC", "STKaiti", "KaiTi", serif;
  font-size: clamp(56px, 8.5vw, 108px);
  font-weight: 500;
  letter-spacing: 0.18em;
  line-height: 1;
  margin: 0;
  color: var(--vp-c-text-1);
  padding-left: 0.18em; /* 视觉居中补偿字距 */
}

.hp-sub {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  margin-top: 22px;
  font-family: "Kaiti SC", "STKaiti", serif;
  font-size: clamp(20px, 2.2vw, 26px);
  color: var(--vp-c-brand-2);
  letter-spacing: 0.15em;
}
.hp-line {
  display: inline-block;
  width: 44px;
  height: 1px;
  background: var(--vp-c-brand-2);
  opacity: 0.55;
}

.hp-tagline {
  margin: 22px 0 34px;
  font-size: 15.5px;
  color: var(--vp-c-text-2);
  letter-spacing: 0.08em;
  text-indent: 0;
}

.hp-actions {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  justify-content: center;
}
.hp-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 26px;
  border-radius: 999px;
  font-size: 15px;
  text-decoration: none;
  transition: all 0.25s ease;
}
.hp-btn.primary {
  background: var(--vp-c-brand-2);
  color: #fbf6ec;
}
.hp-btn.primary:hover {
  background: var(--vp-c-brand-3);
  transform: translateY(-1px);
  box-shadow: 0 8px 20px -10px rgba(120, 80, 60, 0.5);
}
.hp-btn.primary .arrow {
  transition: transform 0.25s;
}
.hp-btn.primary:hover .arrow {
  transform: translateX(3px);
}
.hp-btn.ghost {
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
}
.hp-btn.ghost:hover {
  border-color: var(--vp-c-brand-2);
  color: var(--vp-c-brand-2);
}

/* ---------- Entries ---------- */
.hp-entries {
  margin-top: 56px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.hp-entry {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 22px;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  text-decoration: none;
  color: var(--vp-c-text-1);
  text-align: left;
  transition: all 0.25s ease;
}
.hp-entry:hover {
  border-color: var(--vp-c-brand-2);
  transform: translateY(-2px);
  box-shadow: 0 10px 24px -14px rgba(120, 80, 60, 0.35);
}
.hp-entry-icon {
  font-size: 22px;
  line-height: 1;
}
.hp-entry-body {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.hp-entry-title {
  font-family: "Kaiti SC", "STKaiti", serif;
  font-size: 17px;
  letter-spacing: 0.1em;
  color: var(--vp-c-text-1);
}
.hp-entry-desc {
  font-size: 12.5px;
  color: var(--vp-c-text-3);
  letter-spacing: 0.05em;
}

/* ---------- Foot ---------- */
.hp-foot {
  margin-top: 40px;
  color: var(--vp-c-text-3);
  font-size: 12px;
  letter-spacing: 0.4em;
}

/* ---------- Mobile ---------- */
@media (max-width: 640px) {
  .hp {
    min-height: auto;
    padding: 48px 20px;
  }
  .hp-entries {
    grid-template-columns: 1fr;
    margin-top: 40px;
  }
}
</style>