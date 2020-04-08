# Series Components

A series is a top level concern of a AmChart **chart** object:

```typescript
chart.series.push(newSeries)
```

and it's primary relationships are:

- a chart can can **1:M** series
- a series defines it's `dataFields` which determine which properties on the input data are mapped to the axis
