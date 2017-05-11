import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
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
    children: PropTypes.any,
    stateNavigator: PropTypes.object,
    page: PropTypes.string,
    userStore: PropTypes.object
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

export class AppSkeleton extends PureComponent {
  static propTypes = { children: PropTypes.any }
  render () {
    return (
      <div>
        <AppMenu skeleton
          stateNavigator={null} page={null} me={null} />
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
