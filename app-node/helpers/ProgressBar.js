/**
 * HOW TO USE?
 * 
 * const Bar = new Progress(`Parse: :bar`);
 * Bar.start();
 * ... code execution ...
 * Bar.stop();
 */

const ProgressBar = require('progress');

module.exports = class Progress {
	constructor(message) {
		this.message = message ? message : 'Parse: [:bar]';
		this.timer = 0;
		this.bar = new ProgressBar(this.message, { total: 50, incomplete: ' ' });
	}
	start () {
		const _this = this;
		this.timer = setInterval( () => _this.bar.tick(), 1000);
	}
	stop () {
		clearInterval(this.timer);
		console.log(' complete\n');
	}		
};