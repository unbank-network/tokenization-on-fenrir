import moment from 'moment';

export const FORMAT_STRING = 'lll';

export const formatTimeInSeconds = (sec: $TSFixMe) => {
  if (!sec) {
    return '-';
  }
  return `${moment(sec * 1000).format(FORMAT_STRING)}`;
};

export const getRemainingTime = (item: $TSFixMe) => {
  if (item.state === 'Active') {
    const diffBlock = item.endBlock - item.blockNumber;
    const duration = moment.duration(diffBlock < 0 ? 0 : diffBlock * 3, 'seconds');
    const days = Math.floor(duration.asDays());
    const hours = Math.floor(duration.asHours()) - days * 24;
    const minutes = Math.floor(duration.asMinutes()) - days * 24 * 60 - hours * 60;

    return `${days > 0 ? `${days} ${days > 1 ? 'days' : 'day'},` : ''} ${hours} ${
      hours > 1 ? 'hrs' : 'hr'
    } ${days === 0 ? `, ${minutes} ${minutes > 1 ? 'minutes' : 'minute'}` : ''} left`;
  }
  if (item.state === 'Pending') {
    return formatTimeInSeconds(item.createdTimestamp);
  }
  if (item.state === 'Active') {
    return formatTimeInSeconds(item.startTimestamp);
  }
  if (item.state === 'Canceled' || item.state === 'Defeated') {
    return formatTimeInSeconds(item.endTimestamp);
  }
  if (item.state === 'Queued') {
    return formatTimeInSeconds(item.queuedTimestamp);
  }
  if (item.state === 'Expired' || item.state === 'Executed') {
    return formatTimeInSeconds(item.executedTimestamp);
  }
  return `${moment(item.updatedAt).format(FORMAT_STRING)}`;
};

export const secondsToDhms = (seconds: $TSFixMe) => {
  seconds = Number(seconds);
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const dDisplay = d > 0 ? d + (d === 1 ? ' day, ' : ' days, ') : '';
  const hDisplay = h > 0 ? h + (h === 1 ? ' hour, ' : ' hours, ') : '';
  const mDisplay = m > 0 ? m + (m === 1 ? ' minute ' : ' minutes, ') : '';
  const sDisplay = s > 0 ? s + (s === 1 ? ' second' : ' seconds') : '';
  return `${dDisplay} ${hDisplay} ${mDisplay} ${sDisplay}`;
};
