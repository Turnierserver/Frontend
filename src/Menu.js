import React, { PureComponent, PropTypes } from 'react'
import logo from './logo.svg'
import { LoginForm } from './pages/Login.js'
import { Menu, Icon, Dropdown, Modal, Button } from 'semantic-ui-react'

export class AppMenu extends PureComponent {
  static propTypes = {
    stateNavigator: PropTypes.object,
    page: PropTypes.string,
    me: PropTypes.object
  }

  constructor (props) {
    super(props)
    this.state = {
      loginModalOpen: false
    }
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
          {this.props.me ? (
            <Dropdown item icon='wrench' simple>
              <Dropdown.Menu>
                <Dropdown.Item>
                  <Icon name='dropdown' />
                  <span className='text'>New</span>

                  <Dropdown.Menu>
                    <Dropdown.Item>Document</Dropdown.Item>
                    <Dropdown.Item>Image</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown.Item>
                <Dropdown.Item>Open</Dropdown.Item>
                <Dropdown.Item>Save...</Dropdown.Item>
                <Dropdown.Item>Edit Permissions</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Header>Account</Dropdown.Header>
                <Dropdown.Item>Settings</Dropdown.Item>
                <Dropdown.Item>Log out</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <Menu.Item name='sign in' onClick={() => this.setState({ loginModalOpen: true })} active={page === 'login'}>
              <Icon name='sign in' />
            </Menu.Item>
          )}

          <Modal dimmer='blurring' open={this.state.loginModalOpen} onClose={() => this.setState({ loginModalOpen: false })}>
            <Modal.Header>Enter your Credentials</Modal.Header>
            <Modal.Content>
              <Modal.Description>
                <LoginForm me={null} />
              </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
              <Button color='black' onClick={() => this.setState({ loginModalOpen: false })}>Back</Button>
              <Button positive icon='checkmark' labelPosition='right' content="Sign in" onClick={() => {
                console.log('test')
              }} />
            </Modal.Actions>
          </Modal>
        </Menu.Menu>
      </Menu>
    )
  }
}
