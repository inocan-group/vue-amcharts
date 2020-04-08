import { defineComponent } from '@vue/composition-api'; import { defineComponent } from '@vue/composition-api';

<template>
  <div class="story-wrapper outer" :style="containerStyle">
    <slot v-on:$listeners="eventHappened"></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api'
import { IDictionary } from 'common-types'

export default defineComponent({
  name: 'StoryWrapper',
  props: {
    height: {
      type: String,
      default: '50%',
    },
    width: {
      type: String,
      default: '100%',
    },
  },
  setup(props: IDictionary) {
    const containerStyle = computed(() => {
      return `width: ${props.width}; height: ${props.height}`
    })
    return { containerStyle }
  },
})

// import { Component, Vue, Prop } from 'vue-property-decorator'
// import { IDictionary } from 'common-types'

// /**
//  * Wraps a story in a consistent fashion
//  */
// @Component
// export default class StoryWrapper extends Vue {
//   @Prop() backgroundColor?: string
//   @Prop() isFullWidthComponent?: boolean
//   @Prop() componentWidth?: string
//   @Prop() componentBorder?: string
//   @Prop() aspectRatio?: number

//   get style() {
//     let style = ''
//     if (this.componentWidth && this.componentWidth.includes('100%')) {
//       style += ` padding: 0;`
//     } else {
//       style += ` padding: 1rem;`
//     }
//     if (this.backgroundColor) {
//       style = `${style} background-color: ${this.backgroundColor};`
//     }

//     return style
//   }

//   get innerStyle() {
//     let style = ''
//     if (this.componentBorder) {
//       style += ` ${this.componentBorder};`
//     }
//     if (this.componentWidth) {
//       style += ` width: ${this.componentWidth};`
//       if (this.componentWidth.slice(-1) === '%') {
//         style += ` height: ${this.componentWidth}; `
//       }
//     }
//     if (this.aspectRatio && this.aspectRatio !== 0) {
//       if (
//         typeof this.componentWidth === 'number' ||
//         (typeof this.componentWidth === 'string' && this.componentWidth.slice(-2) == 'px')
//       ) {
//         style += ` height: calc(${String(this.componentWidth)} * (1/${this.aspectRatio});`
//       } else {
//         this.$nextTick(() => {
//           const width = this.$el.clientWidth
//           style += ` height: calc(${width}px * (1/${this.aspectRatio});`
//         })
//       }
//     }

//     return style
//   }

//   eventHappened(...args: any[]) {
//     //
//   }
// }
</script>

<style scoped>
.story-wrapper.outer {
  width: 100%;
  height: 100%;
}
</style>
