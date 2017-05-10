import Relay from 'react-relay'

export function relayContainer (options) {
  for (let key of Object.keys(options.fragments)) {
    let v = options.fragments[key]
    if (typeof v === 'object' && v.deriveFrom !== undefined) {
      let component = v.deriveFrom
      let type = component.getFragment(key).getFragment().type
      /* TODO: fix babel-relay-plugin
      options.fragments[key] = () => Relay.QL(
        ['fragment on ' + type + ' {', '}'],
        component.getFragment(key)
      ) */
      switch (type) {
        case 'UserStore':
          options.fragments[key] = () => Relay.QL`
            fragment on UserStore {
              ${component.getFragment(key)}
            }
          `
          break
        case 'AiStore':
          options.fragments[key] = () => Relay.QL`
            fragment on AiStore {
              ${component.getFragment(key)}
            }
          `
          break
        default:
          console.log(`type ${type} is missing :'(`)
          options.fragments[key] = () => Relay.QL()
          /* options.fragments[key] = () => Relay.QL`
            fragment on ${type} {
              ${component.getFragment(key)}
            }
          ` */
          break
      }
    }
  }
  return function (target, key, descriptor) {
    return Relay.createContainer(target, options)
  }
}
