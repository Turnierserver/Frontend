import React, { PureComponent } from 'react'
import Relay from 'react-relay'
import { Table } from 'semantic-ui-react'

import { App } from '../App.js'

// @graphql(ListEntryQuery) TODO: decorators
class _ListEntry extends PureComponent {
  static propTypes = {
    user: React.PropTypes.object
  }
  render () {
    let { username, email, admin } = this.props.user
    return (
      <Table.Row key={username}>
        <Table.Cell>{username}</Table.Cell>
        <Table.Cell>{email}</Table.Cell>
        <Table.Cell>{admin ? 'Yes' : 'No'}</Table.Cell>
      </Table.Row>
    )
  }
}

export const ListEntry = Relay.createContainer(_ListEntry, {
  fragments: {
    user: () => Relay.QL`
      fragment on User {
        username,
        email,
        admin
      }
    `
  }
})

class _UsersPage extends PureComponent {
  static propTypes = {
    users: React.PropTypes.object,
    stateNavigator: React.PropTypes.object
  }
  render () {
    return (
      <App stateNavigator={this.props.stateNavigator} page='users'>
        <Table singleLine sortable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Username</Table.HeaderCell>
              <Table.HeaderCell>E-Mail</Table.HeaderCell>
              <Table.HeaderCell>Admin</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.props.users.users.map((data, i) => <ListEntry key={i} user={data} />)}
          </Table.Body>
        </Table>
      </App>
    )
  }
}

export const UsersPage = Relay.createContainer(_UsersPage, {
  fragments: {
    users: () => Relay.QL`
      fragment on UserStore {
        users {
          ${ListEntry.getFragment('user')}
        }
      }
    `
  }
})

export class UsersPageRoute extends Relay.Route {
  static routeName = 'UsersPage'
  static queries = {
    users: (Component) => Relay.QL`
      query UsersPageQuery {
        userStore { ${Component.getFragment('users')} }
      }
    `
  }
}