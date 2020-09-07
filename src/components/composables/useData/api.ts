import { CSVParser, JSONParser } from '@amcharts/amcharts4/core'
import { IDataMetaForUrlDrivenChart } from './use-data-types'
import { Ref } from 'vue'

/**
 * leverages amCharts to call the API using their internal framework for requested URL
 */
export async function api<TData>(dataMeta: Ref<IDataMetaForUrlDrivenChart<TData>>) {
  const { source, urlConfig } = dataMeta.value
  if (!source) return
  const { url, config: options } = urlConfig

  source.dataSource.parser = options.format === 'csv' ? new CSVParser() : new JSONParser()
  source.dataSource.parser.options.emptyAs = options.emptyAs
  source.dataSource.parser.options.dateFormat = options.dateFormat
  source.dataSource.parser.options.dateFields = options.dateFields

  dataMeta.value.source.dataSource.url = url

  if (options.reloadFrequency) {
    dataMeta.value.source.dataSource.reloadFrequency = options.reloadFrequency
    if (options.incremental !== undefined) dataMeta.value.source.dataSource.incremental = options.incremental
    if (options.updateCurrentData !== undefined)
      dataMeta.value.source.dataSource.updateCurrentData = options.updateCurrentData
  }
}
