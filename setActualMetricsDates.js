const path = require('path');

const {writeFile, readFileSync} = require("fs");
const statsFilePath = path.resolve('public', 'stats.json');
const targetPath = path.resolve('dist', 'stats.json');

let file = readFileSync(statsFilePath, 'utf8');
let data = JSON.parse(file);
console.log(data[0].date);

function getDiffDate(old) {
	const date1 = new Date(old);
	const date2 = new Date();

	date2.setMilliseconds(0);
	date2.setSeconds(0);
	date2.setMinutes(0);
	date2.setHours(0);

	return (date2.getTime() - date1.getTime())
}

const dateDiff = getDiffDate(data[data.length - 1].date);

for (let item of data) {
	item.date = item.date + dateDiff 
}

console.log(data[0].date);

writeFile (
	targetPath,
	JSON.stringify(data),
	'utf8',
	err => {if (err) throw err}
);
