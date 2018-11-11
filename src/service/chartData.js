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
const today = {
    value: '今日',
    textStyle: {
        fontSize: 12,
        color: '#172434'
    }
}
const otherDayStyle = {
    fontSize: 12,
    color: '#8E9091'
}
export function getWeekdayList() {
    let weekArray = [], i = 5
    while (i > 0) {
        let day = moment().subtract(i, 'days').format('dddd')
        let d = {
            value: daysTransfer[day],
            textStyle: otherDayStyle
        }
        weekArray.push(d)
        i--
    }
    weekArray.push(today)
    return weekArray
}

export function getFutureWeekday() {
    let weekArray = [today]
    for (var i = 1; i < 6; i++) {
        let day = moment().add(i, 'days').format('dddd')
        let d = {
            value: daysTransfer[day],
            textStyle: otherDayStyle
        }
        weekArray.push(d)
    }
    return weekArray
}

function getScampList() {
    let today = moment().format('YYYY-MM-DD')
    let currentTime
    let maxTime = currentTime = new Date(today).getTime() + dayTimeScamp
    let minTime
    let scampList = []
    for (let i = 0; i < 6; i++) {
        let timeObject = {
            max: currentTime,
            min: currentTime - dayTimeScamp
        }
        scampList.push(timeObject)
        currentTime = currentTime - dayTimeScamp
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
    if (!info) { return infoList }
    let keyList = Object.keys(info)
    let { scampList, maxTime, minTime } = getScampList()
    let finalInfo = []
    keyList.forEach(key => {
        let questionInfo = info[key]
        let { firstDateTime } = questionInfo
        let isFinalInfo = firstDateTime >= minTime && maxTime > firstDateTime
        isFinalInfo && finalInfo.push(questionInfo)
    })
    finalInfo.forEach(({ firstDateTime }) => {
        scampList.forEach(({ max, min }, index) => {
            let isThisIndex = firstDateTime >= min && firstDateTime < max
            isThisIndex && infoList[index]++
        })
    })
    return infoList
}

export function getOldQuestionInfo(info) {
    let infoList = Array(6).fill(0)
    //完全记忆与未完全记忆
    let completed = 0, unCompleted = 0
    for (let key in info) {
        let detail = info[key]
        let weighted = Number(detail.weighted) || 0
        weighted >= 7 ? completed++ : unCompleted++
    }
    let scaleList = [1, 0.6, 0.45, 0.36, 0.34, 0.28]
    infoList = scaleList.map(scale => parseInt(completed + scale * unCompleted, 10))
    return infoList
}

export function getTodayNumber(info) {
    //今天的刷题量
    let list = getNewQuestionInfo(info)
    let len = list.length
    return list[len - 1]
}

export function getOldNumber(info) {
    let completed = 0, unCompleted = 0
    for (let key in info) {
        let detail = info[key]
        let weighted = Number(detail.weighted) || 0
        weighted >= 7 ? completed++ : unCompleted++
    }
    return unCompleted
}