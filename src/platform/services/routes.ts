//? Route Helper Service
//? The routing system has one more layer, please first read comments on /src/platform/decorators/routes.ts

import { matchPath } from 'react-router-dom';

import ROUTES                            from '../constants/routes';
import Settings                          from './settings';
import { IRoute, ISidebar, IBreadcrumb } from '../constants/interfaces';

type RouteCallback = (routes: IRoute[]) => void;
type BreadcrumbsCallback = (breadcrums: IBreadcrumb[]) => void;

class RouteService {

  public static routes: IRoute[] = [];
  public static sidebar: ISidebar[] = [];
  public static breadcrumbs: IBreadcrumb[] = [];
  public static subscribeUnauthorizedCallbacks: RouteCallback[] = [];
  public static subscribeAuthorizedCallbacks: RouteCallback[] = [];
  public static subscribeBreadcrumbsCallbacks: BreadcrumbsCallback[] = [];

  //? Get application default route
  public static get defaultRoute(): string {
    return !!Settings.token ? ROUTES.DASHBOARD : ROUTES.SIGNIN;
  }

  //? Check route
  public static isRoute = (route: string): boolean => !!matchPath(window.location.hash.replace("#",""), { path: route, exact: true });

  //? Add route to routing system
  //! Will be called only by using the @byRouter or @byPrivateRouter decorator
  public static addRoute<Component extends React.ComponentClass>(
    path: string | string[],
    component: Component,
    isPrivate: boolean,
  ): Component {
    Array.isArray(path) ? path.map((item: string) => RouteService.routes.push({
      path: item,
      component,
      isPrivate,
    })) : RouteService.routes.push({
      path,
      component,
      isPrivate,
    });

    RouteService
      .subscribeUnauthorizedCallbacks
        .map((item) => item(
          RouteService.routes.filter((sub: IRoute) => !sub.isPrivate)
        ));

    RouteService
      .subscribeAuthorizedCallbacks
        .map(item => item(RouteService.routes.filter(sub => sub.isPrivate)));

    return component;
  }

  //? Add label to sidebar
  //! Will be called only by using the @bySidebar decorator
  public static addSidebarRow(
    name: string,
    icon: string,
    path: string,
  ): string {

    RouteService.sidebar.push({
      name,
      icon,
      path,
    });

    return path;
  }

  //? Set breadcrumbs configuration for the route
  //! Will be called only by using the @byBreadcrumbs decorator
  public static setBreadcrumbs(breadcrumbs: IBreadcrumb[]) {
    RouteService.breadcrumbs = breadcrumbs;
    RouteService
      .subscribeBreadcrumbsCallbacks
        .map(item => item(breadcrumbs));
  }

  //? To subscribe to authorized routes changes
  public static subscribeAuthorized(callback: RouteCallback) {
    const routes: IRoute[] = RouteService.routes.filter((item: IRoute) => item.isPrivate);
    RouteService
      .subscribeAuthorizedCallbacks
        .push(callback);

    return callback(routes);
  }

  //? To subscribe to unauthorized routes changes
  public static subscribeUnauthorized(callback: RouteCallback) {
    RouteService
      .subscribeUnauthorizedCallbacks
        .push(callback);

    return callback(RouteService.routes.filter(item => !item.isPrivate));
  }

  //? To subscribe to breadcrumbs changes
  public static subscribeBreadcrumbs(callback: BreadcrumbsCallback) {
    RouteService
      .subscribeBreadcrumbsCallbacks
        .push(callback);

    return callback(RouteService.breadcrumbs);
  }
}

export default RouteService;