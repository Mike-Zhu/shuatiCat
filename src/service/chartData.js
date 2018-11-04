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

const dayTimeScamp = 24 * 60 * 60 * 1000
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

function getScampList() {
    let today = moment().format('YYYY-MM-DD')
    let maxTime = currentTime = new Date(today).getTime() + dayTimeScamp
    let minTime
    let scampList = []
    for (let i = 0; i < 6; i++) {
        currentTime = currentTime - dayTimeScamp
        let timeObject = {
            max: currentTime,
            min: currentTime - dayTimeScamp
        }
        scampList.push(timeObject)
    }
    minTime = currentTime
    scampList = scampList.reverse()
    return {
        scampList,
        maxTime,
        minTime
    }
}

export function getNewQuestionInfo(info) {
    let infoList = Array(6).fill(0)
    if (!info || !Array.isArray(info)) { return infoList }
    let { scampList, maxTime, minTime } = getScampList()
    let finalInfo = info.filter(({ firstDateTime }) => firstDateTime >= minTime && maxTime > firstDateTime)
    finalInfo.forEach(({ firstDateTime }) => {
        scampList.forEach(({ max, min }, index) => {
            let isThisIndex = firstDateTime >= min && firstDateTime < max
            isThisIndex && infoList[index]++
        })
    })
    return infoList
}

export function getOldQuestionInfo(info) {

}