import React, { PureComponent } from 'react'
import Relay from 'react-relay'
import { Table } from 'semantic-ui-react'

import { App } from '../App.js'

class _HomePage extends PureComponent {
  static propTypes = {
    ais: React.PropTypes.object,
    stateNavigator: React.PropTypes.object
  }
  render () {
    return (
      <App stateNavigator={this.props.stateNavigator} page='home'>
        <button className="ui basic green button">Registrieren</button>
        <button className="ui basic green button">Passwort zurücksetzen</button>
        <a className="ui basic green button">Codr runterladen</a>
      </App>
    )
  }
}

export const HomePage = Relay.createContainer(_HomePage, {
  fragments: {}
})

export class HomePageRoute extends Relay.Route {
  static routeName = 'HomePage'
  static queries = {}
}
