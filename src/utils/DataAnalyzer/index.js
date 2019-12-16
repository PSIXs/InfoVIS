const generalMC2 = require("../../data/mc2/general-MC2.json");
const moment = require("moment");

for (let i = 0; i < generalMC2.length; i += 1) {
  generalMC2[i] = generalMC2[i].message;
  delete generalMC2[i].type;
}

const countByMonthMC2 = sensor => {
  const countMap = new Map();
  const stats = [];
  for (let i = 0; i < generalMC2.length; i += 1) {
    const element = generalMC2[i];
    const dateEntry = moment(element["Date/Time"]).format("YYYY-MM-DD");
    for (let obj in element) {
      if (obj === "Date/Time") continue;
      if (!countMap.has(obj)) {
        countMap.set(obj, new Map());
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
  const statEntry = {
    label: sensor,
    data: []
  };
  const dataMap = countMap.get(sensor);
  if (dataMap === undefined) return stats;
  for (let date of dataMap.keys()) {
    let average = 0.0;
    const records = dataMap.get(date);
    for (let value of records) {
      average += value;
    }
    average /= records.length;
    statEntry.data.push({
      x: moment(date),
      y: average
    });
  }
  stats.push(statEntry);
  console.log(stats);
  return stats;
};

const countByHourMC2 = (sensor, day) => {
  const countMap = new Map();
  const stats = [];
  for (let i = 0; i < generalMC2.length; i += 1) {
    const element = generalMC2[i];
    const fullDate = moment(element["Date/Time"]);
    const dateEntry = fullDate.format("YYYY-MM-DD");
    const hourEntry = fullDate.format("YYYY-MM-DD HH");
    for (let obj in element) {
      if (obj === "Date/Time") continue;
      if (!countMap.has(obj)) {
        countMap.set(obj, new Map());
      }
      const dataMap = countMap.get(obj);
      if (!dataMap.has(dateEntry)) {
        dataMap.set(dateEntry, new Map());
      }
      const hourMap = dataMap.get(dateEntry);
      if (!hourMap.has(hourEntry)) {
        hourMap.set(hourEntry, []);
      }
      hourMap.get(hourEntry).push(Number(element[obj]));
      dataMap.set(dateEntry, hourMap);
      countMap.set(obj, dataMap);
    }
  }
  const sensorMap = countMap.get(sensor);
  const statEntry = {
    label: day,
    data: []
  };
  if (sensorMap === undefined) return stats;
  const dataMap = sensorMap.get(day);
  if (dataMap === undefined) {
    for (let day of sensorMap.keys()) {
      const statEntry = {
        label: day,
        data: [],
        type: 'line',
      };
      const dataMap = sensorMap.get(day);
      for (let date of dataMap.keys()) {
        let average = 0.0;
        const records = dataMap.get(date);
        for (let value of records) {
          average += value;
        }
        average /= records.length;
        const hoursOnly = moment('2016-01-01', 'YYYY-DD-MM');
        console.log(moment(date).hours());
        hoursOnly.add(moment(date).hours(), 'hours');
        console.log(hoursOnly);
        statEntry.data.push({
          x: hoursOnly,
          y: average.toFixed(2)
        });
      }
      stats.push(statEntry);
    }
  } else {
    for (let date of dataMap.keys()) {
      let average = 0.0;
      const records = dataMap.get(date);
      for (let value of records) {
        average += value;
      }
      average /= records.length;
      statEntry.data.push({
        x: moment(date),
        y: average.toFixed(2)
      });
    }
    stats.push(statEntry);
  }
  console.log(stats);
  return stats;
};

module.exports.countByMonthMC2 = countByMonthMC2;
module.exports.countByHourMC2 = countByHourMC2;
