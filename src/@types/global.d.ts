import { History } from 'history';

declare global {
  interface Window {
    routerHistory: History;
  }

  interface Date {
    toTimezoneISOString(): string;
  }
}