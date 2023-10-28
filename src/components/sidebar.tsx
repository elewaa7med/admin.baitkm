import * as React from 'react';
import { NavLink, Link } from 'react-router-dom';

// import RouteService from '../platform/services/routes';
import ROUTES from '../platform/constants/routes';
import logo from '../assets/images/ic_logoarab.png'
import RouteService from "../platform/services/routes";

import LogOutModal from "./log-out-modal";


interface IState {
    aciteClassForDropDown: boolean,
    activeClassNameDD: string,
    mobile_menu: boolean;
    openSubMenu: boolean;
    activeAnnouncement:boolean;
    isOpenModal:boolean;
};

class Sidebar extends React.Component<{}, IState> {

    public state: IState = {
        aciteClassForDropDown: false,
        activeClassNameDD: 'B-sidebar-navigator-active-none',
        mobile_menu: false,
        openSubMenu: false,
        activeAnnouncement:false,
      isOpenModal:false
    };

  private openLogOutModal = () => this.setState({ isOpenModal: true });
  private closeLogOutModal = () => this.setState({ isOpenModal: false });
    public async componentDidMount() {
        if (RouteService.isRoute(ROUTES.ANNOUNCEMENTS) ||
            RouteService.isRoute(ROUTES.ANNOUNCEMENTS_PENDING) ||
            RouteService.isRoute(ROUTES.ANNOUNCEMENTS_IN_REVIEW) ||
            RouteService.isRoute(ROUTES.ANNOUNCEMENTS_FEATURED) ||
            RouteService.isRoute(ROUTES.ANNOUNCEMENTS_EXPIRED) ||
            RouteService.isRoute(ROUTES.ANNOUNCEMENTS_REJECTED)) {
            this.setState({activeAnnouncement:true  })
        }else{
            this.setState({activeAnnouncement:false  })
        }

        window.routerHistory.listen(this.routerHandler);
    }
    private routerHandler =  () =>{
        if (RouteService.isRoute(ROUTES.ANNOUNCEMENTS) ||
            RouteService.isRoute(ROUTES.ANNOUNCEMENTS_PENDING) ||
            RouteService.isRoute(ROUTES.ANNOUNCEMENTS_IN_REVIEW) ||
            RouteService.isRoute(ROUTES.ANNOUNCEMENTS_FEATURED) ||
            RouteService.isRoute(ROUTES.ANNOUNCEMENTS_EXPIRED) ||
            RouteService.isRoute(ROUTES.ANNOUNCEMENTS_REJECTED) ) {
            this.setState({activeAnnouncement:true  })
        }else{
            this.setState({activeAnnouncement:false  })
        }
    }
    private toggleOpenFilter = () => {
        this.setState({
            openSubMenu: !this.state.openSubMenu
        });
    };

    public render() {

        return (

            <aside className="B-sidebar">
                <div className="B-sidebar-content">
                    <div className="B-sidebar-header">
                      <Link to={ROUTES.DASHBOARD}>
                        <img className="header-logo" src={logo} alt="logo" />
                      </Link>
                    </div>
                    <div className='B-sidebar-navigator'>
                        <ul>
                            <li>
                                <NavLink activeClassName='B-sidebar-navigator-active' to={ROUTES.DASHBOARD} onClick={() => { this.state.openSubMenu = false }}>
                                    <i className='icon-help' />
                                    <span>Dashboard</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink activeClassName='B-sidebar-navigator-active' to={ROUTES.USERS} onClick={() => { this.state.openSubMenu = false }}>
                                    <i className='icon-plus02' />
                                    <span >Users</span>
                                </NavLink>
                            </li>
                            <li className='B-hover-for-menu'>
                                <div className={`sidebar-menu ${this.state.activeAnnouncement? 'B-sidebar-navigator-active' : ''}`} onClick={this.toggleOpenFilter}>
                                    <i className='icon-arrow_back' />
                                    <span>Announcements</span>
                                </div>
                                {<div className={`B-sub-navigator  ${window.innerWidth > 1300 ? this.state.openSubMenu ? 'anim-show' : '' : ''}   `}>
                                    <ul>
                                        <li>
                                            <NavLink activeClassName='B-sidebar-navigator-active' to={ROUTES.ANNOUNCEMENTS}>Approved announcements</NavLink>
                                        </li>
                                        {/*<li>*/}
                                        {/*    <NavLink activeClassName='B-sidebar-navigator-active' to={ROUTES.ANNOUNCEMENTS_PENDING}>Pending announcements</NavLink>*/}
                                        {/*</li>*/}
                                        {/*<li>*/}
                                        {/*    <NavLink activeClassName='B-sidebar-navigator-active' to={ROUTES.ANNOUNCEMENTS_IN_REVIEW}>In review announcements</NavLink>*/}
                                        {/*</li>*/}
                                        <li>
                                            <NavLink activeClassName='B-sidebar-navigator-active' to={ROUTES.ANNOUNCEMENTS_FEATURED}>Featured announcements</NavLink>
                                        </li>
                                        <li>
                                            <NavLink activeClassName='B-sidebar-navigator-active' to={ROUTES.ANNOUNCEMENTS_REJECTED}>Rejected announcements</NavLink>
                                        </li>
                                        <li>
                                            <NavLink activeClassName='B-sidebar-navigator-active' to={ROUTES.ANNOUNCEMENTS_EXPIRED}>Expired announcements</NavLink>
                                        </li>
                                    </ul>
                                </div>}

                            </li>

                            <li>
                                <NavLink activeClassName='B-sidebar-navigator-active' to={ROUTES.SUPPORTS} onClick={() => { this.state.openSubMenu = false }}>
                                    <i className='icon-plus01' />

                                    <span>Support</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink activeClassName='B-sidebar-navigator-active' to={ROUTES.SETTINGS} onClick={() => { this.state.openSubMenu = false }}>
                                    <i className='icon-ic_settings' />

                                    <span>Settings</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink activeClassName='B-sidebar-navigator-active' to={ROUTES.PUSH_NOTIFICATIONS} onClick={() => { this.state.openSubMenu = false }}>
                                    <i className='icon-menu_hidden' />
                                    <span>Push notifications</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink activeClassName='B-sidebar-navigator-active' to={ROUTES.REPORTS} onClick={() => { this.state.openSubMenu = false }}>
                                    <i className='icon-menu_show' />

                                    <span>Reports</span>
                                </NavLink>
                            </li>
                            <li onClick={this.openLogOutModal}>
                                  <h3>
                                    <i className='icon-play01_1' />
                                    <span>Log out </span>
                                  </h3>


                            </li>
                        </ul>
                    </div>
                </div>
              {this.state.isOpenModal && <LogOutModal onClose={this.closeLogOutModal}  />}
            </aside>
        );
    }
}

export default Sidebar;
