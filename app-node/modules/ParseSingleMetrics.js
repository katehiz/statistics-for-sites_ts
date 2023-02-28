const {writeFile, readFileSync, existsSync, statSync} = require("fs");

const {statsFilePath, sitesProps} = require('../config');
const getLastPostLink = require('./GetLastFeedPost');

const {getNowDate, getAnalyticsData} = require('../helpers/GetAnalyticsData');
require('../helpers/Promise.allSettled');

module.exports = async function parseSingleMetrics () {
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

	// Получаем из RSS ленты ссылки на последние посты для всех сайтов
	let postLinksFetchesPull = [];
	// готовим массив асинхронных запросов
	for (const site of sitesProps) {
		postLinksFetchesPull.push( getLastPostLink(site.url) )
	}
	// получаем массив ссылок
	let postsLinksArr = await Promise.allSettled(postLinksFetchesPull)
		.then(responses => {
			return responses.map(response => {
				if (response.status === 'fulfilled' && response.value !== '')
					return response.value
			})
		})
	
	// Готовим общий массив с ссылками для парсинга метрик.
	const generalSitesArr = postsLinksArr.map(link => ({ name: new URL(link).host, url: link }))

	// Подготовка очереди асинхронных вызовов для страниц типа INDEX
	for (const site of generalSitesArr) {
		for (let strategy of ['mobile', 'desktop'] ) {
			responsesPull.push(
				getAnalyticsData(site.url, strategy).then(metrics => {
					if (!metrics) return null;
					return {
						date: nowDate,
						siteName: site.name,
						pageType: 'single',
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