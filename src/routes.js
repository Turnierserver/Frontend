import { StateNavigator } from 'navigation'
import { HomePage, HomePageRoute } from './pages/Home.js'
import { UsersPageRoute, UsersPage } from './pages/Users.js'
import { AIsPageRoute, AIsPage } from './pages/AIs.js'

export const stateNavigator = new StateNavigator([
  {
    key: 'home',
    route: '',
    defaults: {},
    component: HomePage,
    relayRoute: (data) => new HomePageRoute(data)
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
