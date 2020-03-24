# Managing State Change

Managing state change is a critically important feature and while each chart component has different
state properties the act of managing this fits two very strong patterns:

## Lifecycle

The lifecycle of state change revolves around two main timeframes:

### 1. Setup/Initialization

When a component first comes into existance it needs to be initialized. During this timeframe, the "state" of
the component will -- 99% of the time -- dictated by the component's props dictionary.

### 2. Events

After the intial setup, we must detect changes in "state" and this will primarily come from property changes passed into the component but _can_ come from events from the chart components too. We will treat these two things separately in the next section.

## Responding to Events

### Property changes

The most common reason that your chart components will need to change is because a property passed
into them has changed and that change needs to be reflected in some way in the chart components that you have composed on your page. If you are authoring your own child component then you _can_ hook into the `onPropChanged` lifecycle hook and do whatever you want:

```typescript
{
  setup(props, context) {
    const { onPropChanged } = useProps(props)

    onPropChanged((prop, current, prior) => {
      console.log(`the ${prop} property has changed`, { current, prior })
      // do some stuff
    })
  }
}
```

There is nothing wrong with this approach and it gives you pretty unlimited possibilities but in most cases there is a more prescriptive and compact way of managing change that can be used not only by component authors but people extending the capability/functionality of an existing component.

```typescript
const { actionsConfig } = useProps(props)

actionsConfig((deltas, component, chart) => ({
  // reflexive property setting
  stroke: component,
  // reflexive with functional intervention
  strokeWidth: [component, v => Number(v)]
  // offset property setting
  disableTicks: [ component, 'ticks.template.disabled' ],
  // offset with functional intervention
  fill: [ component, 'template.fill', v => color(v) ]
  // pure functional intervention
  fancy: (v) => { ... }
}))
```

When you pull down `actionsConfig` from **useProps** you are getting a function which provides you
fully typed configuration function. This ensures that you have access to useful state provided in `deltas`, `component`, and `chart`. Let's quickly touch on these three variables:

- `deltas`: this provides a `before` and `after` state of the property when it changes
- `component`: is a reference to the chart component which you are configuring (e.g., a _series_, a _legend_, etc.)
- `chart`: is a reference to the top level amChart chart object (e.g., _PieChart_, _XYChart_, etc.)

Now it's worth noting that because everything surrounding the `actionsConfig` uses arrow functions, the block scope you are in when defining the actions will be available when the properties actually change too so you are free to have your functions reference any _in-scope_ variable here.

Now that we understand what's being passed _into_ the function, let's talk about function's output ... a dictionary structure who's keys are the properties which we want to respond to change on. While the _key_ is straight forward, the values can take different signatures depending on what is needed. The possible variations in signature are all demonstrated above the example and we will quickly review these signatures:

### 3. Chart Events

dd
