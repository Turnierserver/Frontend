import Relay from 'react-relay'
import { StateNavigator } from 'navigation'
import { HomePage } from './pages/Home.js'
import { TutorialPage } from './pages/Tutorial.js'
import { UsersPageRoute, UsersPage } from './pages/Users.js'
import { UserPageRoute, UserPage } from './pages/User.js'
import { AisPageRoute, AisPage } from './pages/Ais.js'
import { GamesPageRoute, GamesPage } from './pages/Games.js'
import { LoginPageRoute, LoginPage } from './pages/Login.js'

export class EmptyRoute extends Relay.Route {
  static routeName = 'EmptyRoute'
  static queries = {
    userStore: (Component) => Relay.QL`
      query {
        userStore { ${Component.getFragment('userStore')} }
      }
    `
  }
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
    key: 'login',
    route: 'login',
    defaults: {},
    component: LoginPage,
    relayRoute: (data) => new LoginPageRoute(data)
  },
  {
    key: 'users',
    route: 'users?{pageNumber?}',
    defaults: { pageNumber: 1 },
    component: UsersPage,
    relayRoute: (data) => new UsersPageRoute(data)
  },
  {
    key: 'user',
    route: 'user/{userID}',
    component: UserPage,
    relayRoute: (data) => new UserPageRoute(data)
  },
  {
    key: 'ais',
    route: 'ais',
    trackCrumbTrail: true,
    component: AisPage,
    relayRoute: (data) => new AisPageRoute(data)
  },
  {
    key: 'games',
    route: 'games',
    defaults: { id: 0 },
    trackCrumbTrail: true,
    component: GamesPage,
    relayRoute: (data) => new GamesPageRoute(data)
  }
])
