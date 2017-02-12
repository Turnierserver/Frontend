import React, { PureComponent } from 'react'
import Relay from 'react-relay'
import { Table } from 'semantic-ui-react'

import { App } from '../App.js'


// @graphql(ListEntryQuery) TODO: decorators
class _ListEntry extends PureComponent {
  static propTypes = {
    ai: React.PropTypes.object
  }
  render () {
    let { id } = this.props.ai
    return (
      <Table.Row key={id}>
        <Table.Cell>{id}</Table.Cell>
      </Table.Row>
    )
  }
}

export const ListEntry = Relay.createContainer(_ListEntry, {
  fragments: {
    ai: () => Relay.QL`
      fragment on AI {
        id,
        name
      }
    `
  }
})

class _AIsPage extends PureComponent {
  static propTypes = {
    ais: React.PropTypes.object,
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
            {this.props.ais.ais.map((data, i) => <ListEntry key={i} ai={data} />)}
          </Table.Body>
        </Table>
      </App>
    )
  }
}

export const AIsPage = Relay.createContainer(_AIsPage, {
  fragments: {
    ais: () => Relay.QL`
      fragment on AIStore {
        ais {
          ${ListEntry.getFragment('ai')}
        }
      }
    `
  }
})

export class AIsPageRoute extends Relay.Route {
  static routeName = 'AIsPage'
  static queries = {
    ais: (Component) => Relay.QL`
      query AIsPageQuery {
        aiStore { ${Component.getFragment('ais')} }
      }
    `
  }
}
