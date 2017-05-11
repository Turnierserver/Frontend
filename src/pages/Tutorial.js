import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import ReactMarkdown from 'react-markdown'
import { Segment } from 'semantic-ui-react'

import { App } from '../App.js'
import { relayContainer } from '../decorators.js'

import tutorialData from '../../tutorial.md'

@relayContainer({
  fragments: {
    userStore: { deriveFrom: App }
  }
})
export class TutorialPage extends PureComponent {
  static propTypes = {
    ais: PropTypes.object,
    stateNavigator: PropTypes.object,
    userStore: PropTypes.object
  }
  render () {
    return (
      <App stateNavigator={this.props.stateNavigator} userStore={this.props.userStore} page='tutorial'>
        <Segment>
          <ReactMarkdown source={tutorialData} />
        </Segment>
      </App>
    )
  }
}
