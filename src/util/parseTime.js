// https://gist.github.com/IbeVanmeenen/4e3e58820c9168806e57530563612886
// Epochs
const epochs = [
  ['year', 31536000],
  ['month', 2592000],
  ['day', 86400],
  ['hour', 3600],
  ['minute', 60],
  ['second', 1]
];

const delimitWithCommas = (arr) => {
  return arr.slice(0, -2).join(', ') + (arr.slice(0, -2).length ? ', ' : '') + arr.slice(-2).join(' and ');
}

// Calculate
const secondsToReadable = (time, friendly = true, shortened, display = 2) => {
  const fm = [
    Math.floor(time / 60 / 60 / 24 / 30 / 12), // YEARS
    Math.floor(time / 60 / 60 / 24 / 30) % 12, // MONTHS
    Math.floor(time / 60 / 60 / 24) % 30, // DAYS
    Math.floor(time / 60 / 60) % 24, // HOURS
    Math.floor(time / 60) % 60, // MINUTES
    Math.floor(time % 60) // SECONDS
  ];
  if (friendly) {
    const timeArr = [
      { type: { singular: 'year', plural: 'years' }, amount: fm[0] },
      { type: { singular: 'month', plural: 'months' }, amount: fm[1] },
      { type: { singular: 'day', plural: 'days' }, amount: fm[2] },
      { type: { singular: 'hour', plural: 'hours' }, amount: fm[3] },
      { type: { singular: 'minute', plural: 'minutes' }, amount: fm[4] },
      { type: { singular: 'second', plural: 'seconds' }, amount: fm[5] }
    ];
    const properArr = [];
    for (const i in timeArr) {
      if (timeArr[i].amount < 1) continue;
      properArr.push(`${timeArr[i].amount}${shortened ? '' : ' '}${(timeArr[i].amount === 1 ? timeArr[i].type.singular : timeArr[i].type.plural).slice(0, shortened ? (timeArr[i].type.singular === 'month' ? 2 : 1) : undefined)}`);
    }
    return delimitWithCommas(properArr.slice(0, display)) || (shortened ? '0s' : '0 seconds');
  }

  let checked = false;
  const formatted = fm.filter(i => { if (checked || i) { checked = true; return checked; } }).map(v => { return ((v < 10) ? '0' : '') + v; }).join(':');
  return formatted.includes(':') ? formatted : `00:${formatted || '00'}`;
};

const timeAgo = (date, ...options) => {
  const timeAgoInSeconds = Math.floor((Date.now() - new Date(date).valueOf()) / 1000);
  return secondsToReadable(timeAgoInSeconds, ...options);
};

const timeUntil = (date) => {
  const timeUntilInSeconds = Math.floor((new Date(date).valueOf() - Date.now()) / 1000);
  return secondsToReadable(timeUntilInSeconds);
};

export default {
  timeAgo,
  timeUntil,
  epochs
};
