import axios from 'axios'
import { useUserStore } from '@/stores'
//导入全局router实例.
//而不是import { useRouter } from 'vue-router',这个引用只能在当前的组件或设置函数的上下文中使用，并且它依赖于Vue的响应式系统。
//拦截器通常是在全局范围内设置的（而不是在特定的组件中）
import router from '@/router'
import { ElMessage } from 'element-plus'

const baseURL = 'http://big-event-vue-api-t.itheima.net'
const instance = axios.create({
  baseURL,
  timeout: 10000,
})

//请求拦截器
instance.interceptors.request.use(
  config => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = userStore.token
    }
    return config
  },
  err => {
    return Promise.reject(err)
  },
)

//响应拦截器
instance.interceptors.response.use(
  res => {
    if (res.data.code === 0) {
      return res
    }
    ElMessage.error(res.data.message || '服务异常!')
    return Promise.reject(res.data)
  },
  err => {
    if (err.response?.status === 401) {
      router.push('/login')
    }

    ElMessage.error(err.response.data.message || '服务异常!')
    return Promise.reject(err)
  },
)

export default instance
export { baseURL }
