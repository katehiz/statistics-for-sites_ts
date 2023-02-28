const fetch = require("node-fetch");
const {writeFile} = require("fs");

const {pipelinesFilePath, sitesProps, repoUrl, repoPrivateToken} = require('../config');
const _BRANCH_NAME = 'master';

module.exports = async function parseDataFromGit() {
	let dateSinse = new Date();
	let dateTo = new Date();
	let responsesPull = [];
	dateSinse.setDate(dateSinse.getDate() - 30);

	// собираем пулл запросов для каждого сайта
	for (const site of sitesProps) {
		let url = `${repoUrl}/api/v4/projects/${site.repoId}/pipelines?ref=${_BRANCH_NAME}`;
		url += `&status=success&updated_after=${dateSinse.toISOString()}&updated_before=${dateTo.toISOString()}`;

		responsesPull.push(
			fetch(url, {
				method: 'GET',
				headers: {
					'private-token': repoPrivateToken,
					'content-type': 'application/json'
				}
			}).then(response => {
				if (!response.ok) return null;
				return response.json();
			}).then(result => {
				return {
					site: site,
					pipelinesIds: result.map(el => el.id)
				}
			})
		)
	}
	
	// выполняем пулл, получаем первичные данные по pipelines для всех сайтов
	let pipelines = await Promise.allSettled(responsesPull)
		.then(responses => 
			responses.map(response => {
				if (response.status === 'fulfilled' && response.value !== null) {
					return response.value
				}
			})
		)
	
	// массив {site: siteData, pipelines: ArrayOfPipelinesFetches}
	let arrayOfSitesPipelinesFetches = [];

	for (const site of pipelines) {
		let repoId = site.site.repoId;
		let pipelinesFetchPull = [];
		
		// формируем массив pipelines для текущего сайта в итерации
		for (const id of site.pipelinesIds) {
			pipelinesFetchPull.push(
				fetch(`${repoUrl}/api/v4/projects/${repoId}/pipelines/${id}`, {
					method: 'GET',
					headers: {
						'private-token': repoPrivateToken,
						'content-type': 'application/json'
					}
				})
				.then(response => response.ok ? response.json() : null)
				.then(result => {
					return {
						pipeline_id: result?.id,
						finished_at: Date.parse(result?.finished_at),
						sha: result?.sha,
						web_url: result?.web_url
					}
				})
			)
		}

		arrayOfSitesPipelinesFetches.push({
			site: site.site,
			pipelines: pipelinesFetchPull // промисы, ожидающие детализированные данные по каждому pipeline
		})
	}

	let result = [];

	// Разрешаем массивы промисов по каждому сайту и формируем окончательный массив с данными
	for (const site of arrayOfSitesPipelinesFetches) {
		let pipelinesArr = await Promise.allSettled(site.pipelines)
			.then(responses => 
				responses.map(response => {
					if (response.status === 'fulfilled' && response.value !== null) return response.value
				})
			)
		
		result.push({
			site: site.site.name,
			pipelines: pipelinesArr
		})
	}

	// создаём или перезатираем существующий файл
	writeFile (
		pipelinesFilePath,
		JSON.stringify(result),
		'utf8',
		err => {if (err) throw err}
	);

	return result
}