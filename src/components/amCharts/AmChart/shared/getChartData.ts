import { IDictionary } from 'common-types'
import { Ref } from '@vue/composition-api'

export async function getChartData(remoteData: Ref<IDictionary[]>, url: string): Promise<IDictionary[]> {
  let response: Response
  try {
    response = await fetch(url)
  } catch (e) {
    throw new Error(`Problem fetching the URL: ${url}. Error: ${e.message}.\n\n${e.stack}`)
  }

  remoteData.value = await response.json()
  return remoteData.value
}
