//? Service to implement keyboard shortcuts functionality

import * as key from 'keymaster';

import Settings from './settings';
import RouteService from './routes';

export default {
  init: () => {
    key('shift+o', () => Settings.sidebarState = !Settings.sidebarState);

    RouteService.sidebar.map((item, index) => {
      key(`shift+${index + 1}`, () => window.routerHistory.push(item.path));
    });
  }
};