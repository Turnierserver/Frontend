import React, { PureComponent, PropTypes } from 'react'
import Relay from 'react-relay'
import { Segment, Form, Message } from 'semantic-ui-react'

import { App } from '../App.js'
import { relayContainer } from '../decorators.js'

class LoginMutation extends Relay.Mutation {
  getMutation () {
    return Relay.QL`mutation Authenticate($input: AuthCredentials!) {
      auth(input: $input)
    }`
  }
  getVariables () {
    return {
      input: {
        username: this.props.username,
        password: this.props.password
      }
    }
  }
  getConfigs () {
    return []
  }
  getFatQuery () {
    // FIXME?
    return Relay.QL`
      fragment on User {
        id,
        firstname,
        lastname,
        ais
      }
    `
  }
}

@relayContainer({
  fragments: {
    me: () => Relay.QL`
      fragment on User {
        id
      }
    `
  }
})
export class LoginForm extends PureComponent {
  static propTypes = {
    relay: PropTypes.any,
    me: PropTypes.object,
    showButton: PropTypes.bool
  }

  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      error: false,
      username: '',
      password: ''
    }
    this.handleLogin = this.handleLogin.bind(this)
  }

  handleLogin () {
    let { username, password } = this.state
    this.setState({ loading: true })
    this.props.relay.commitUpdate(
      new LoginMutation({ username, password })
    )
  }

  render () {
    let authenticated = this.props.me !== null
    let loading = this.state.loading && !(authenticated || this.state.error)
    return (
      <Form loading={loading} error={this.state.error} success={authenticated}>
        <Form.Input label='Username' onChange={(e) => {
          let username = e.target.value
          this.setState({ username })
        }} />
        <Form.Input label='Password' type='password' onChange={(e) => {
          let password = e.target.value
          this.setState({ password })
        }} />
        <Form.Button type='submit' onClick={this.handleLogin} style={{
          visibility: this.props.showButton ? '' : 'hidden'
        }}>Login</Form.Button>
        <Message
          error
          header='Unauthorized'
          content='You may not sign in with this combination of username and password.'
        />
        <Message success header='Success' content='Yay!' />
      </Form>
    )
  }
}

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
