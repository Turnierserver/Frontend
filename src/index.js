import React from 'react'
import ReactDOM from 'react-dom'
import Relay from 'react-relay'
import 'semantic-ui-css/semantic.css'
import { Loader, Dimmer } from 'semantic-ui-react'

import { AppSkeleton } from './App.js'
import { stateNavigator } from './routes.js'

const networkLayer = new Relay.DefaultNetworkLayer(
  'http://localhost:3000/graphql',
  { credentials: 'same-origin' }
)

Relay.injectNetworkLayer(networkLayer)

stateNavigator.onNavigate((oldState, state, data) => {
  let route = state.relayRoute(data)
  let Component = state.component
  window.store = Relay.Store
  ReactDOM.render(
    <Relay.RootContainer
      renderFetched={(data) =>
        <Component {...data} stateNavigator={stateNavigator} />
      }
      renderLoading={() =>
        <AppSkeleton>
          <Dimmer active>
            <Loader>fetching data...</Loader>
          </Dimmer>
        </AppSkeleton>
      }
      renderFailure={(error, retry) =>
        <AppSkeleton>
          <p>{error.message}</p>
          <p><button onClick={retry}>Retry?</button></p>
        </AppSkeleton>
      }
      Component={Component}
      route={route} />,
    document.getElementById('root')
  )
})

stateNavigator.start()
