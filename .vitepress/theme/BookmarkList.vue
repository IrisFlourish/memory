<script setup>
import { ref, onMounted } from 'vue'
import { withBase } from 'vitepress'

const list = ref([])

function load() {
  list.value = JSON.parse(localStorage.getItem('bookmarks') || '[]')
}
function remove(i) {
  list.value.splice(i, 1)
  localStorage.setItem('bookmarks', JSON.stringify(list.value))
}
function clearAll() {
  if (confirm('确定清空所有书签？')) {
    localStorage.removeItem('bookmarks')
    list.value = []
  }
}
onMounted(load)
</script>

<template>
  <div class="bml">
    <div v-if="list.length" class="bml-head">
      共 {{ list.length }} 条 <button @click="clearAll" class="bml-clear">清空</button>
    </div>
    <a v-for="(b, i) in list" :key="i" :href="withBase(b.url)" class="bml-item">
      <div class="bml-title">{{ b.title }}</div>
      <div class="bml-time">{{ b.time }}</div>
      <button class="bml-del" @click.prevent="remove(i)">×</button>
    </a>
    <div v-if="!list.length" class="empty">
      还没有书签。<br>在文章页右下角点 📌 就能收藏当前位置。
    </div>
  </div>
</template>

<style scoped>
.bml { display: flex; flex-direction: column; gap: 10px; margin-top: 1em; }
.bml-head {
  font-family: "STFangsong", serif;
  font-size: 13px;
  color: var(--vp-c-text-3);
  display: flex; justify-content: space-between; align-items: center;
}
.bml-clear {
  background: none; border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-3); border-radius: 4px;
  padding: 2px 10px; cursor: pointer; font-size: 12px;
}
.bml-item {
  position: relative;
  display: block;
  padding: 12px 40px 12px 16px;
  background: var(--vp-c-bg-alt);
  border-radius: 8px;
  color: var(--vp-c-text-1);
  text-decoration: none;
  border: 1px solid var(--vp-c-divider);
}
.bml-item:hover { border-color: var(--vp-c-brand-1); }
.bml-title { font-family: "Kaiti SC", serif; font-size: 16px; }
.bml-time { font-family: "STFangsong", serif; font-size: 12px; color: var(--vp-c-text-3); margin-top: 2px; }
.bml-del {
  position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
  width: 24px; height: 24px; border-radius: 50%;
  background: transparent; border: none; color: var(--vp-c-text-3);
  font-size: 18px; cursor: pointer;
}
.bml-del:hover { background: var(--vp-c-brand-soft); color: var(--vp-c-brand-3); }
.empty { padding: 40px; text-align: center; color: var(--vp-c-text-3); font-family: "STFangsong", serif; }
</style>