const fetch = require('node-fetch');
const {googleApiKey} = require('../config');

/**
 * Calculate floor date to current hourse
 * @returns {Number} JS timestamp (milliseconds)
 */
 function getNowDate() {
	const date = new Date();
	date.setMilliseconds(0);
	date.setSeconds(0);
	date.setMinutes(0);
	return +date
}

function prepairQuery(link, strategy = 'desktop') {
	if (!link) return '';
	const api = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed`;
	const parameters = {
		key: googleApiKey,
		strategy: strategy
	};
	let query = `${api}?url=${encodeURIComponent(link)}`;
	for (key in parameters) {
		query += `&${key}=${parameters[key]}`;
	}
	return query;
}

/**
 * 
 * @param {String} siteLink 
 * @param {String} strategy 
 * @returns {Object} - data of site metrics (mobile or desktop strategy)
 */
async function getAnalyticsData(siteLink, strategy) {
	if (!siteLink) return null;

	// сбор метрик googlePageSpeed
	let jsonData;
	const response = await fetch( prepairQuery(siteLink, strategy) );
	console.log(`${response.status} : ${strategy} : ${siteLink}`);
	if (response.status === 200) {
		jsonData = await response.json()
	} else {
		throw new Error('не удалось получить данные от API сервера. Статус: ' + response.status);
	}
	
	const lighthouse = jsonData.lighthouseResult;

	return {
		'FirstContentfulPaint': lighthouse.audits['first-contentful-paint'].numericValue,
        'SpeedIndex': lighthouse.audits['speed-index'].numericValue,
        'TimeToInteractive': lighthouse.audits['interactive'].numericValue,
		'LargestContentfulPaint': lighthouse.audits["largest-contentful-paint"].numericValue,
		'TotalBlockingTime': lighthouse.audits["total-blocking-time"].numericValue,
		'CumulativeLayoutShift': lighthouse.audits["cumulative-layout-shift"].numericValue,
        'Performance': lighthouse.categories.performance["score"],
		'CurrentDate': jsonData.analysisUTCTimestamp
	}
};

module.exports = {
    getNowDate,
    prepairQuery,
    getAnalyticsData,
}