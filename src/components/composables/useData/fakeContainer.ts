import { ILooksLikeChart } from './index'
import { AmchartError } from '../../errors'

export const fakeContainer: ILooksLikeChart<any> = {
  data: [],
  invalidateData() {
    throw new AmchartError(
      `invalidateData() called on a fake container; this happens when you have not yet called the dataReady() method.`,
      `not-ready`,
    )
  },
  addData() {
    throw new AmchartError(
      `addData() called on a fake container; this happens when you have not yet called the dataReady() method.`,
      `not-ready`,
    )
  },
  invalidateRawData() {
    throw new AmchartError(
      `invalidateRawData() called on a fake container; this happens when you have not yet called the dataReady() method.`,
      `not-ready`,
    )
  },
}
