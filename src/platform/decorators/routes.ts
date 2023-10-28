//? Route dynamic configuration tools

import * as React from 'react';

import RouteService    from '../services/routes';
import { IBreadcrumb } from '../constants/interfaces';

//? This helps to add new route to application routing system
export function byRoute(route: string | string[]) {
  return <Component extends React.ComponentClass>(component: Component): Component => {
    return RouteService.addRoute<Component>(
      route,
      component,
      false,
    );
  }
};

//? This helps to add new route to application routing system (Private, only for Authorized users)
export function byPrivateRoute(route: string | string[]) {
  return <Component extends React.ComponentClass>(component: Component): Component => {
    return RouteService.addRoute<Component>(
      route,
      component,
      true,
    );
  }
};

//? This helps to add new label in Sidebar
//! Every label in sidebar will have his module
//! To change the possition of label in sidebar you will change the module import possition on /src/modules/index.ts
export function bySidebar(name: string, icon: string, customPath?: string) {
  return <Component extends React.ComponentClass>(component: Component): Component => {
    if (customPath) {
      RouteService.addSidebarRow(
        name,
        icon,
        customPath,
      );
    } else {
      const route = RouteService.routes.find(item => item.component === component);
      route && RouteService.addSidebarRow(
        name,
        icon,
        route.path,
      );  
    }

    return component;
  }
}


//? This helps to add breadcrumbs configuration for the route
//? Will be used with @byRoute or @byPrivateRoute
export function byBreadcrumbs(breadcrumbs: IBreadcrumb[], customPath?: string) {
  return <Component extends React.ComponentClass>(component: Component): Component => {
    if (customPath) {
      setTimeout(() => {
        if (RouteService.isRoute(customPath))
          RouteService.setBreadcrumbs(breadcrumbs);
  
        window.routerHistory.listen(() => {
          if (RouteService.isRoute(customPath))
            RouteService.setBreadcrumbs(breadcrumbs);
        });
      }, 0); 
    } else {
      const routes = RouteService.routes.filter(item => item.component === component);
      setTimeout(() => {
        if (routes.length && routes.find(item => RouteService.isRoute(item.path)))
          RouteService.setBreadcrumbs(breadcrumbs);
  
        window.routerHistory.listen(() => {
          if (routes.length && routes.find(item => RouteService.isRoute(item.path)))
            RouteService.setBreadcrumbs(breadcrumbs);
        });
      }, 0);  
    }
    
    return component;
  }
}