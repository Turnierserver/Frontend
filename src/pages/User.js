import { Segment, Label, Divider, Header, Table, Image } from 'semantic-ui-react'

import React, { PureComponent } from 'react'
import Relay from 'react-relay'

import { App } from '../App.js'
import { relayContainer } from '../decorators.js'
import { DataTable } from '../Components/DataTable.js'

@relayContainer({
  fragments: {
    user: () => Relay.QL`
      fragment on User {
        ais {
          id,
          icon,
          rank,
          elo,
          name,
          gametype { id, name }
        }
      }
    `
  }
})
class AIsTable extends DataTable {
  getColumns () {
    return [
      { text: 'Icon' },
      { text: 'Platz', sortable: 'ascending' },
      { text: 'ELO', sortable: 'descending' },
      { text: 'Name', sortable: true },
      { text: 'Spieltyp', sortable: true },
      { text: 'Sprache', sortable: true }
    ]
  }
  renderElement (ai) {
    let { id, rank, elo, name, icon, lang, gametype } = ai
    let currentGametype = null // TODO
    return (
      <Table.Row key={id}>
        <Table.Cell>
          <Image src={icon} avatar />
        </Table.Cell>
        <Table.Cell textAlign='right'>{rank}</Table.Cell>
        <Table.Cell textAlign='right'>{elo}</Table.Cell>
        <Table.Cell>{name}</Table.Cell>
        <Table.Cell>{currentGametype === gametype.id ? <b>{gametype.name}</b> : gametype.name}</Table.Cell>
        <Table.Cell>{lang.name}</Table.Cell>
      </Table.Row>
    )
  }

  render () {
    return this.table(this.getColumns(), this.props.ais, this.renderElement)
  }
}

@relayContainer({
  fragments: {
    userStore: ({ userID }) => Relay.QL`
      fragment on UserStore {
        ${App.getFragment('userStore')}
        user(id: $userID) {
          ${UserPage.getFragment('user')}
        }
      }
    `,
    user: () => Relay.QL`
      fragment on User { ${AIsTable.getFragment('user')} }
    `
  }
})
export class UserPage extends PureComponent {
  static propTypes = {
    stateNavigator: React.PropTypes.object,
    userStore: React.PropTypes.object
  }

  render () {
    let { username, firstname, lastname, ais, canEdit } = this.props.userStore.user
    return (
      <App stateNavigator={this.props.stateNavigator} userStore={this.props.userStore} page='users'>
        <Segment>
          {canEdit ? <Label ribbon="right" color="teal">Bearbeiten</Label> : null}
          <Header as="h1" textAlign="center">
            {username}
            <Header.Subheader>
              { firstname || lastname ? `(${firstname} ${lastname})` : null}
            </Header.Subheader>
          </Header>
          <Divider />

          KIs:
          <AIsTable ais={ais} />

        </Segment>
      </App>
    )
  }
}

export class UserPageRoute extends Relay.Route {
  static routeName = 'UserPage'
  static paramDefinitions = {
    userID: {required: true}
  }
  static queries = {
    userStore: (Component) => Relay.QL`
      query {
        userStore {
          ${Component.getFragment('userStore')}
        }
      }
    `
  }
}
