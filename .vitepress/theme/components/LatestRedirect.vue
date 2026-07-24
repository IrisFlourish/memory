<template>
  <div class="latest-hint">正在为你翻到最新的一页…</div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter, withBase } from 'vitepress'
import { data as posts } from '../posts.data'

const router = useRouter()
onMounted(() => {
  const target = posts[0]?.url || '/catalog'
  router.go(withBase(target))
})
</script>

<style scoped>
.latest-hint {
  padding: 6em 2em;
  text-align: center;
  color: #8a7a66;
  font-size: 1.05em;
  letter-spacing: 0.05em;
}
</style>