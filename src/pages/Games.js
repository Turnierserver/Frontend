import React, { PureComponent, PropTypes } from 'react'
import Relay from 'react-relay'
import { Table, Button } from 'semantic-ui-react'

import { relayContainer } from '../decorators.js'
import { App } from '../App.js'

@relayContainer({
  fragments: {
    game: () => Relay.QL`
      fragment on Game {
        id,
        gametype { name }
      }
    `
  }
})
export class ListEntry extends PureComponent {
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
    gameStore: React.PropTypes.object,
    stateNavigator: React.PropTypes.object,
    userStore: React.PropTypes.object
  }
  render () {
    return (
      <App stateNavigator={this.props.stateNavigator} userStore={this.props.userStore} page='games'>
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
            {this.props.gameStore.games.map((data) =>
              <ListEntry key={data.id} ai={data} />)}
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
