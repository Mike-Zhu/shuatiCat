import { webURL } from '../constants/utils'
import Taro from '@tarojs/taro'

export const user_id = 'SS00000001'
export const token = '90ddc270f20d74b65cd78bf8ec68e6a3'

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
        .then(res => console.log(res.data))
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
        .then(res => console.log(res.data) || res.data)
}

export default {
    post,
    get
}