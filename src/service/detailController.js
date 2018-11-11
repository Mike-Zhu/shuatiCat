export function getStyle(str) {
    let styleReg = /style=[\'\"]?([^\'\"]*)[\'\"]?/i;
    let styleStr = str.match(styleReg);
    let obj = {}
    if (!!styleStr) {
        //可能在style里
        let styleArr = styleStr[1].split(';')
        styleArr.forEach(res => {
            let arr = ([], res.split(':'))
            if (arr[0].indexOf('width') >= 0) {
                obj['width'] = changeEm(arr[1])

            }
            if (arr[0].indexOf('height') >= 0) {
                obj['height'] = changeEm(arr[1])

            }
        })
    }
    return obj
}

export function getAttr(str) {
    let widthReg = /width=[\'\"]?([^\'\"]*)[\'\"]?/i,
        heightReg = /height=[\'\"]?([^\'\"]*)[\'\"]?/i;
    let widthStr = str.match(widthReg),
        heightStr = str.match(heightReg);
    let obj = {}
    if (!!widthStr) {
        obj['width'] = changeEm(widthStr[1])

    }
    if (!!heightStr) {
        obj['height'] = changeEm(heightStr[1])

    }
    return obj

}

export function setStyle(attr, style, size, scale) {
    let obj = {}
    obj.height = parseInt(attr['height'] || style['height'] || size[3] * scale, 10)

    if (attr['width'] === 'auto' || style['width'] === 'auto') {
        obj.width = obj.height / size[3] * size[2]
        return obj
    }
    obj.width = parseInt(attr['width'] || style['width'] || size[2] * scale, 10)
    return obj
}

export function setStyleForAnalysis({ width, height }, clientInfo) {
    let maxWidth = clientInfo.screenWidth - 60,
        needScale = width > maxWidth
    let scale = needScale ? maxWidth / width : 1
    return {
        width: width * scale,
        height: height * scale
    }
}

export function _handleImageURL(content) {
    let imageWebURL = "https://shuatiapp.cn"
    var re2 = /\/.*?\.(?:png|jpg)/gm;
    let suffixUrl = re2.exec(content)
    let sufUrl = suffixUrl[0]
    if (sufUrl.indexOf("shuatiapp.cn") >= 0) {
        if (sufUrl.indexOf("https:") == -1) {
            return "https:" + sufUrl
        }
        return sufUrl
    }
    return imageWebURL + sufUrl
}

function changeEm(str) {
    if (str.indexOf("em") >= 0) {
        str = str.replace("em", "")
        return Number(str) * 20
    }
    if (str.indexOf('auto') >= 0) {
        return 'auto'
    }
    return str
}

export function getNewIndexList(info, bank = []) {
    let notFilter = Object.keys(info).map(Number)
    let numberList = bank.map(res => Number(res.question_number))
    return numberList.filter(index => notFilter.indexOf(index) < 0)
}

export function getErrorIndexList(info) {
    let oldQuestionList = Object.keys(info).map(Number)
    let filterList = []
    oldQuestionList.forEach(question_number => {
        let detail = info[question_number]
        let weighted = Number(detail.weighted) || 0
        //做过的题并且权重小于7
        if (weighted < 7) { filterList.push(question_number) }
    })
    return filterList
}