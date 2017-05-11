import { Segment, Label, Divider, Header, Table, Image } from 'semantic-ui-react'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Relay from 'react-relay'

import { App } from '../App.js'
import { relayContainer } from '../decorators.js'
import { DataTable } from '../Components/DataTable.js'

@relayContainer({
  fragments: {
    ais: () => Relay.QL`
      fragment on Ai @relay(plural: true) {
        id,
        icon,
        rank,
        elo,
        name,
        gametype { id, name }
        # TODO lang { id, name }
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
        {lang ? <Table.Cell>{lang.name}</Table.Cell> : null}
      </Table.Row>
    )
  }

  render () {
    return this.table(this.getColumns(), this.props.ais, this.renderElement)
  }
}

@relayContainer({
  initialVariables: { userID: null },
  fragments: {
    userStore: () => Relay.QL`
      fragment on UserStore {
        ${App.getFragment('userStore')}
        user(id: $userID) {
          username,
          firstname, lastname,
          canEdit
          ais { ${AIsTable.getFragment('ais')} }
        }
      }
    `
  }
})
export class UserPage extends PureComponent {
  static propTypes = {
    stateNavigator: PropTypes.object,
    userStore: PropTypes.object
  }

  render () {
    let { username, firstname, lastname, ais, canEdit } = this.props.userStore.user
    if (username === undefined) {
      return (
        <App stateNavigator={this.props.stateNavigator} userStore={this.props.userStore} page='users'>
          <Segment>
            <h2>Unknown user</h2>
            <pre>{JSON.stringify(this.props.userStore, null, 2)}</pre>
          </Segment>
        </App>
      )
    }
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
    userStore: (Component, vars) => Relay.QL`
      query {
        userStore {
          ${Component.getFragment('userStore', vars)}
        }
      }
    `
  }
}
