const userInput = '05:20';
const hours = userInput.slice(0, 2);
const minutes = userInput.slice(3);

const date = new Date();
date.setHours(hours, minutes);
console.log(hours, minutes)