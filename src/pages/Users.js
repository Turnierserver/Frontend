import React, { PureComponent } from 'react'
import Relay from 'react-relay'
import { Table } from 'semantic-ui-react'
import { NavigationLink } from 'navigation-react'

import { App } from '../App.js'
import { relayContainer } from '../decorators.js'

@relayContainer({
  fragments: {
    user: () => Relay.QL`
      fragment on User {
        id,
        username,
        email,
        admin
      }
    `
  }
})
export class ListEntry extends PureComponent {
  static propTypes = {
    user: React.PropTypes.object,
    stateNavigator: React.PropTypes.object
  }
  render () {
    let { id, username, email, admin } = this.props.user
    return (
      <Table.Row key={username}>
        <Table.Cell>
          <NavigationLink
            stateKey="user"
            navigationData={{userID: id}}
            stateNavigator={this.props.stateNavigator}>
            {username}
          </NavigationLink>
        </Table.Cell>
        <Table.Cell>{email}</Table.Cell>
        <Table.Cell>{admin ? 'Yes' : 'No'}</Table.Cell>
      </Table.Row>
    )
  }
}

@relayContainer({
  fragments: {
    userStore: () => Relay.QL`
      fragment on UserStore {
        ${App.getFragment('userStore')}
        users {
          ${ListEntry.getFragment('user')}
        }
      }
    `
  }
})
export class UsersPage extends PureComponent {
  static propTypes = {
    stateNavigator: React.PropTypes.object,
    userStore: React.PropTypes.object
  }
  render () {
    return (
      <App stateNavigator={this.props.stateNavigator} userStore={this.props.userStore} page='users'>
        <Table singleLine sortable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Username</Table.HeaderCell>
              <Table.HeaderCell>E-Mail</Table.HeaderCell>
              <Table.HeaderCell>Admin</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.props.userStore.users.map((data, i) =>
              <ListEntry key={i} user={data} stateNavigator={this.props.stateNavigator} />
            )}
          </Table.Body>
        </Table>
      </App>
    )
  }
}

export class UsersPageRoute extends Relay.Route {
  static routeName = 'UsersPage'
  static queries = {
    userStore: (Component) => Relay.QL`
      query UsersPageQuery {
        userStore {
          ${Component.getFragment('userStore')}
        }
      }
    `
  }
}
