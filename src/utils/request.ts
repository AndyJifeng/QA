/* eslint-disable */

// 封装axios接口
import axios from 'axios'
import createStore from '@/store/index'
const store = createStore

axios.interceptors.request.use(function (config) {
    store.commit('showloadding', true)
    return config
}, function error() {
    store.commit('showloadding', true)
    return Promise.reject(error)
})
axios.interceptors.response.use((response) => {
    setTimeout(function () { store.commit('showloadding', false);return response}, 500)
    return response
}, function error() {
    store.commit('showloadding', false)
    return Promise.reject(error)
})

export default axios