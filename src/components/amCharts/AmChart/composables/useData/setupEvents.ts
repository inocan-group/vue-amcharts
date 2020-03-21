import type { DataSource } from '@amcharts/amcharts4/core'
import {  IDataMetaReady } from './use-data-types'
import { Ref } from '@vue/composition-api'
import get from 'lodash.get'

export function setupEvents<T>(dataMeta: Ref<IDataMetaReady<T>>) {
  const { source, urlConfig, containerName } = dataMeta.value
  console.log('setting up events: ', {urlConfig, containerName})
  
  
  source.dataSource.events.on('parseended', (event: { type: string; target: DataSource }) => {
    const { target } = event
    console.log('parse ended', target, urlConfig)
    let data = target.data
    if (dataMeta.value.urlConfig?.config?.offset) {
      data = get(data, dataMeta.value.urlConfig?.config?.offset)
      if (!data && target.data) {
        console.warn(
          `The URL configuration used an offset property of "${dataMeta.value.urlConfig.config.offset}" on the API result but when applying this offset no results were found. The original results were:`,
          target.data,
        )
      }
    }

    data = dataMeta.value.urlConfig?.config?.transform ? dataMeta.value.urlConfig.config.transform(data) : data
    // chartData.value = data
    target.data = data
    dataMeta.value.chartData = data
    source.invalidateData()
    console.log('after parse, data is', target.data)
    return data
  })

}
