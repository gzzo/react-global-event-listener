import React from "react";
import _ from "lodash";

import GlobalEventListenerContext from "./globalEventListenerContext";

class GlobalEventListener extends React.Component {
  listeners = {};

  makeListener = (element, listenerKey) => {
    return event => {
      _.forEach(this.listeners[listenerKey].subscriptions, subscriber => {
        subscriber(event);
      });
    };
  };

  subscribeListener = (
    element,
    eventName,
    listenerKey,
    funcKey,
    func,
    { listenerWrapper = null } = {}
  ) => {
    let eventListener = _.get(this.listeners, [listenerKey, "eventListener"]);

    if (!eventListener) {
      const madeListener = this.makeListener(element, listenerKey);
      eventListener = listenerWrapper
        ? listenerWrapper(madeListener)
        : madeListener;
      element.addEventListener(eventName, eventListener);
    }

    this.listeners = {
      ...this.listeners,
      [listenerKey]: {
        ..._.get(this.listeners, listenerKey, {}),
        eventListener: eventListener,
        eventName: eventName,
        subscriptions: {
          ..._.get(this.listeners, [listenerKey, "subscriptions"], {}),
          [funcKey]: func
        }
      }
    };
  };

  unsubscribeListener = (element, listenerKey, funcKey) => {
    const { subscriptions, eventListener, eventName } = this.listeners[listenerKey];

    const { [funcKey]: func, ...newSubscriptions } = subscriptions;
    if (_.isEmpty(newSubscriptions)) {
      if (eventListener.hasOwnProperty("cancel")) {
        eventListener.cancel();
      }

      if (element && element.removeEventListener) {
        element.removeEventListener(eventName, eventListener);
      }
    }

    this.listeners = {
      ...this.listeners,
      [listenerKey]: {
        ..._.get(this.listeners, eventName, {}),
        subscriptions: newSubscriptions,
        eventListener: _.isEmpty(newSubscriptions) ? null : eventListener
      }
    };
  };

  render() {
    return (
      <GlobalEventListenerContext.Provider
        value={{
          subscribeListener: this.subscribeListener,
          unsubscribeListener: this.unsubscribeListener
        }}
      >
        {this.props.children}
      </GlobalEventListenerContext.Provider>
    );
  }
}

export default GlobalEventListener;
