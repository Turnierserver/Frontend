import React, { PureComponent, PropTypes } from 'react'
import Relay from 'react-relay'
import { Table, Button, Popup, Label, Divider, Dropdown, Image } from 'semantic-ui-react'

import { App } from '../App.js'

class _ListEntry extends PureComponent {
  static propTypes = {
    ai: PropTypes.object,
    me: PropTypes.object
  }
  render () {
    let { id, elo, name, user, icon } = this.props.ai
    let choices = [
      { key: 'A', value: 'A', text: 'Meine KI', image: { avatar: true, src: '' } } // TODO
    ]
    return (
      <Table.Row key={id}>
        <Table.Cell>
          <Image src={icon} avatar />
        </Table.Cell>
        <Table.Cell>rank</Table.Cell>
        <Table.Cell>{elo}</Table.Cell>
        <Table.Cell>{name}</Table.Cell>
        <Table.Cell>{user.username}</Table.Cell>
        <Table.Cell>lang</Table.Cell>
        <Table.Cell>
          <Popup
            trigger={<Button content='Herausfordern' />}
            content={
              <div>
                <Label attached='top' content='Deine KI' />
                <Dropdown placeholder='Deine KI' search selection options={choices} />
                <Divider hidden />
                <Button color='teal' fluid content='Herausforderung starten' />
              </div>
            }
            on='click'
            position='left center'
          />
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
        icon,
        user { username }
      }
    `,
    me: () => Relay.QL`
      fragment on User {
        id,
        username,
        ais {
          id,
          name,
          icon
        }
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
              <ListEntry key={data.id} ai={data} me={null} />)}
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
