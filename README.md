# React Global Event Listener

> A higher order component for subscribing listeners to events

## Install

#### yarn

```
yarn add react-global-event-listener
```

#### npm

```
npm install react-global-event-listener
```


## Use Case

You want multiple components listening for events on the same element(s) using something like `_.debounce`
or `_.throttle` but you don't want to eat the cost of creating *N* debounced listeners for your *N* components. 
`react-global-event-listener` creates just one listener wrapped with your wrapper per `(element, event)` combination 
and dispatches the event to every subscribed component.

## Example

```js
import React from 'react'
import _ from 'lodash'
import { withGlobalEventListener } from 'react-global-event-listener'

class Feed extends React.Component {
  componentWillMount() {
    this.props.subscribeListener(
      window, 
      'scroll', 
      'window.scroll',
      'Feed.onScroll', 
      this.onScroll,
      {listenerWrapper: _.partialRight(_.throttle, 200)}
    )
  }
  
  componentWillUnmount() {
    this.props.unsubscribeListener(
      window,
      'window.scroll',
      'Feed.onScroll'
    )
  }
  
  onScroll = () => {
    // load the next items when we reach the bottom of the feed
  }
  
  render() {
    return (
      <div>
        {this.props.items.map(item => item.title)}
      </div>
    )
  }
}

export default withGlobalEventListener(Feed)
```

## API

The component will be passed two function props:

```js
function subscribeListener(element, eventName, listenerKey, funcKey, func, {listenerWrapper}) {}
```

```js
function unsubscribeListener(element, listenerKey, funcKey) {}
```

#### Arguments

`element` - `DOM element` - The element to call `addEventListener` on

`eventName` - `string` - The [event](https://developer.mozilla.org/en-US/docs/Web/Events) to listen for

`funcKey` - `string` - A key for `element.eventName` that should be *the same* for all subscribers to the 
`(element, eventName)` tuple. This helps us not store DOM elements in our lookup dictionary.

`funcKey` - `string` - A key for the `func` that should be *unique* for all subscribers of the 
`(element, eventName)` tuple. This is used for unsubscribing functions.

`func` - `function` - The function you want to subscribe to the event.  Will be called with `event`.

#### Options

`listenerWrapper` - `function` - Function to wrap the handler used in the call to `addEventListener`.
Should return another function: `f => g(event)`.  Useful when you want to throttle or debounce the event listeners.
Since this is applied on the handler to `addEventListener`, this will affect all downstream subscribers.  
The first component to call `subscribeListener` is the one that creates the handler and applies the wrapper.  
