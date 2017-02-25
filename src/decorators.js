import Relay from 'react-relay'

export function relayContainer (options) {
  return function (target, key, descriptor) {
    return Relay.createContainer(target, options)
  }
}
