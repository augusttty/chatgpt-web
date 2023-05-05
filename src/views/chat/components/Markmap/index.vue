<script lang="ts">
import { computed, onMounted, onUpdated, ref } from 'vue'
import { Transformer } from 'markmap-lib'
import { Markmap } from 'markmap-view'

const transformer = new Transformer()

export default {
  name: 'App',
  props: {
    value: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const svgRef = ref<SVGSVGElement | null>(null)
    let mm: ReturnType<typeof Markmap.create>
    const editMode = ref<boolean>(false)
    const markdownText = computed(() => props.value.join('\n'))
    const update = () => {
      const { root } = transformer.transform(markdownText.value)
      mm.setData(root)
      mm.fit()
    }

    onMounted(() => {
      if (svgRef.value) {
        mm = Markmap.create(svgRef.value as SVGSVGElement, {})
        update()
      }
    })

    onUpdated(update)

    return {
      svgRef,
      editMode,
      markdownText,
    }
  },
}
</script>

<template>
  <div>
    <div v-if="editMode" class="flex-1">
      <textarea :value="markdownText" class="w-full h-full border border-gray-400" />
    </div>
    <svg ref="svgRef" class="w-full h-full" />
  </div>
</template>
