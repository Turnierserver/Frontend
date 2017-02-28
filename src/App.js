import React, { PureComponent } from 'react'
import Relay from 'react-relay'
import { Grid } from 'semantic-ui-react'
import { AppMenu } from './Menu.js'

import { relayContainer } from './decorators.js'

@relayContainer({
  fragments: {
    userStore: () => Relay.QL`
      fragment on UserStore {
        me { ${AppMenu.getFragment('me')} }
      }
    `
  }
})
export class App extends PureComponent {
  static propTypes = {
    children: React.PropTypes.any,
    stateNavigator: React.PropTypes.object,
    page: React.PropTypes.string,
    userStore: React.PropTypes.object
  }
  render () {
    return (
      <div>
        <AppMenu
          stateNavigator={this.props.stateNavigator} page={this.props.page}
          me={this.props.userStore.me} />
        <Grid className="page">
          <Grid.Row>
            <Grid.Column>
              {this.props.children}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }
}

