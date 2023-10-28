//? Base class to add some helper properties and methods to React Component

import * as React from 'react';

class HelperComponent<Props, State> extends React.Component<Props, State> {

  protected mounted: boolean = true;

  public componentWillUnmount() { this.mounted = false; }

  public async asyncSetState(object: object) {
    return new Promise(res => {
      if (this.mounted) {
        this.setState(object, res)
      } else {
        res();
      }
    })
  }
}

export default HelperComponent;
