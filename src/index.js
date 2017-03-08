import React from 'react'
import ReactDOM from 'react-dom'
import Relay from 'react-relay'
import 'semantic-ui-css/semantic.css'
import { Message, Button, Header, Icon, Segment } from 'semantic-ui-react'

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
          <center><pre>fetching data...</pre></center>
        </AppSkeleton>
      }
      renderFailure={(error, retry) =>
        <AppSkeleton>
          <Message warning>
            <Header as='h2' icon>
              <Icon name="warning sign" />
              {error.message}
            </Header>
            <Segment attached>
              <pre>{error.stack}</pre>
            </Segment>
            <Button content="Retry?" attached="bottom" onClick={retry}/>
          </Message>
        </AppSkeleton>
      }
      Component={Component}
      route={route} />,
    document.getElementById('root')
  )
})

stateNavigator.start()
