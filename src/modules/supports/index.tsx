import * as React from 'react';
import { withRouter } from 'react-router-dom';
import ROUTES from "../../platform/constants/routes";
import { byPrivateRoute } from "../../platform/decorators/routes";

import generic from 'src/platform/decorators/generic';

import HelperComponent from 'src/platform/classes/helper-component';
import ConversationsList from './components/coversation-list';
import Conversation from './components/conversation';

interface IState {
  activeConversationId: number;
  supportCount: number;
  disableSocket: boolean,
  flag: boolean,
};

@generic<any>(withRouter)

@byPrivateRoute(ROUTES.SUPPORTS)
class Supports extends HelperComponent<{}, IState> {

  public state: IState = {
    activeConversationId: 0,
    supportCount: 0,
    disableSocket: false,
    flag: false,
  }

  private changeSupportCount = (count: number) => {
    this.setState({ supportCount: count });
  }

  private changeActiveUser = async (id: number) => {
    await this.asyncSetState({ activeConversationId: id, disableSocket: true })
    this.setState({ disableSocket: false });
  }

  private updateItem = () => {
    this.setState({ flag: !this.state.flag });
  }

  public render() {
    return (
      <div className='B-announcement'>
        <div className='B-announcement-header'>
          <div className='B-announcement-main'>
            <div className="B-announcement-title">
              <h3>Support</h3>
              <div className='total-count'>
                <p>{this.state.supportCount}</p>
                <span>supports</span>
              </div>
            </div>
          </div>
        </div>

        <div className='B-support-container'>
          <div className="B-support-block">
            <ConversationsList flag={this.state.flag} changeCount={this.changeSupportCount} changeActiveUser={this.changeActiveUser} />

            <Conversation updateItem={this.updateItem} activeConversationId={this.state.activeConversationId} disableSocket={this.state.disableSocket} />
          </div>
        </div>
      </div>
    )
  }
}

export default Supports;


