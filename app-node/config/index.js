const { env } = process
const path = require('path');

const statsFilePath = path.resolve('dist', 'stats.json');
const pipelinesFilePath = path.resolve('dist', 'pipelines.json');

const googleApiKey = env.GOOGLE_API_KEY || '';
const repoUrl = env.REPO_URL || '';
const repoPrivateToken = env.REPO_PRIVATE_TOKEN || '';

const sitesProps = [
	{
	  name: 'sitename.ru', // имя сайта
	  url: 'https://sitename.ru', // url сайта
	  repoId: '1' // id репозитория
	},
	// ...
];

module.exports = {statsFilePath, pipelinesFilePath, googleApiKey, repoUrl, repoPrivateToken, sitesProps}