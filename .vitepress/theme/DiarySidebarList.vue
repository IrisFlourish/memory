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

const list = computed(() => posts)
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
    <ul v-show="!collapsed" class="diary-sidebar-items">
      <li v-for="post in list" :key="post.url">
        <a
          :href="withBase(post.url)"
          class="diary-sidebar-link"
          :class="{ active: isActive(post.url) }"
        >
          {{ post.title }}
        </a>
      </li>
    </ul>
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
.diary-sidebar-items {
  list-style: none;
  padding: 0;
  margin: 2px 0 0;
}
.diary-sidebar-link {
  position: relative;
  display: block;
  padding: 3px 0 3px 12px;
  font-size: 13px;
  color: var(--vp-c-text-2);
  text-decoration: none;
  border-left: 2px solid transparent;
  transition: color 0.2s;
}
.diary-sidebar-link:hover {
  color: var(--vp-c-brand-1);
}
.diary-sidebar-link.active {
  color: var(--vp-c-brand-1);
  font-weight: 600;
  border-left-color: var(--vp-c-brand-1);
}
</style>