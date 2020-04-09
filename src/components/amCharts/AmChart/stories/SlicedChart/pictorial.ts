import { SliceChart, PictorialStackedSeries } from '../../index'
import { select, boolean, text, number } from '@storybook/addon-knobs'

const personPath =
  'M53.5,476c0,14,6.833,21,20.5,21s20.5-7,20.5-21V287h21v189c0,14,6.834,21,20.5,21 c13.667,0,20.5-7,20.5-21V154h10v116c0,7.334,2.5,12.667,7.5,16s10.167,3.333,15.5,0s8-8.667,8-16V145c0-13.334-4.5-23.667-13.5-31 s-21.5-11-37.5-11h-82c-15.333,0-27.833,3.333-37.5,10s-14.5,17-14.5,31v133c0,6,2.667,10.333,8,13s10.5,2.667,15.5,0s7.5-7,7.5-13 V154h10V476 M61.5,42.5c0,11.667,4.167,21.667,12.5,30S92.333,85,104,85s21.667-4.167,30-12.5S146.5,54,146.5,42 c0-11.335-4.167-21.168-12.5-29.5C125.667,4.167,115.667,0,104,0S82.333,4.167,74,12.5S61.5,30.833,61.5,42.5z'

export const pictorialStackedSeries = () => {
  const sliceData = [
    {
      name: 'Stage #1',
      value: 600,
    },
    {
      name: 'Stage #2',
      value: 300,
    },
    {
      name: 'Stage #3',
      value: 200,
    },
    {
      name: 'Stage #4',
      value: 180,
    },
    {
      name: 'Stage #5',
      value: 50,
    },
    {
      name: 'Stage #6',
      value: 20,
    },
    {
      name: 'Stage #7',
      value: 10,
    },
  ]
  return {
    data: () => ({
      sliceData,
      personPath,
    }),
    props: {
      startLocation: {
        default: number('Start Location', 0, {}, 'Component'),
      },
      endLocation: {
        default: number('End Location', 1, {}, 'Component'),
      },
      tooltipText: {
        default: text(
          'Tooltip text',
          "[bold]{category}:[/] {value.percent.formatNumber('#.#')}% ({value.value})%",
          'Component',
        ),
      },

      labelText: {
        default: text('Label Text', "{category}: {value.percent.formatNumber('#.0')}%", 'Labels'),
      },

      alignLabels: {
        default: boolean('Align the labels', true, 'Labels'),
      },
      alignOpposite: {
        default: boolean('Align to the opposite side (aka, the right side)', false, 'Labels'),
      },
      disableLabels: {
        default: boolean('Disable the labels (and ticks)', false, 'Labels'),
      },
    },
    components: { SliceChart, PictorialStackedSeries },
    template: `
    <div style="width: 100%; height: 500px">
      <slice-chart :data="sliceData" >
        <pictorial-stacked-series 
          valueProp="value"
          categoryProp="name"
          :path="personPath"
          :startLocation="startLocation"
          :endLocation="endLocation"

          :tooltipText="tooltipText"

          :labelText="labelText"
          :alignLabels="alignLabels"
          :alignOpposite="alignOpposite"
          :disableLabels="disableLabels"
        />
      </slice-chart>
    </div>
  `,
    notes: `Shows both candlestick implementation as well as how the "api" property can be used`,
  }
}