<template>
  <div class="${TM_FILENAME_BASE/([A-Z][a-z]*)([A-Z][a-z]*)/${1:/downcase}-${2:/downcase}/}"></div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: '${TM_FILENAME_BASE}',

  setup() {
    ${0}

    return {}
  }
}\)
</script>

<style scoped>
.${TM_FILENAME_BASE/([A-Z][a-z]*)([A-Z][a-z]*)/${1:/downcase}-${2:/downcase}/} {
  opacity: 1;
}
</style>
