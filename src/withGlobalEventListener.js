import React from 'react'

import GlobalEventListenerContext from './globalEventListenerContext'


const withGlobalEventListener = WrappedComponent => {
  class WithGlobalEventListener extends React.Component {
    render() {
      return (
        <GlobalEventListenerContext.Consumer>
          {({subscribeListener, unsubscribeListener}) => (
            <WrappedComponent
              {...this.props}
              subscribeListener={subscribeListener}
              unsubscribeListener={unsubscribeListener}
            />
          )}
        </GlobalEventListenerContext.Consumer>
      )
    }
  }

  return WithGlobalEventListener
}

export default withGlobalEventListener
