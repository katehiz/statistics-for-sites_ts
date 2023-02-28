const {writeFile, readFileSync, existsSync, statSync} = require("fs");

const {statsFilePath, sitesProps} = require('../config');

const {getNowDate, getAnalyticsData} = require('../helpers/GetAnalyticsData');
require('../helpers/Promise.allSettled');

// let errors = [];

module.exports = async function parseIndexMetrics () {
	const nowDate = getNowDate();
	let cumulativeData = [],
		responseData,
		responsesPull = [];

	// Если файл существует и в нём что то есть,
	// фильтруем записи не старше 1го месяца
	// сохраняем это в переменную-накопитель
	if (existsSync(statsFilePath) && statSync(statsFilePath).size !== 0) {
		let file = readFileSync(statsFilePath, 'utf8');
		let dateMonthAgo = nowDate - (1000 * 3600 * 24 * 30);
		let data = JSON.parse(file).filter(item => item.date > dateMonthAgo);
		cumulativeData = data;
	}

	for (const site of sitesProps) {
		for (let strategy of ['mobile', 'desktop'] ) {
			responsesPull.push(
				getAnalyticsData(site.url, strategy).then(metrics => {
					return {
						date: nowDate,
						siteName: site.name,
						pageType: 'index',
						strategy: strategy,
						metrics: metrics
					}
				})
			)
		}
	}
	
	// Выполнение всех асинхронных запросов как промисов
	responseData = await Promise.allSettled(responsesPull)
		.then(responses => {
			return responses
				.filter(response => response.status === 'fulfilled' && response.value !== null)
				.map(el => el.value)
		})

	cumulativeData.push(...responseData);

	writeFile (
		statsFilePath,
		JSON.stringify(cumulativeData),
		'utf8',
		err => {if (err) throw err}
	);

	return responseData
}