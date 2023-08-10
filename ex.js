const baseUnit = "bình";
const baseStock = 310;
const basePrice = 30000;
const exchange = 24;
const extendUnit = "thùng";
const extendPrice = 28000;
const extendStock = 6;
const divStock = Math.round((baseStock / exchange)*10)/10;
console.log("thùng: ", divStock);
