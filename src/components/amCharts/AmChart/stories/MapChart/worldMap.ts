import { MapChart, MapPolygonSeries } from '../../index'
import { text, select } from '@storybook/addon-knobs'

export const worldMap = () => ({
  data: () => ({
    dataset: [],
  }),
  props: {
    projection: {
      default: select(
        'map projection',
        {
          Eckert6: 'Eckert6',
          EqualEarth: 'EqualEarth',
          Projection: 'Projection',
          Mercator: 'Mercator',
          Miller: 'Miller',
          NaturalEarth1: 'NaturalEarth1',
          Orthographic: 'Orthographic',
          Stereographic: 'Stereographic',
        },
        'Projection',
        'Component',
      ),
    },
    tooltipText: {
      default: text('tooltip text', '{name}', 'Component'),
    },
    fillColor: {
      default: select(
        'fill color',
        { none: null, red: '#b26666', green: '#74B266', blue: '#66a1b2' },
        '#66a1b2',
        'Component',
      ),
    },
    hoverFill: {
      default: select(
        'hover fill color',
        { none: null, red: '#7b2525', green: '#367B25', blue: '#25507b' },
        '#25507b',
        'Component',
      ),
    },
  },
  components: { MapChart, MapPolygonSeries },
  template: `
    <div style="width: 100%; height: 500px">
      <map-chart :projection="projection">
        <map-polygon-series :tooltip-text="tooltipText" :fill="fillColor" :hover-fill="hoverFill" />
      </map-chart>
    </div>
  `,
})
