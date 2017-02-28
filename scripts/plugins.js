let relayPlugin = require('../config/plugins/relay')

function start () {
  return Promise.all([
    (relayPlugin.isEnabled()) ? relayPlugin.start() : false
  ])
}

function build () {
  return Promise.all([
    (relayPlugin.isEnabled()) ? relayPlugin.build() : false
  ])
}

module.exports = {
  build: build,
  start: start
}
