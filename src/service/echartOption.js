let grid = {
    left: '15',
    right: '15',
    bottom: '3%',
    top: '20',
    containLabel: true
}
let xAxis = {
    type: 'category',
    boundaryGap: false,
    axisLine: {
        show: false
    },
    axisTick: {
        show: false
    },
    nameTextStyle: {
        color: "#8E9091",
        fontSize: 12
    }
}

function getAreaStyle(color) {
    return {
        normal: {
            color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                    offset: 0, color: color // 0% 处的颜色
                }, {
                    offset: 1, color: '#ffffff' // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
            }
        }
    }
}
export const newPaper = {
    option: {
        grid,
        xAxis: [xAxis],
        yAxis: [
            {
                minInterval: 1,
                type: 'value',
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                nameTextStyle: {
                    color: "#8E9091",
                    fontSize: 14
                },
                axisLabel: {
                    show: false,
                    inside: true
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#D8D8D8',
                        type: 'dashed'
                    }
                },
            }
        ],
        series: [
            {
                type: 'line',
                stack: '总量',
                itemStyle: {
                    normal: {
                        color: '#1495EB',
                        lineStyle: {
                            color: '#1495EB'
                        }
                    }
                },
                smooth: false,
                symbolSize: 6,
                areaStyle: getAreaStyle('#1495EB'),
                label: {
                    show: true,
                    position: 'top'
                },
                data: [0, 0, 0, 0, 0, 1]
            }
        ]
    }
}


export const rememberPaper = {
    option: {
        grid,
        xAxis: [xAxis],
        yAxis: [
            {
                minInterval: 1,
                type: 'value',
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                nameTextStyle: {
                    color: "#8E9091",
                    fontSize: 14
                },
                axisLabel: {
                    show: false,
                    inside: true
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#D8D8D8',
                        type: 'dashed'
                    }
                },
            }
        ],
        series: [
            {
                type: 'line',
                stack: '总量',
                itemStyle: {
                    normal: {
                        color: '#FF5B29',
                        lineStyle: {
                            color: '#FF5B29'
                        }
                    }
                },
                smooth: false,
                symbolSize: 6,
                areaStyle: getAreaStyle('#FF5B29'),
                label: {
                    normal: {
                        show: true,
                        position: 'top'
                    }
                },
                data: [0, 15, 40, 30, 80, 50]
            }
        ]
    }
}
