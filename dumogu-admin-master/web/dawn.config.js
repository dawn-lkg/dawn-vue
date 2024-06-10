/**
 * 智奇后台管理配置文件
 */

/** 是否是生产环境 */
const isProd = process.env.NODE_ENV === 'production'
/** 开发环境配置 */
let configDev = {
  name: '后台管理',
  title: '最基础的管理端架子 - 智奇管理',
  //baseApiURL: 'https://s.dumogu.top/api',
  baseApiURL: 'http://localhost:8081/',
  routeBasePath: '/',
  biuldBasePath: '/',
}

/** 生产环境配置 */
let configProd = {
  name: '后台管理',
  title: '最基础的管理端架子 - 智奇管理',
  baseApiURL: 'http://120.27.215.0:8282/',
  routeBasePath: '/',
  biuldBasePath: '/',
}

let config = isProd ? configProd : configDev

export default config
