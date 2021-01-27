import formatISO from 'date-fns/formatISO';
import { intervalToDuration } from 'date-fns';

//01-01-2021 08:05:25
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

//2021-01-26T07:23:00
export const reverseFormatDateTime = (dateString) => {
  const year = dateString.slice(0, 4);
  let month = dateString.slice(5, 7);
  const day = dateString.slice(8, 10);
  const hour = dateString.slice(11, 13);
  const minute = dateString.slice(14, 16);

  const timeString = hour + ':' + minute;

  const result = `${month}-${day}-${year} ${timeString}`;

  return result;
};

export const getDuration = (ClockedInStamp, clockedOutStamp) => {
  const duration = intervalToDuration({
    start: ClockedInStamp,
    end: clockedOutStamp,
  });
  let days = duration.days > 9 ? duration.days : `${duration.days}`;
  let hours = duration.hours > 9 ? duration.hours : `0${duration.hours}`;
  let minutes =
    duration.minutes > 9 ? duration.minutes : `0${duration.minutes}`;
  let seconds =
    duration.seconds > 9 ? duration.seconds : `0${duration.seconds}`;

  return `${days > 0 ? `${days}d ` : ''}${hours}:${minutes}:${seconds}`;
};
