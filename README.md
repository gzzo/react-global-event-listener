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
      'Feed.onScroll', 
      this.onScroll,
      {listenerWrapper: _.partialRight(_.throttle, 200)}
    )
  }
  
  componentWillUnmount() {
    this.props.unsubscribeListener(
      window,
      'scroll',
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
