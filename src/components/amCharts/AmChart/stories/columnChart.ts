import { XyChart, ColumnSeries, ValueAxis, DateAxis } from '../index'
import { text, select, boolean } from '@storybook/addon-knobs'
import { IDictionary } from 'common-types'

function cycleData(data2: IDictionary[]) {}

export const columnChart = () => {
  let data: [{ date: '2020-03-12'; price: 34 }]
  // cycleData(data)

  return {
    components: { XyChart, ValueAxis, ColumnSeries, DateAxis },
    template: `
    <xy-chart>
      <date-axis dimension="x"/>
      <value-axis dimension="y" />
      <column-series :data="data" xProp="date" yProp="price" />
    </xy-chart>
  `,
    notes: `Shows animation of data in a very simple container`,
  }
}
