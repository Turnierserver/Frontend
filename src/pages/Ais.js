import React, { PureComponent, PropTypes } from 'react'
import Relay from 'react-relay'
import { Table, Button } from 'semantic-ui-react'

import { App } from '../App.js'

class _ListEntry extends PureComponent {
  static propTypes = {
    ai: PropTypes.shape({
      id: PropTypes.any,
      elo: PropTypes.number,
      name: PropTypes.string,
      user: PropTypes.shape({ username: PropTypes.string })
    })
  }
  render () {
    let { id, elo, name, user } = this.props.ai
    return (
      <Table.Row key={id}>
        <Table.Cell>{id}</Table.Cell>
        <Table.Cell>rank</Table.Cell>
        <Table.Cell>{elo}</Table.Cell>
        <Table.Cell>{name}</Table.Cell>
        <Table.Cell>{user.username}</Table.Cell>
        <Table.Cell>lang</Table.Cell>
        <Table.Cell>
          <Button>
            Herausfordern
          </Button>
        </Table.Cell>
      </Table.Row>
    )
  }
}

export const ListEntry = Relay.createContainer(_ListEntry, {
  fragments: {
    ai: () => Relay.QL`
      fragment on Ai {
        id,
        name,
        elo,
        user { username }
      }
    `
  }
})

class _AisPage extends PureComponent {
  static propTypes = {
    aiStore: React.PropTypes.object,
    stateNavigator: React.PropTypes.object
  }
  render () {
    return (
      <App stateNavigator={this.props.stateNavigator} page='ais'>
        <Table singleLine sortable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Icon</Table.HeaderCell>
              <Table.HeaderCell>Rank</Table.HeaderCell>
              <Table.HeaderCell>ELO</Table.HeaderCell>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>User</Table.HeaderCell>
              <Table.HeaderCell>Lang</Table.HeaderCell>
              <Table.HeaderCell>Herausfordern</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.props.aiStore.ais.map((data) =>
              <ListEntry key={data.id} ai={data} />)}
          </Table.Body>
        </Table>
      </App>
    )
  }
}

export const AisPage = Relay.createContainer(_AisPage, {
  fragments: {
    aiStore: () => Relay.QL`
      fragment on AiStore {
        ais {
          ${ListEntry.getFragment('ai')},
          id
        }
      }
    `
  }
})

export class AisPageRoute extends Relay.Route {
  static routeName = 'AisPage'
  static queries = {
    aiStore: (Component) => Relay.QL`
      query AisPageQuery {
        aiStore { ${Component.getFragment('aiStore')} }
      }
    `
  }
}
