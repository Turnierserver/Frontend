import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Relay from 'react-relay'
import { Table, Button } from 'semantic-ui-react'

import { relayContainer } from '../decorators.js'
import { App } from '../App.js'

@relayContainer({
  fragments: {
    game: () => Relay.QL`
      fragment on Game {
        id,
        timestamp,
        ais { ai { id, name } }
        gametype { name }
      }
    `
  }
})
export class ListEntry extends PureComponent {
  static propTypes = {
    game: PropTypes.shape({
      id: PropTypes.any,
      timestamp: PropTypes.string,
      ais: PropTypes.array,
      gametype: PropTypes.object
    })
  }
  render () {
    let { id, timestamp, ais, gametype } = this.props.game
    return (
      <Table.Row key={id}>
        <Table.Cell>{id}</Table.Cell>
        <Table.Cell>{timestamp}</Table.Cell>
        <Table.Cell>{gametype.name}</Table.Cell>
        <Table.Cell><pre>{JSON.stringify(ais, null, 2)}</pre></Table.Cell>
        <Table.Cell>
          <Button disabled>Details</Button>
        </Table.Cell>
      </Table.Row>
    )
  }
}

@relayContainer({
  fragments: {
    gameStore: () => Relay.QL`
      fragment on GameStore {
        games {
          ${ListEntry.getFragment('game')},
          id
        }
      }
    `,
    userStore: { deriveFrom: App }
  }
})
export class GamesPage extends PureComponent {
  static propTypes = {
    gameStore: PropTypes.object,
    stateNavigator: PropTypes.object,
    userStore: PropTypes.object
  }
  render () {
    return (
      <App stateNavigator={this.props.stateNavigator} userStore={this.props.userStore} page='games'>
        <Table singleLine sortable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>ID</Table.HeaderCell>
              <Table.HeaderCell>Timestamp</Table.HeaderCell>
              <Table.HeaderCell>Gametype</Table.HeaderCell>
              <Table.HeaderCell>Ais</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.props.gameStore.games.map((data) =>
              <ListEntry key={data.id} game={data} />)}
          </Table.Body>
        </Table>
      </App>
    )
  }
}

export class GamesPageRoute extends Relay.Route {
  static routeName = 'GamesPage'
  static queries = {
    gameStore: (Component) => Relay.QL`
      query GamesPageQuery {
        gameStore { ${Component.getFragment('gameStore')} }
      }
    `,
    userStore: (Component) => Relay.QL`
      query UsersPageQuery {
        userStore {
          ${Component.getFragment('userStore')}
        }
      }
    `
  }
}
