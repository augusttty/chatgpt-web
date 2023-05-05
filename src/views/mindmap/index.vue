<script lang="ts">
// import { computed, ref } from 'vue'
import Renderer from './components/Renderer.vue'

export default {
  components: {
    Renderer,
  },
  setup() {
    return {
      Renderer,
    }
  },
}
</script>

<template>
  <div class="flex flex-col h-screen p-2">
    <Renderer />
  </div>
</template>

  <style>
  h1,
  p {
    font-family: Lato;
  }
  </style>
