//? Service for application default configuration

import alertify from 'alertifyjs';

import Hotkeys    from './hotkeys';
import Prototypes from './prototypes';

export default {
  init: () => {
    Hotkeys.init();
    Prototypes.init();

    window.addEventListener('offline', () => {
      alertify.error('Connection lost. Admin panel can break his correct work!!');
    });

    window.addEventListener('online', () => {
      alertify.error('Connection is ok');
    });
  }
}