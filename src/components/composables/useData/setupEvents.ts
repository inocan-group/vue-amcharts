import type { DataSource } from '@amcharts/amcharts4/core'
import {  IDataMetaReady } from './use-data-types'
import { Ref } from '@vue/composition-api'
import get from 'lodash.get'

let classesSetup: string[] = []

export function removeEventClass(klass: string) {
  classesSetup = classesSetup.filter(i => i !== klass)
}

export function setupEvents<T>(dataChange: (current: T[], prior: T[]) => void, dataMeta: Ref<IDataMetaReady<T>>) {
  const { urlConfig, sourceClass } = dataMeta.value
  const { dataPreHook, dataPostHook } = dataMeta.value.hooks
  // TODO: look at whether the hooks defined here should be used during registration
  console.log('setting up events: ', {urlConfig, sourceClass})
  if(classesSetup.includes(sourceClass)) {
    console.warn(`Attempt to registered ${sourceClass} more than once! Be sure that any DATA component (chart/series) disposes of itself and remove`)
    
  } else {
    console.log(`first registration of ${sourceClass}`, dataMeta)
    classesSetup.push(sourceClass)
  }
  
  dataMeta.value.source.dataSource.events.on('parseended', (event: { type: string; target: DataSource }) => {
    const { target } = event
    console.log(`parse ended for ${dataMeta.value.sourceClass}`, target, urlConfig)
    let data = target.data

    // if offset; pull that off first
    if (dataMeta.value.urlConfig?.config?.offset) {
      data = get(data, dataMeta.value.urlConfig?.config?.offset)
      if (!data && target.data) {
        console.warn(
          `The URL configuration for ${dataMeta.value.sourceClass} used an offset property of "${dataMeta.value.urlConfig.config.offset}" on the API result but when applying this offset no results were found. The original results were:`,
          target.data,
        )
      }
    }

    data = dataMeta.value.urlConfig?.config?.transform ? dataMeta.value.urlConfig.config.transform(data) : data

    console.log('about to call dataChange', dataMeta.value.sourceClass)
    dataChange(data, dataMeta.value.source.data)
    console.log('API data is ready')
    
    return data
  })
}
