import React from 'react'
import _ from 'lodash'

import GlobalEventListenerContext from './globalEventListenerContext'


class GlobalEventListener extends React.Component {
  listeners = {}

  componentWillUnmount() {
    _.forEach(this.listeners, (eventNames, element) => {
      _.forEach(eventNames, (eventHandler, eventName) => {
        if (eventHandler.eventListener) {
          element.removeEventListener(eventName, eventHandler.eventListener)
        }
      })
    })
  }

  makeListener = (element, eventName) => {
    return (event) => {
      _.forEach(this.listeners[element][eventName].subscriptions, subscriber => {
        subscriber(event)
      })
    }
  }

  subscribeListener = (element, eventName, funcKey, func, {listenerWrapper = null} = {}) => {
    let eventListener = _.get(this.listeners, [element, eventName, 'eventListener'])

    if (!eventListener) {
      const madeListener = this.makeListener(element, eventName)
      eventListener = listenerWrapper ? listenerWrapper(madeListener) : madeListener
      element.addEventListener(eventName, eventListener)
    }

    this.listeners = {
      ...this.listeners,
      [element]: {
        ..._.get(this.listeners, element, {}),
        [eventName]: {
          ..._.get(this.listeners, [element, eventName], {}),
          eventListener: eventListener,
          subscriptions: {
            ..._.get(this.listeners, [element, eventName, 'subscriptions'], {}),
            [funcKey]: func,
          }
        }
      }
    }
  }

  unsubscribeListener = (element, eventName, funcKey) => {
    const { subscriptions, eventListener } = this.listeners[element][eventName]

    const {[funcKey]: func, ...newSubscriptions} = subscriptions
    if (_.isEmpty(newSubscriptions)) {
      if (eventListener.hasOwnProperty('cancel')) {
        eventListener.cancel();
      }
      element.removeEventListener(eventName, eventListener)
    }

    this.listeners = {
      ...this.listeners,
      [element]: {
        ..._.get(this.listeners, element, {}),
        [eventName]: {
          ..._.get(this.listeners, `${element}.${eventName}`, {}),
          subscriptions: newSubscriptions,
          eventListener: _.isEmpty(newSubscriptions) ? null : eventListener,
        }
      }
    }
  }

  render() {
    return (
      <GlobalEventListenerContext.Provider
        value={{
          subscribeListener: this.subscribeListener,
          unsubscribeListener: this.unsubscribeListener,
        }}
      >
        {this.props.children}
      </GlobalEventListenerContext.Provider>
    )
  }
}

export default GlobalEventListener
