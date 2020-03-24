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

1. **Reflexive Property Setting:** the simplest of the batch but a very common situation ... when you have a component property who's property name on the charting component is the same and at the root level then just pass the charting component (usually `component` or `chart` but really any object or even a reactive `Ref` to an object)

2. **Reflexive with Functional Intervention:** if you want to do a simple manipulation of property value before setting it in the amChart object instance, this is done easily by this form. You get passed the _new_ value as single parameter but of course you're still able to make use of any of the delta/component/chart references made available via enclosure.

3. **Offset Property Setting:** like the reflexive property setting, it allows the value to just be set onto the chart object but in this case it allows you to offset where on the object with a _dot-path_ style of referrencing to put your value as deeply into the component structure as you need.

4. **Offset with Functional Intervention:** allows you to provide an offset path like the prior option but rather than just passing in the value "as is" you can do a bit of functional manipulation before setting the value.

5. **Pure Functional Intervention:** allows you do whatever you like when a property changes.

### 3. Chart Events

Unlike in the prior section where the causation of the state change was originated by the _container_ changing the value of a property it passed in. In this case we are looking at how to respond to events when the **amCharts** components have detected some sort of change/event.

As you'll find from their own documentation, there are a LOT of different events which are provided and in _most_ cases you won't need very few to none. That said, we all know that _most cases_ rarely covers the real world so we have created a two stage way to expose events to consumers/container who want engage:

1. `onXXX` events provided directly on components on a _per_-component basis

      ```html
      <xy-chart >
        <line-series @onDataReady="handleDataIsReady('line')" />
        <column-series @onDataReady="handleDataIsReady('column')" />
      </xy-chart>
      ```

  3. Hook into the events you want by subscribing:

      ```html
      <xy-chart >
        <line-series :subscribe="mySeriesEvents(evt1, evt2)" />
        <chart-legend />
      </xy-chart>
      ```

      where `evt1` and `evt2` are the **amChart** events you want to listen to and `mySeriesEvents` is a higher order function like so:

      ```typescript
      const mySeriesEvents = (...evts: string[]) => 
        (event: { evtName: string, target: Object }) => { ... }
      ```

      should you want to subscribe to _all_ events which a component emits, you can leave the first function call empty and you'll be subscribed to ALL.

The first approach may feel very familiar to you if you're used to consuming VueJS events and it _is_ the preferred means of receiving events when a component exposes that event type but in order to ensure that there are literally no limits to what you can listen to the subscription approach offers a very valid approach too.