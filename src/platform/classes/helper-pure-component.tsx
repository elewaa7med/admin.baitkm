//? Base class to add some helper properties and methods to React.PureComponent

import * as React from 'react';

class HelperPureComponent<Props, State> extends React.PureComponent<Props, State> {

    protected mounted = true;

    public componentWillUnmount() { this.mounted = false; }

    public safeSetState(object: object | ((prev: State) => State), callback?: () => void) {
        this.mounted && this.setState(object, callback);
    }
}

export default HelperPureComponent;