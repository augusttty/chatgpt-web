<script lang="ts">
import { onMounted, onUpdated, ref } from 'vue'
import { Transformer } from 'markmap-lib'
import { Markmap } from 'markmap-view/dist/index.esm'

const transformer = new Transformer()
const initValue = `# markmap
  
  - beautiful
  - useful
  - easy
  - interactive
  `

export default {
  name: 'App',
  setup() {
    const svgRef = ref()
    const value = ref(initValue)
    let mm: any = null

    const update = () => {
      const { root } = transformer.transform(value.value)
      mm.setData(root)
      mm.fit()
    }

    onMounted(() => {
      mm = Markmap.create(svgRef.value)
      update()
    })
    onUpdated(update)
    return {
      svgRef,
      value,
    }
  },
}
</script>

<template>
  <div class="flex-1">
    <div>
      <textarea v-model="value" class="w-full h-full border border-gray-400" />
    </div>
    <div>
      <svg ref="svgRef" class="flex-1" />
    </div>
  </div>
</template>
