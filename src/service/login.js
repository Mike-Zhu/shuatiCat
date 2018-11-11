import { webURL } from '../constants/utils'
import Taro from '@tarojs/taro'
import { post } from './http'
let api = {
    wxLogin: "api/wxlogin"
}
export let user_id
export let token

export async function wxLogin() {
    let response = await Taro.login()
    let code
    let isSuccess = code = response && response.code
    if (!isSuccess) return false//微信登录失败
    let nodeRes = (await post(api.wxLogin, { code })).data
    let nodeSuccess = nodeRes && nodeRes.type === true
    let nodeData = nodeRes.data
    user_id = nodeData.user_id
    token = nodeData.token
    Taro.setStorageSync('user_id', user_id)
    Taro.setStorageSync('token', token)
    return true
}