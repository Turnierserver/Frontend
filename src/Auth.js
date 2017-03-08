import React, { PureComponent, PropTypes } from 'react'
import Relay from 'react-relay'
import { Form, Message, Dimmer, Loader } from 'semantic-ui-react'

import { relayContainer } from './decorators.js'

const userFragment = Relay.QL`
  fragment on User {
    id,
    username,
    lastname,
    firstname
  }
`

class LoginMutation extends Relay.Mutation {
  getMutation () {
    return Relay.QL`mutation Authenticate($input: AuthCredentials!) {
      auth(input: $input)
    }`
  }
  getVariables () {
    return {
      username: this.props.username,
      password: this.props.password
    }
  }
  getConfigs () {
    return [{
      type: 'REQUIRED_CHILDREN',
      children: [
        Relay.QL`
        fragment on AuthOutput {
          user {
            id,
            username
          }
        }
        `
      ]
    }]
  }
  getFatQuery () {
    return Relay.QL`
      fragment on UserStore {
        me { ${userFragment} }
      }
    `
  }
}

function refreshUser (me) {
  let query = Relay.createQuery(Relay.QL`
    query {
      userStore {
        me { ${userFragment} }
      }
    }
  `, {})
  Relay.Store._storeData.handleQueryPayload(query, { userStore: { me } })
}

export function logOut () {
  // TODO: update authenticated user
  document.cookie = ''
  let query = Relay.createQuery(Relay.QL`
    query {
      userStore {
        me { ${userFragment} }
      }
    }
  `, {})
  Relay.Store._storeData.handleQueryPayload(query, { userStore: { me: null } })
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
    showButton: PropTypes.bool,
    onSuccess: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
      loading: null,
      error: false,
      username: '',
      password: ''
    }
    this.handleLogin = this.handleLogin.bind(this)
  }

  handleLogin () {
    let { username, password } = this.state
    this.setState({ loading: 'Checking password...' })
    console.log('logging in...')
    this.props.relay.commitUpdate(
      new LoginMutation({ username, password }),
      { onSuccess: (response) => {
        let user = response.auth.user
        if (user) {
          console.log('user id:', user.id)
          this.setState({ loading: null })
          refreshUser(user)
          this.props.onSuccess(user.id)
        } else {
          this.setState({ loading: 'TODO: handle failure' })
        }
      } }
    )
  }

  render () {
    let authenticated = this.props.me !== null
    return (
      <Form error={this.state.error} success={authenticated}>
        <Form.Input label='Username' onChange={(e) => {
          let username = e.target.value
          this.setState({ username })
        }} />
        <Form.Input label='Password' type='password' onChange={(e) => {
          let password = e.target.value
          this.setState({ password })
        }} />
        <Form.Button type='submit' onClick={(e) => {
          e.preventDefault()
          this.handleLogin()
        }} style={{
          display: this.props.showButton ? '' : 'none'
        }}>Login</Form.Button>
        <Message
          error
          header='Unauthorized'
          content='You may not sign in with this combination of username and password.'
        />
        <Message success header='Success' content='Yay!' />
        <Dimmer active={this.state.loading !== null} inverted>
          <Loader inverted>{this.state.loading}</Loader>
        </Dimmer>
      </Form>
    )
  }
}
