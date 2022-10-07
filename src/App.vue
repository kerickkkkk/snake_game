<template>
  <div>
    <SnakeGame />
    <!-- <router-view /> -->
  </div>
</template>
<script setup>
import SnakeGame from '@/components/SnakeGame.vue'
</script>
<style lang="scss">
body {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #000;
}

</style>
