const now = new Date();
const gmtOffset = 7; // GMT+7
const date = now.toISOString().substring(0, 10)
// time.setUTCHours(time.getUTCHours() + gmtOffset);
const time = now.toISOString().substring(11, 21)
console.log("Time in GMT+7:", date);
console.log("Time in GMT+7:", time);
