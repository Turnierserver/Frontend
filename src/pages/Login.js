import React, { PureComponent, PropTypes } from 'react'
import Relay from 'react-relay'
import { Segment, Form, Message } from 'semantic-ui-react'

import { App } from '../App.js'

class LoginMutation extends Relay.Mutation {
  getMutation () {
    return Relay.QL`mutation Authenticate($user: String!, $pw: String!) {
      authPw(username: $user, password: $pw)
    }`
  }
  getVariables () {
    return {
      username: this.props.username,
      password: this.props.password
    }
  }
  getConfigs () {
    console.log('getConfigs')
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        user: '-1'
      }
    }]
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

export class LoginForm extends PureComponent {
  static propTypes = {
    relay: PropTypes.any,
    userStore: PropTypes.object
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
    let authenticated = this.props.userStore.me !== null
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
        <Form.Button type='submit' onClick={this.handleLogin}>Login</Form.Button>
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

class _LoginPage extends PureComponent {
  static propTypes = {
    userStore: PropTypes.object,
    stateNavigator: PropTypes.object,
    relay: PropTypes.any
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
    let authenticated = this.props.userStore.me !== null
    let loading = this.state.loading && !(authenticated || this.state.error)
    return (
      <App stateNavigator={this.props.stateNavigator} page='login'>
        <Segment>
          <Form loading={loading} error={this.state.error} success={authenticated}>
            <Form.Input label='Username' onChange={(e) => {
              let username = e.target.value
              this.setState({ username })
            }} />
            <Form.Input label='Password' type='password' onChange={(e) => {
              let password = e.target.value
              this.setState({ password })
            }} />
            <Form.Button type='submit' onClick={this.handleLogin}>Login</Form.Button>
            <Message
              error
              header='Unauthorized'
              content='You may not sign in with this combination of username and password.'
            />
            <Message success header='Success' content='Yay!' />
          </Form>
        </Segment>
      </App>
    )
  }
}

export const LoginPage = Relay.createContainer(_LoginPage, {
  fragments: {
    userStore: () => Relay.QL`
      fragment on UserStore {
        me {
          id
        }
      }
    `
  }
})

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
