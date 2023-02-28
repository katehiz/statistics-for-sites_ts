<template>
	<div id="app">
		<div class="wrapper">
			<div class="top-bar">
				<h2 class="title">PageSpeed Insights Metrics Charts</h2>
				<select-component :list="siteList" v-model="siteName" key="siteName" />
				<select-component :list="pageTypeList" v-model="pageType" key="pageType" />
			</div>
			<chart-group v-if="metrics" :data="selectedSiteMetrics" />
		</div>
	</div>
</template>

<script lang="ts">
	import { Vue, Component, Prop } from 'vue-property-decorator';

	import SelectComponent from './components/SelectComponent.vue';
	import ChartGroup from './components/ChartGroupComponent.vue';

	interface Metrica {
		date: number,
		siteName: string,
		pageType: string,
		strategy: string,
		metrics: object
	}

	const ExtendApp = Vue.extend({
		name: 'App',
		components: {
			SelectComponent,
			ChartGroup
		}
	})

	@Component({})
	export default class App extends ExtendApp {
		metrics:Array<Metrica> = [];
		siteName:string = 'riafan.ru';
		pageType:string = 'index';
		siteList = [
			'riafan.ru',
			'nation-news.ru',
			'inforeactor.ru',
			'polit.info',
			'politros.com',
			'slovodel.com',
			'rueconomics.ru',
			'nevnov.ru',
			'politexpert.net',
		];
		pageTypeList = ['index', 'single'];

		created () {
			this.getMetrics().then( data => {
				this.metrics = data;
			})
		}

		async getMetrics (): Promise<Metrica[]> {
			let data = [];
			let response = await fetch('./stats.json', {
				method: 'GET',
				headers: {'Content-Type' : 'application/json'}
			})
			if (response.status === 200) {
				data = await response.json();
			}
			return data
		}

		changeSiteName (val: string) {
			this.siteName = val
		}

		get selectedSiteMetrics ():Array<Metrica> {
			let data:Array<Metrica> = JSON.parse(JSON.stringify(this.metrics));
			return data.filter( (item) => item.siteName === this.siteName && item.pageType === this.pageType ).sort( (a, b) => {
				if (a.date > b.date) return 1;
				if (a.date < b.date) return -1;
				return 0
			})
		}

	};
</script>

<style lang="scss">
	body {
		padding: 0;
		margin: 0;
		background-color: #333;
	}
	.top-bar {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		padding: 0.5rem 1rem;
		margin-bottom: 1rem;
		border-bottom: 1px solid #666;

		.title {
			color: lightgray;
			margin-right: 3rem;
		}
	}

	.chart-wrapper {
		display: flex;
		flex-wrap: wrap;

		.chart {
			width: 100%;
			padding: 10px;
			box-sizing: border-box;

			@media (min-width: 1024px) {
				width: 50%;
				padding: 5px;
			}
			@media (min-width: 1640px) {
				width: calc(100% / 3);
			}	
			
			.highcharts-credits,
			.highcharts-exporting-group {
				display: none;
			}
		}
	}
</style>
