import React, { PureComponent, PropTypes } from 'react'
import Relay from 'react-relay'
import { Segment } from 'semantic-ui-react'

import { App } from '../App.js'
import { LoginForm } from '../Auth.js'
import { relayContainer } from '../decorators.js'

@relayContainer({
  fragments: {
    userStore: () => Relay.QL`
      fragment on UserStore {
        ${App.getFragment('userStore')}
        me {
          id
        }
      }
    `
  }
})
export class LoginPage extends PureComponent {
  static propTypes = {
    userStore: PropTypes.object,
    stateNavigator: PropTypes.object,
    relay: PropTypes.any
  }

  render () {
    return (
      <App stateNavigator={this.props.stateNavigator} userStore={this.props.userStore} page='login'>
        <Segment>
          <LoginForm userStore={this.props.userStore} me={this.props.userStore.me} showButton />
        </Segment>
      </App>
    )
  }
}

export class LoginPageRoute extends Relay.Route {
  static routeName = 'LoginPage'
  static queries = {
    userStore: (Component) => Relay.QL`
      query LoginPageQuery {
        userStore { ${Component.getFragment('userStore')} }
      }
    `
  }
}
