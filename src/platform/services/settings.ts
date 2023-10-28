//? Service to save some settings

type SettingsCallback = () => void;

class Settings {

  public static token: string | null = window.localStorage.getItem('token');
  public static convId: string | null = window.localStorage.getItem('convId');
  private static changeCallbacks: SettingsCallback[] = [];
    public static googleAPIKey = 'AIzaSyAhZCcA9UGg8wJD28mWT7xNvl4-sEe4Xh4';

  public static get sidebarState(): boolean { return window.localStorage.getItem('sidebar') !== 'false'; }
  public static set sidebarState(value: boolean) {
    window.localStorage.setItem('sidebar', value.toString());
    Settings.changeCallbacks.map(item => item());
  }

  //? To subscribe to settings change
  public static subscribe = (callback: SettingsCallback) => {
    callback();
    Settings.changeCallbacks.push(callback);
  };

  //? To logout
  public static logout = () => {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('convId');
    window.location.reload();
  }

  public static get guestId() {
    const id = window.localStorage.getItem('guestId');
    return id || null;
  }

  public static set guestId(value: string | null) {
    if (value) {
      window.localStorage.setItem('guestId', value);
    } else {
      window.localStorage.removeItem('guestId');
    }
  }
}

export default Settings;