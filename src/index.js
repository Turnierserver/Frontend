import React from 'react'
import ReactDOM from 'react-dom'
import Relay from 'react-relay'
import 'semantic-ui-css/semantic.css'

import { stateNavigator } from './routes.js'

/*
Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer('http://localhost:8000/graphql')
)
*/

stateNavigator.onNavigate((oldState, state, data) => {
  let route = state.relayRoute(data)
  let Component = state.component
  ReactDOM.render(
    <Relay.RootContainer
      renderFetched={data =>
        <Component {...data} stateNavigator={stateNavigator} />
      }
      Component={Component}
      route={route} />,
    document.getElementById('root')
  )
})

stateNavigator.start()
