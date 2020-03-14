<template>
  <div class="${TM_FILENAME_BASE/([A-Z][a-z]*)([A-Z][a-z]*)/${1:/downcase}-${2:/downcase}/}"></div>
</template>

<script lang="ts">
import { defineComponent, SetupContext, Ref, ref } from '@vue/composition-api'
import { IDictionary } from 'common-types'
import { useRegistry } from '@/components/amCharts/AmChart/composables'
import { ChartType } from '@/components/amCharts/AmChart'

export default defineComponent({
  name: '${TM_FILENAME_BASE}',
  props: {

  },

  setup(props: IDictionary, context: SetupContext) {
    const { register, getComponent } = useRegistry(props, context, ${TM_FILENAME_BASE})
    ${0}

    const configure = async (chart: IChart) => {
      ${2://}
    }

    register(ChartType.features, '${1:feature-name}', configure)

    return { ${TM_FILENAME_BASE} }
  }
})
</script>

<style scoped>
.${TM_FILENAME_BASE/([A-Z][a-z]*)([A-Z][a-z]*)/${1:/downcase}-${2:/downcase}/} {
  opacity: 1;
}
</style>
