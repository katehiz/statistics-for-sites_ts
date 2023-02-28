const express = require('express');
const app = express();
const schedule = require("node-schedule");

const parseIndexMetrics = require('./app-node/modules/ParseIndexMetrics');
const parseSingleMetrics = require('./app-node/modules/ParseSingleMetrics');

const port = process.env.PORT || 8080;

app.use(express.static( __dirname + '/dist' ));
app.get('/');

app.listen(port, () => {
	console.log(`app listening on port ${port}`);

	// Parse metrics for Index pages
	const job1 = schedule.scheduleJob('00 9,19 * * *', () => {
		parseIndexMetrics ()
			.then(result => console.log("Данные успешно записаны в файл"))
			.catch(error => console.log("Ошибка в процессе сбора метрик: " + error))
	});
	// Parse metrics for Single pages 20 minutes later
	const job2 = schedule.scheduleJob('20 9,19 * * *', () => {
		parseSingleMetrics ()
			.then(result => console.log("Данные успешно записаны в файл"))
			.catch(error => console.log("Ошибка в процессе сбора метрик: " + error))
	});
});