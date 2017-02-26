let relayPlugin = require('../config/plugins/relay')

export function start () {
  return Promise.all([
    (relayPlugin.isEnabled()) ? relayPlugin.start() : false
  ])
}

export function build () {
  return Promise.all([
    (relayPlugin.isEnabled()) ? relayPlugin.build() : false
  ])
}
