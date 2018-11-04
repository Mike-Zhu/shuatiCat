import moment from 'moment'

const daysTransfer = {
    'Sunday': '周日',
    'Monday': '周一',
    'Tuesday': '周二',
    'Wednesday': '周三',
    'Thursday': '周四',
    'Friday': '周五',
    'Saturday': '周六'
}

export function getWeekdayList() {
    let weekArray = []
    for (var i = 5; i > 0; i--) {
        let day = moment().subtract(i, 'days').format('dddd')
        let d = {
            value: daysTransfer[day],
            textStyle: {
                fontSize: 12,
                color: '#8E9091'
            }
        }
        weekArray.push(d)
    }
    weekArray.push({
        value: '今日',
        textStyle: {
            fontSize: 12,
            color: '#172434'
        }
    })
    return weekArray
}