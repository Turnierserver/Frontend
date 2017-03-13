import React, { PureComponent } from 'react'
import Relay from 'react-relay'
import { Table } from 'semantic-ui-react'

import { App } from '../App.js'
import { DataTable } from '../Components/DataTable.js'
import { relayContainer } from '../decorators.js'

@relayContainer({
  fragments: {
    userStore: () => Relay.QL`
      fragment on UserStore {
        users {
          id,
          username,
          email,
          admin
        }
      }
    `
  }
})
class UsersTable extends DataTable {
  getColumns () {
    return [
      { text: 'Username', sortable: true, id: 'username' },
      { text: 'E-Mail', sortable: true, id: '' },
      { text: 'Admin', sortable: true }
    ]
  }
  renderElement (user) {
    let { id, username, admin, email } = user
    return (
      <Table.Row key={id}>
        <Table.Cell>{username}</Table.Cell>
        <Table.Cell>{email}</Table.Cell>
        <Table.Cell>{admin ? 'Yes' : 'No'}</Table.Cell>
      </Table.Row>
    )
  }

  render () {
    return this.table(this.getColumns(), this.props.userStore.users, this.renderElement)
  }
}

@relayContainer({
  fragments: {
    userStore: () => Relay.QL`
      fragment on UserStore {
        ${App.getFragment('userStore')}
        ${UsersTable.getFragment('userStore')}
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
        <UsersTable userStore={this.props.userStore} />
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
