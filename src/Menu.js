import React, { PureComponent } from 'react'
import logo from './logo.svg'
import { Menu, Icon } from 'semantic-ui-react'

export class AppMenu extends PureComponent {
  static propTypes = {
    stateNavigator: React.PropTypes.object,
    page: React.PropTypes.string
  }
  render () {
    let nav = this.props.stateNavigator
    let page = this.props.page
    let PageLink = ({ route, text }) =>
        <Menu.Item
          active={page === route} name={route}
          onClick={() => { nav.navigate(route) }} >
          {text}
        </Menu.Item>
    return (
      <Menu inverted className="page grid" size='large'>
        <Menu.Item
          active={page === 'home'}
          onClick={() => { nav.navigate('home') }}
          name='logo'>
          <img src={logo} alt="BwInf Logo" />
        </Menu.Item>
        <PageLink route='tutorial' text='Tutorial' />
        <Menu.Menu position='right'>
          <PageLink route='ais' text='KIs' />
          <PageLink route='users' text='Nutzer' />
          <PageLink route='games' text='Spiele' />
          <Menu.Item name='settings'>
            <Icon name='settings' />
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    )
  }
}
