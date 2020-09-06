<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <xy-chart :data="countries">
      <column-series x-prop="country" y-prop="liters" fill="#69B7DC" />
      <category-axis dimension="x" category="country" />
      <value-axis dimension="y" />
    </xy-chart>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import XyChart from './components/ChartTypes/XyChart.vue'
import ColumnSeries from './components/Series/ColumnSeries.vue'
import CategoryAxis from './components/Axis/CategoryAxis.vue'
import ValueAxis from './components/Axis/ValueAxis.vue'

export default Vue.extend({
  name: 'App',
  data: () => ({
    countries: [
      {
        country: 'Lithuania',
        liters: 501,
      },
      {
        country: 'Czechia',
        liters: 301,
      },
      {
        country: 'Ireland',
        liters: 201,
      },
      {
        country: 'Germany',
        liters: 165,
      },
      {
        country: 'Australia',
        liters: 139,
      },
      {
        country: 'Austria',
        liters: 128,
      },
      {
        country: 'UK',
        liters: 99,
      },
      {
        country: 'Belgium',
        liters: 60,
      },
      {
        country: 'The Netherlands',
        liters: 50,
      },
    ],
  }),

  components: { XyChart, ColumnSeries, ValueAxis, CategoryAxis },
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
