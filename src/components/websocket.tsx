import * as React from 'react';
import Websocket from 'react-websocket';
import Config from 'Config';

import HelperComponent from '../platform/classes/helper-component';
import Connection from '../platform/services/connection';
import Settings from 'src/platform/services/settings';

interface IProps {
  onClose?: (e: any) => void;
  onOpen?: (e: any) => void;
  onMessage: (data: any) => void;
  hub: string;
  data: object;
}

class Socket extends HelperComponent<IProps, {}> {

  private handleData = (data: any) => {
    if (data) {
      try {
        const result = JSON.parse(data);
        this.props.onMessage(result);
      } catch (e) {
        console.log(e);
      }
    }
  }

  private onOpen = (e: any) => {
    if (this.props.onOpen) {
      this.props.onOpen(e);
    }
  }
  
  private onClose = (e: any) => {
    if (this.props.onClose) {
      this.props.onClose(e);
    }
  }

  public render() {
    return (
      <Websocket url={`${Config.SOCKET_URL}${this.props.hub}/?${Connection.queryFromObject(this.props.data)}${Settings.token ? `&access_token=${Settings.token}` : ''}`}
              onMessage={this.handleData} onOpen={this.onOpen} onClose={this.onClose} reconnectIntervalInMilliSeconds={2000} />
    )
  }
}

export default Socket;