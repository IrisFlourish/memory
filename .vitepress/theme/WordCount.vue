<script setup>
import { ref, onMounted } from 'vue'
const count = ref(0)
onMounted(() => {
  setTimeout(() => {
    const el = document.querySelector('.vp-doc')
    if (el) {
      const text = el.innerText.replace(/\s/g, '')
      count.value = text.length
    }
  }, 100)
})
</script>

<template>
  <div class="word-count">共 {{ count }} 字</div>
</template>

<style scoped>
.word-count {
  font-family: "STFangsong", "FangSong", serif;
  font-size: 13px;
  color: var(--vp-c-text-3);
  text-align: right;
  margin: 2em 0 1em;
  padding-top: 12px;
  border-top: 1px dashed var(--vp-c-divider);
}
</style>