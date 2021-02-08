import formatISO from 'date-fns/formatISO';
import { intervalToDuration } from 'date-fns';
import format from 'date-fns/format';

//receiving data example: 01-01-2021 08:05:25
//changes a string of date and time into an ISO string
export const formatDateTime = (dateTimeString) => {
  let month = Number(dateTimeString.slice(0, 2));
  const day = Number(dateTimeString.slice(3, 5));
  const year = Number(dateTimeString.slice(6, 10));
  const hour = Number(dateTimeString.slice(11, 13));
  const minute = Number(dateTimeString.slice(14, 16));
  const second =
    dateTimeString.length > 17 ? Number(dateTimeString.slice(17)) : 0;

  if (month > 0) month--;

  return formatISO(new Date(year, month, day, hour, minute, second));
};

//receiving data example: 2021-01-26T07:23:00
//changes a UTC date string into a formatted string
export const reverseFormatDateTime = (dateString) => {
  const newDate = new Date(dateString);
  const result = format(newDate, 'MM-dd-yyyy HH:mm');

  return result;
};

export const getDuration = (ClockedInStamp, clockedOutStamp) => {
  const duration = intervalToDuration({
    start: ClockedInStamp,
    end: clockedOutStamp,
  });
  let hours =
    duration.days > 0 ? duration.days * 24 + duration.hours : duration.hours;
  hours = hours > 9 ? hours : `0${hours}`;
  let minutes =
    duration.minutes > 9 ? duration.minutes : `0${duration.minutes}`;
  let seconds =
    duration.seconds > 9 ? duration.seconds : `0${duration.seconds}`;

  return `${hours}:${minutes}:${seconds}`;
};
