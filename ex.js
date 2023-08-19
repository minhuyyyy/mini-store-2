const now = new Date();
// const day = today.substring(0, 16);
const datetime = now.getTime();
const time = now.toLocaleTimeString();
console.log("Date:", datetime);
console.log("Time:", time);
