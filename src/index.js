import React from 'react'
import ReactDOM from 'react-dom'
// import Relay from 'react-relay'
import { App } from './App'
import 'semantic-ui-css/semantic.css'

/*
Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer('http://localhost:8000/graphql')
)
*/


ReactDOM.render(
  <App />,
  document.getElementById('root')
)
