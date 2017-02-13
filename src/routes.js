import Relay from 'react-relay'
import { StateNavigator } from 'navigation'
import { HomePage } from './pages/Home.js'
import { TutorialPage } from './pages/Tutorial.js'
import { UsersPageRoute, UsersPage } from './pages/Users.js'
import { AIsPageRoute, AIsPage } from './pages/AIs.js'

export class EmptyRoute extends Relay.Route {
  static routeName = 'EmptyRoute'
  static queries = {}
}

export const stateNavigator = new StateNavigator([
  {
    key: 'home',
    route: '',
    defaults: {},
    component: HomePage,
    relayRoute: (data) => new EmptyRoute(data)
  },
  {
    key: 'tutorial',
    route: 'tutorial',
    defaults: {},
    component: TutorialPage,
    relayRoute: (data) => new EmptyRoute(data)
  },
  {
    key: 'users',
    route: 'users?{pageNumber?}',
    defaults: { pageNumber: 1 },
    component: UsersPage,
    relayRoute: (data) => new UsersPageRoute(data)
  },
  {
    key: 'ais',
    route: 'ais',
    defaults: { id: 0 },
    trackCrumbTrail: true,
    component: AIsPage,
    relayRoute: (data) => new AIsPageRoute(data)
  }
])
