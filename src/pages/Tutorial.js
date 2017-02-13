import React, { PureComponent } from 'react'
import Relay from 'react-relay'
import ReactMarkdown from 'react-markdown'

import { App } from '../App.js'

const tutorialData = require('../../tutorial.md') // FIXME

class _TutorialPage extends PureComponent {
  static propTypes = {
    ais: React.PropTypes.object,
    stateNavigator: React.PropTypes.object
  }
  render () {
    return (
      <App stateNavigator={this.props.stateNavigator} page='tutorial'>
        <ReactMarkdown source={tutorialData} />
      </App>
    )
  }
}

export const TutorialPage = Relay.createContainer(_TutorialPage, {
  fragments: {}
})
