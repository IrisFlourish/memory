<template>
  <button
    class="aside-toggle"
    :class="{ 'is-hidden': hidden }"
    @click="toggle"
    :title="hidden ? '展开大纲' : '收起大纲'"
  >
    {{ hidden ? '‹ 大纲' : '大纲 ›' }}
  </button>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const hidden = ref(false)

function apply(v) {
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle('hide-aside', v)
}

function toggle() {
  hidden.value = !hidden.value
  apply(hidden.value)
  try { localStorage.setItem('diary-aside-hidden', hidden.value ? '1' : '0') } catch {}
}

onMounted(() => {
  try {
    hidden.value = localStorage.getItem('diary-aside-hidden') === '1'
  } catch {}
  apply(hidden.value)
})

onUnmounted(() => {
  apply(false)
})
</script>

<style scoped>
.aside-toggle {
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 30;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid rgba(160, 130, 96, 0.35);
  background: rgba(255, 250, 240, 0.85);
  color: #7a6a54;
  font-size: 0.78em;
  letter-spacing: 0.05em;
  cursor: pointer;
  backdrop-filter: blur(4px);
  transition: all 0.2s ease;
}
.aside-toggle:hover {
  background: rgba(255, 250, 240, 1);
  border-color: rgba(160, 130, 96, 0.6);
  color: #5a4a34;
}
@media (max-width: 959px) {
  .aside-toggle { display: none; }
}
</style>