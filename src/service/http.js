import { webURL } from '../constants/utils'
import Taro from '@tarojs/taro'

export const user_id = 'SS00000001'
export const token = '920603cb89871e19a7684dc757dade7c'

export function post(api, data) {
    let url = webURL + api,
        header = {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: token,
        }

    return Taro.request({
        url,
        data,
        method: 'POST',
        header
    })
        // .then(res => console.log(res.data))
}

export function get(api, data) {
    let url = webURL + api,
        header = {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: token,
        }
    return Taro.request({
        url,
        data,
        method: 'GET',
        header
    })
        .then(res =>  res.data)
}

export default {
    post,
    get
}