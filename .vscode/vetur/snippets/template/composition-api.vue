<template>
  <div class="${TM_FILENAME_BASE/([A-Z][a-z]*)([A-Z][a-z]*)/${1:/downcase}-${2:/downcase}/}"></div>
</template>

<script lang="ts">
import { defineComponent, SetupContext } from '@vue/composition-api'
import { IDictionary } from 'common-types'

export default defineComponent({
  name: '${TM_FILENAME_BASE}',

  setup(props: IDictionary, context: SetupContext) {
    ${0}

    return {}
  }
})
</script>

<style scoped>
.${TM_FILENAME_BASE/([A-Z][a-z]*)([A-Z][a-z]*)/${1:/downcase}-${2:/downcase}/} {
  opacity: 1;
}
</style>
