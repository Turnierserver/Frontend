import React, { PureComponent } from 'react'
import logo from './logo.svg'
import { Menu } from 'semantic-ui-react'

export class AppMenu extends PureComponent {
  static propTypes = {
    stateNavigator: React.PropTypes.object,
    page: React.PropTypes.string
  }
  render () {
    let nav = this.props.stateNavigator
    let page = this.props.page
    return (
      <Menu inverted>
        <Menu.Item
          active={page === 'home'}
          onClick={() => { nav.navigate('home') }}
          name='logo'>
          <img src={logo} alt="BwInf Logo" />
        </Menu.Item>
        <Menu.Item
          active={page === 'ais'}
          name='ais'
          onClick={() => { nav.navigate('ais') }} >
          KIs
        </Menu.Item>
        <Menu.Item
          active={page === 'users'}
          name='users'
          onClick={() => { nav.navigate('users') }} >
          Nutzer
        </Menu.Item>
      </Menu>
    )
  }
}
