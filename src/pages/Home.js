import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { App } from '../App.js'
import { relayContainer } from '../decorators.js'
import { Button, Icon } from 'semantic-ui-react'

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
        <center style={{height: '100%'}}>
          <Icon.Group size='huge'>
            <Icon size='big' name='sun' />
            <Icon name='lab' />
          </Icon.Group>
          <br />
          <div style={{padding: '3em'}}>
            <Button color='green' basic>Registrieren</Button>
            <Button color='green' basic>Passwort zurücksetzen</Button>
            <Button color='green' basic>Codr runterladen</Button>
          </div>
        </center>
      </App>
    )
  }
}
