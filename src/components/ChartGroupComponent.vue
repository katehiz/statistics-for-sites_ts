<template>
	<div class="chart-wrapper">
		<chart-single-component :metrics="clsValues" :options="CLS" key="CLS" />
		<chart-single-component :metrics="lcpValues" :options="LCP" key="LCP" />
		<chart-single-component :metrics="spiValues" :options="SPI" key="SPI" />
		<chart-single-component :metrics="ttiValues" :options="TTI" key="TTI" />
		<chart-single-component :metrics="tbtValues" :options="TBT" key="TBT" />
		<chart-single-component :metrics="fcpValues" :options="FCP" key="FCP" />
	</div>
</template>

<script lang="ts">
	import { Vue, Component, Prop } from 'vue-property-decorator';
	import ChartSingleComponent from "./ChartSingleComponent.vue";
	import chartOptions from "../mixins/chartOptions";

	interface MetricaTypes {
		CumulativeLayoutShift: number,
		CurrentDate: string,
		FirstContentfulPaint: number,
		LargestContentfulPaint: number,
		Performance: number,
		SpeedIndex: number,
		TimeToInteractive: number,
		TotalBlockingTime: number
	}
	interface Metrica {
		date: number,
		siteName: string,
		pageType: string,
		strategy: string,
		metrics: MetricaTypes
	}
	type MetricaValuesOptions = {
		[key: string]: string | number
	}

	const ChartGroupComponentExtend = Vue.extend({
		components: {
			ChartSingleComponent
		},
		// props: {
		// 	metrics: {
		// 		type: Array, default: () => ([])
		// 	}
		// },
		data () {
			return {
				... chartOptions
			}
		}
	})

	@Component({
		name: 'ChartGroupComponent'
	})

	export default class ChartGroupComponent extends ChartGroupComponentExtend {
		@Prop(Array) data: Array<Metrica>;

		get metrics ():Array<Metrica> {
			return this.$props.data || []
		}

		get clsValues ():object {
			return this.getMetricsByType(
				'CumulativeLayoutShift',
				(val: number) => parseFloat(val.toFixed(2))
			)
		}
		get lcpValues ():object {
			return this.getMetricsByType('LargestContentfulPaint') || {}
		}
		get spiValues ():object {
			return this.getMetricsByType('SpeedIndex') || {}
		}
		get ttiValues ():object {
			return this.getMetricsByType('TimeToInteractive') || {}
		}
		get tbtValues ():object {
			return this.getMetricsByType('TotalBlockingTime') || {}
		}
		get fcpValues ():object {
			return this.getMetricsByType('FirstContentfulPaint') || {}
		}

		getMetricsByType (metricaType: string, formatter?: any): object {
			if (!this.metrics.length) return {};
			// функция обработчик значения. По умолчанию делит число на 1000 и обрезает до 2х знаков после точки
			formatter = formatter || function (val: number) : number {
				return parseFloat((val / 1000).toFixed(2))
			}

			let desktopMetrics = this.metrics
				.filter( (el: Metrica) => {
					if (el.strategy === 'desktop') return el
				})
				.map( (el: Metrica) => {
					if (!el) return;
					return [el.date, formatter( el.metrics[metricaType as keyof MetricaTypes] )]
				});

			let mobileMetrics = this.metrics
				.filter( (el: Metrica) => {
					if (el.strategy === 'mobile') return el
				})
				.map( (el: Metrica) => {
					if (!el) return;
					return [el.date, formatter( el.metrics[metricaType as keyof MetricaTypes] )]
				});

			return {
				desktop: desktopMetrics,
				mobile: mobileMetrics
			}
		}
	}
</script>