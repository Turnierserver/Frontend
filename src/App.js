import React, { PureComponent } from 'react'
import { Grid } from 'semantic-ui-react'
import { AppMenu } from './Menu.js'

export class App extends PureComponent {
  static propTypes = {
    children: React.PropTypes.any,
    stateNavigator: React.PropTypes.object,
    page: React.PropTypes.string
  }
  render () {
    return (
      <div>
        <AppMenu stateNavigator={this.props.stateNavigator} page={this.props.page} />
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

