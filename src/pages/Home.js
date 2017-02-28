import React, { PureComponent, PropTypes } from 'react'

import { App } from '../App.js'
import { relayContainer } from '../decorators.js'

@relayContainer({
  fragments: {
    userStore: { deriveFrom: App }
  }
})
export class HomePage extends PureComponent {
  static propTypes = {
    ais: PropTypes.object,
    stateNavigator: PropTypes.object,
    userStore: PropTypes.object
  }
  render () {
    return (
      <App page='home' stateNavigator={this.props.stateNavigator} userStore={this.props.userStore}>
        <button className="ui basic green button">Registrieren</button>
        <button className="ui basic green button">Passwort zurücksetzen</button>
        <a className="ui basic green button">Codr runterladen</a>
      </App>
    )
  }
}
