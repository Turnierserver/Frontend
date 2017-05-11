import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Relay from 'react-relay'
import { Table, Button, Popup, Label, Divider, Dropdown, Image } from 'semantic-ui-react'

import { App } from '../App.js'
import { DataTable } from '../Components/DataTable.js'
import { relayContainer } from '../decorators.js'

@relayContainer({
  fragments: {
    aiStore: () => Relay.QL`
      fragment on AiStore {
        ais {
          id,
          icon,
          rank,
          elo,
          name,
          user { id, username },
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
      { text: 'User', sortable: true },
      { text: 'Spieltyp', sortable: true },
      { text: 'Sprache', sortable: true },
      { text: 'Herausfordern', sortable: true }
    ]
  }
  renderElement (ai) {
    let { id, rank, elo, name, user, icon, lang, gametype } = ai
    let currentGametype = null // TODO
    let choices = [
      { key: 'A', value: 'A', text: 'Meine KI', image: { avatar: true, src: '' } } // TODO
    ]
    return (
      <Table.Row key={id}>
        <Table.Cell>
          <Image src={icon} avatar />
        </Table.Cell>
        <Table.Cell textAlign='right'>{rank}</Table.Cell>
        <Table.Cell textAlign='right'>{elo}</Table.Cell>
        <Table.Cell>{name}</Table.Cell>
        <Table.Cell>{user.username}</Table.Cell>
        <Table.Cell>{currentGametype === gametype.id ? <b>{gametype.name}</b> : gametype.name}</Table.Cell>
        <Table.Cell>{lang ? lang.name : 'FIXME'}</Table.Cell>
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

  render () {
    return this.table(this.getColumns(), this.props.aiStore.ais, this.renderElement)
  }
}

@relayContainer({
  fragments: {
    aiStore: { deriveFrom: AIsTable },
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
        <AIsTable aiStore={this.props.aiStore} />
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
