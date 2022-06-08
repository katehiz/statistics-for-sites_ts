import Highcharts from 'highcharts';

/**
 * Calculate floor date to current hourse
 * @returns {Number} JS timestamp (milliseconds)
 */
const getNowDate = function () {
   const date = new Date();
   date.setMilliseconds(0);
   date.setSeconds(0);
   date.setMinutes(0);
   return +date
}
const todayDate = getNowDate();
const minDate = todayDate - (1000 * 3600 * 24 * 30);

// General options mixin
const options = {
    chart: {
        type: 'spline'
    },
    tooltip: {
        formatter: function(this: Highcharts.TooltipFormatterContextObject) {
            if (!this?.points?.length) return;
            return this.points.reduce( 
                (s, point) =>  s + '<br/>' + point.series.name + ': ' + point.y + 'm',
                '<b>' + this.x + '</b>'
            );
        },
        shared: true
    },
    xAxis: {
        type: 'datetime',
        title: {
            text: 'Дата'
        },
        crosshair: true,
        min: minDate,
        max: todayDate,
        tickPixelInterval: 100,
        labels: {}
    },
    series: []
}

// custom options for Higshart charts
export default {
    CLS: {
        ... options,
        title: {
            text: "Cumulative Layot Shift (CLS)"
        },
        yAxis: {
            title: {
                text: 'Значение'
            },
            tickInterval: 0.1,
            plotBands: [
                {
                    from: 0,
                    to: 0.10,
                    color: "rgba(46, 204, 113, 0.5)"
                },
                {
                    from: 0.10,
                    to: 0.25,
                    color: "rgba(245, 176, 65, 0.5)"
                },
                {
                    from: 0.25,
                    to: 20,
                    color: "rgba(231, 76, 60, 0.5)"
                }
            ]
        }
    },

    LCP: {
        ... options,
        title: {
            text: "Largest Contentful Paint (LCP)"
        },
        yAxis: {
            title: {
                text: 'Значение (сек)'
            },
            tickInterval: 0.5,
            plotBands: [
                {
                    from: 0,
                    to: 2.5,
                    color: "rgba(46, 204, 113, 0.5)"
                },
                {
                    from: 2.5,
                    to: 4,
                    color: "rgba(245, 176, 65, 0.5)"
                },
                {
                    from: 4,
                    to: 20,
                    color: "rgba(231, 76, 60, 0.5)"
                }
            ]
        }
    },

    TTI: {
        ... options,
        title: {
            text: "Time To Interactive (TTI)"
        },
        yAxis: {
            title: {
                text: 'Значение (сек)'
            },
            tickInterval: 0.5,
            plotBands: [
                {
                    from: 0,
                    to: 3.8,
                    color: "rgba(46, 204, 113, 0.5)"
                },
                {
                    from: 3.8,
                    to: 7.3,
                    color: "rgba(245, 176, 65, 0.5)"
                },
                {
                    from: 7.3,
                    to: 50,
                    color: "rgba(231, 76, 60, 0.5)"
                }
            ]
        }
    },

    TBT: {
        ... options,
        title: {
            text: "Total Blocking Time (TBT)"
        },
        yAxis: {
            title: {
                text: 'Значение (миллисекунд)'
            },
            tickInterval: 0.5,
            plotBands: [
                {
                    from: 0,
                    to: 200,
                    color: "rgba(46, 204, 113, 0.5)"
                },
                {
                    from: 200,
                    to: 600,
                    color: "rgba(245, 176, 65, 0.5)"
                },
                {
                    from: 600,
                    to: 10000,
                    color: "rgba(231, 76, 60, 0.5)"
                }
            ]
        }
    },

    FCP: {
        ... options,
        title: {
            text: "First Contentful Paint (FCP)"
        },
        yAxis: {
            title: {
                text: 'Значение (секунд)'
            },
            tickInterval: 0.5,
            plotBands: [
                {
                    from: 0,
                    to: 1.8,
                    color: "rgba(46, 204, 113, 0.5)"
                },
                {
                    from: 1.8,
                    to: 3,
                    color: "rgba(245, 176, 65, 0.5)"
                },
                {
                    from: 3,
                    to: 20,
                    color: "rgba(231, 76, 60, 0.5)"
                }
            ]
        }
    },

    SPI: {
        ... options,
        title: {
            text: "Speed Index (SPI)"
        },
        yAxis: {
            title: {
                text: 'Значение (секунд)'
            },
            tickInterval: 0.5,
            plotBands: [
                {
                    from: 0,
                    to: 3.4,
                    color: "rgba(46, 204, 113, 0.5)"
                },
                {
                    from: 3.4,
                    to: 5.8,
                    color: "rgba(245, 176, 65, 0.5)"
                },
                {
                    from: 5.8,
                    to: 20,
                    color: "rgba(231, 76, 60, 0.5)"
                }
            ]
        }
    }
}