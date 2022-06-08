const path = require('path');

const statsFilePath = path.resolve('dist', 'stats.json');
const pipelinesFilePath = path.resolve('dist', 'pipelines.json');
const sitesProps = [
	{
	  name: 'riafan.ru',
	  url: 'https://riafan.ru',
	  repoId: '258'
	},
	{
		name: 'nation-news.ru',
		url: 'https://nation-news.ru',
		repoId: '279'
	},
	{
		name: 'inforeactor.ru',
		url: 'https://inforeactor.ru',
		repoId: '281'
	},
	{
		name: 'polit.info',
		url: 'https://polit.info',
		repoId: '282'
	},
	{
		name: 'politros.com',
		url: 'https://politros.com',
		repoId: '287'
	},
	{
		name: 'slovodel.com',
		url: 'https://slovodel.com',
		repoId: '290'
	},
	{
		name: 'rueconomics.ru',
		url: 'https://rueconomics.ru',
		repoId: '291'
	},
	{
		name: 'nevnov.ru',
		url: 'https://nevnov.ru',
		repoId: '292'
	},
	{
		name: 'politexpert.net',
		url: 'https://politexpert.net',
		repoId: '293'
	},
];

module.exports = {statsFilePath, pipelinesFilePath, sitesProps}