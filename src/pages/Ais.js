import React, { PureComponent, PropTypes } from 'react'
import Relay from 'react-relay'
import { Table, Button, Popup, Label, Divider, Dropdown, Image } from 'semantic-ui-react'

import { App } from '../App.js'
import { relayContainer } from '../decorators.js'

@relayContainer({
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
export class ListEntry extends PureComponent {
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

@relayContainer({
  fragments: {
    aiStore: () => Relay.QL`
      fragment on AiStore {
        ais {
          ${ListEntry.getFragment('ai')},
          id
        }
      }
    `,
    userStore: { deriveFrom: App }
  }
})
export class AisPage extends PureComponent {
  static propTypes = {
    aiStore: PropTypes.object,
    stateNavigator: PropTypes.object,
    userStore: PropTypes.object
  }
  render () {
    return (
      <App stateNavigator={this.props.stateNavigator} userStore={this.props.userStore} page='ais'>
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

export class AisPageRoute extends Relay.Route {
  static routeName = 'AisPage'
  static queries = {
    aiStore: (Component) => Relay.QL`
      query {
        aiStore { ${Component.getFragment('aiStore')} }
      }
    `,
    userStore: (Component) => Relay.QL`
      query {
        userStore { ${Component.getFragment('userStore')} }
      }
    `
  }
}
