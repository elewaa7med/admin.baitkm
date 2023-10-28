//? Service with basic helper functions

import * as moment from 'moment';
import * as fingerprint2 from 'fingerprintjs2';


//? Format date to show in view
export const formatDate = (date: string | number, withHours?: boolean): string => {
  if (!date) return 'N/A';
  
  const localDate = moment.utc(date).local().toDate();
  const onlyHours = localDate.getHours() < 10 ? `0${localDate.getHours()}` : localDate.getHours();
  const onlyMinutes = localDate.getMinutes() < 10 ? `0${localDate.getMinutes()}` : localDate.getMinutes();
  const hours = `${onlyHours}:${onlyMinutes}`;
  const months = [
    'Jan', 'Feb',
    'Mar', 'Apr', 'May',
    'Jun', 'Jul', 'Aug',
    'Sep', 'Oct', 'Nov',
    'Dec',
  ];

  return `${localDate.getDate() < 10 ? `0${localDate.getDate()}` : localDate.getDate()} ${months[localDate.getMonth()]} ${localDate.getFullYear()}${withHours ? ` | ${hours}` : ''}`;
};

//? Get range array from number
//* 5 - [1, 2, 3, 4, 5]
export const getRangeArray = (start: number, finish: number): number[] => {
  const numbers = [];
  for (let i = start; i <= finish; i++) numbers.push(i);

  return numbers;
};

//? Alphabetical sort algorith for arrays
export const alphabeticalSort = <SortArray>(array: SortArray[], key: string): SortArray[] => array.sort((a, b) => {
  const first = key ? a[key] : a;
  const second = key ? b[key] : b;
  if(first < second) { return -1; }
  if(first > second) { return 1; }

  return 0;
});

//? Validate only for upcoming date
export const onlyUpcomingDate = (momentDate: moment.Moment) => {
  const value = momentDate.toDate();
  const current = new Date();
  
  return (
    value.getDate() >= current.getDate() &&
    value.getMonth() >= current.getMonth() &&
    value.getFullYear() >= current.getFullYear()
  );
};

export const getDeviceId = (): Promise<string> => {
  return new Promise(async res => {

   await fingerprint2.get((components: any) => {
      const VALUES = components.filter((x: any) => x.key !== 'adBlock').map((item: any) => item.value);
      const DEVICE_ID = fingerprint2.x64hash128(VALUES.join(''), 31);
      res(DEVICE_ID);
    });

  });
}