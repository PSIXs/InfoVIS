const generalMC2 = require('../../data/mc2/general-MC2.json');
const moment = require('moment');

for (let i = 0; i < generalMC2.length; i += 1) {
  generalMC2[i] = generalMC2[i].message;
};

const countByMonthMC2 = (filters) => {
  const countMap = new Map();
  const stats = [];
  for (let i = 0; i < generalMC2.length; i += 1) {
    const element = generalMC2[i];
    const dateEntry = moment(element['Date/Time']).format('YYYY-MM-DD');
    for (let obj in element) {
      if (obj === 'Date/Time' || obj === 'type') continue;
      if (!countMap.has(obj)) {
        countMap.set(obj, new Map);
      }
      const dataMap = countMap.get(obj);
      if (dataMap.has(dateEntry)) {
        dataMap.get(dateEntry).push(Number(element[obj]));
      } else {
        dataMap.set(dateEntry, [Number(element[obj])]);
      }
      countMap.set(obj, dataMap);
    }
  }
  for (let key of countMap.keys()) {
    const statEntry = {
      label: key,
      data: [],
    };
    const dataMap = countMap.get(key);
    for (let date of dataMap.keys()) {
      let average = 0.0;
      const records = dataMap.get(date);
      for (let value of records) {
        average += value;
      }
      average /= records.length;
      statEntry.data.push({
        x: moment(date),
        y: average,
      })
    }
    stats.push(statEntry);
  }
  console.log(stats);
  return stats;
}

module.exports.countByMonthMC2 = countByMonthMC2;