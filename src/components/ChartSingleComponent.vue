<template>
	<highcharts class="chart" :options="chartOptions" />
</template>

<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator';

	import {Chart} from 'highcharts-vue';
	// import exportingInit from 'highcharts/modules/exporting';
	// exportingInit(Highcharts);

    // Highcharts.setOptions({
    //     global: {
    //         timezoneOffset: new Date().getTimezoneOffset()
    //     }
    // });

    const ChartSingleComponentExtend = Vue.extend({
        name: 'ChartSingleComponent',
        components: {
            highcharts: Chart
        },
		props: {
            metrics: {
                type: Object,
                default: () => ({})
            },
            options: {
                type: Object,
                default: () => ({})
            }
        }
    });

    @Component({})
    
    export default class ChartSingleComponent extends ChartSingleComponentExtend {
        get chartOptions(): Object {
            let options = JSON.parse(JSON.stringify(this.$props.options));
            options.xAxis.labels = {
                align: 'top',
                format: '{value:%e %b}'
            }
            if (!options.hasOwnProperty('series')) {
                Object.defineProperties(options, {
                    'series': {
                        value: [],
                        writable: true,
                        enumerable: true
                    }
                })
            }
            
            options.series.push(
                {
                    name: "Desktop",
                    data: this.$props.metrics.desktop,
                    color: 'green'
                },
                {
                    name: "Mobile",
                    data: this.$props.metrics.mobile,
                    color: 'blue'
                },
            )

            options.timezoneOffset = new Date().getTimezoneOffset()
            return options
        }
    }
</script>