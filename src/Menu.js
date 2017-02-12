import React, { PureComponent } from 'react'
import logo from './logo.svg'
import { Menu } from 'semantic-ui-react'

export class AppMenu extends PureComponent {
  render () {
    return (
      <Menu inverted>
        <Menu.Item name='logo'>
          <img src={logo} alt="BwInf Logo" />
        </Menu.Item>
        <Menu.Item
          name='ais'
          onClick={() => { console.log('click') }} >
          KIs
        </Menu.Item>
        <Menu.Item
          name='users' active
          onClick={() => { console.log('click') }} >
          Nutzer
        </Menu.Item>
      </Menu>
    )
  }
}
