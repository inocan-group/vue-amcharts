import { MapChart, MapPolygonSeries } from '../../index'
import { number, boolean } from '@storybook/addon-knobs'

export const worldMap = () => ({
  data: () => ({
    dataset: [],
  }),
  props: {
    excludeAntartica: {
      default: boolean('Exclude Antartica', true, 'Component'),
    },
  },
  components: { MapChart, MapPolygonSeries },
  template: `
    <div style="width: 100%; height: 500px">
      <map-chart >
        <map-polygon-series tooltip-text="{name}" />
      </map-chart>
    </div>
  `,
})
