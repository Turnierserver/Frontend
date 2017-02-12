import React, { PureComponent } from 'react'
import Relay from 'react-relay'
import { Segment } from 'semantic-ui-react'
import { AppMenu } from './Menu.js'
import { UserList, UserListRoute } from './Users.js'

export class App extends PureComponent {
  render () {
    return (
      <div>
        <AppMenu />
        <Segment>
          <Relay.RootContainer
            Component={UserList}
            route={new UserListRoute()}
          />
        </Segment>
      </div>
    )
  }
}

