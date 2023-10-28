//* Please write a clean code
////! Documentize your code with comments
////! Use React Components as far as you can

//* Please define the types
////! Application use typescript so don't forget to define the types
////! Use types like `any` as less as you can

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {  createHashHistory } from 'history';
import { Router, Switch, Redirect, Route } from 'react-router-dom';
import { defaults } from 'chart.js';
import alertify from 'alertifyjs';

import Seed from './platform/services/seed';
import Modals from './platform/dispatchers/modals';
// import Socket from './platform/services/socket';
// import Header                          from './components/header';
import Sidebar from './components/sidebar';
import Settings from './platform/services/settings';
import ConfirmModal from './components/confirm-modal';
import RouteService from './platform/services/routes';
import registerServiceWorker from './registerServiceWorker';
import { ConfirmModalConfirmCallback } from './platform/constants/types';

import './assets/styles/index.scss';
import './modules';
import { getDeviceId } from './platform/services/helper';
// import scrollIntoView from 'scroll-into-view';


defaults.global.legend = defaults.global.legend || {};
defaults.global.legend.display = false;
alertify.set('notifier', 'position', 'bottom-center');
window.routerHistory = createHashHistory();
window.routerHistory.listen(() => window.scrollTo(0, 0));
Seed.init();

interface IState {
  ConfirmModalCallback?: ConfirmModalConfirmCallback;
};

class App extends React.Component<{}, IState> {

  private mainPage = React.createRef<HTMLDivElement>();
  public state: IState = {
    ConfirmModalCallback: undefined,
  };

  public async componentDidMount() {
    Settings.guestId = await getDeviceId();
    Modals.onConfirmModalChange(ConfirmModalCallback => this.setState({ ConfirmModalCallback }));
    window.addEventListener('scrollTop', this.scrollTop)
  }

  private scrollTop = ()=>{
    const  scrollIntoView = require('scroll-into-view')
    setTimeout(()=>{
      const invalidFields = document.getElementsByClassName('error-input');
      if (invalidFields.length) scrollIntoView(invalidFields[0]);
    },0)
  }
  public render() {
    const { ConfirmModalCallback } = this.state;

    return (
      <Router history={window.routerHistory}>
        <div id='B-content' className={window.innerWidth < 1300 ? 'B-sidebar-mobile' : ''}>
          {!!Settings.token && <Sidebar />}
          <div id="B-main-wrapper" className={!!!Settings.token ? 'B-main-wrapper-logouted' : ''}>
            <div id="B-page-wrapper" ref={this.mainPage}>
              <Switch>
                {!!Settings.token ? RouteService.subscribeAuthorized(routes => routes.map(item => <Route
                  exact={true}
                  key={item.path}
                  path={item.path}
                  component={item.component}
                />)) : RouteService.subscribeUnauthorized(routes => routes.map(item => <Route
                  exact={true}
                  key={item.path}
                  path={item.path}
                  component={item.component}
                />))}
                <Redirect to={RouteService.defaultRoute} />
              </Switch>
            </div>
          </div>
          {!!ConfirmModalCallback && <ConfirmModal callback={ConfirmModalCallback} />}
        </div>
      </Router>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root') as HTMLElement);
registerServiceWorker();
