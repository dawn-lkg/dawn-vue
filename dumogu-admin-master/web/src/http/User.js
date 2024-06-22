/*jshint esversion: 9 */
import { service } from './Request'
import qs from 'qs'

/** 公用接口 */
const allApi = {
  async login(data) {
    const res = await service({
      url: '/login',
      method: 'POST',
      data: data,
    })
    return res.data
  },
  loginGithub(code) {
    return service({
      url: '/login-github',
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      data: code,
    })
  },
  getUserInfo() {
    return service({
      url: '/user/info',
    })
  },
  updateUserInfo(userInfo) {
    return service({
      url: '/user/update-userInfo',
      method: 'POST',
      data: userInfo,
    })
  },
  updatePassword(password) {
    return service({
      url: '/user/update-password',
      method: 'POST',
      data: password,
    })
  },
  getDataPage(params) {
    return service({
      url: '/user/page',
      method: 'GET',
      params: params,
    })
  },
  updateData(form) {
    return service({
      url: '/user',
      method: 'PUT',
      data: form,
    })
  },
  saveData(form) {
    return service({
      url: '/user',
      method: 'POST',
      data: form,
    })
  },
  removeData(id) {
    return service({
      url: '/user/' + id,
      method: 'DELETE',
    })
  },
  async getMenuList() {
    const res = await service({
      url: '/getRouters',
    })
    console.log(res)
    return Promise.resolve(res)
    let menuList = [
      {
        name: 'main-index',
        title: '首页',
        content: '(有缓存，并且标签页固定)',
        isCache: true,
        fixed: true,
        iconName: 'svg:all-fill.svg',
      },
      {
        name: 'new-tag-page',
        title: '新标签页',
        isCache: true,
        hidden: true,
      },
      {
        name: 'main-401',
        title: '401页面',
        isCache: true,
        hidden: true,
      },
      {
        name: 'main-404',
        title: '404页面',
        isCache: true,
        hidden: true,
      },
      {
        name: 'main-mine-info',
        title: '个人中心',
        isCache: true,
        hidden: true,
      },
      {
        name: 'main-mine-info-update',
        title: '个人信息修改',
        isCache: true,
        hidden: true,
      },
      {
        name: 'main-mine-info-password',
        title: '修改密码',
        isCache: true,
        hidden: true,
      },
      {
        title: '系统管理',
        iconName: 'svg:cog-fill.svg',
        childs: [
          {
            name: 'menu',
            title: '菜单管理',
            isCache: true,
            content: '用户目录配置',
            iconName: 'svg:alignleft-fill.svg',
            showTagIcon: true,
          },
          {
            name: 'bt-permission',
            title: '按钮权限管理',
            isCache: true,
            content: '与菜单分开',
            iconName: 'svg:borderverticle-fill.svg',
            showTagIcon: true,
          },
          {
            name: 'user-list',
            title: '用户管理',
            isCache: true,
            content: '',
            iconName: 'svg:user-fill.svg',
            showTagIcon: true,
          },
          {
            name: 'role-list',
            title: '角色列表',
            isCache: true,
            content: '',
            iconName: 'svg:user-group-fill.svg',
            showTagIcon: true,
          },
        ],
      },
      {
        title: '站内链接',
        iconName: 'svg:aligncenter-fill.svg',
        childs: [
          {
            path: '/main/iframe/yipian?src=https://www.dumogu.top/',
            title: '一篇文字',
            content: '有缓存',
            iconName: 'img:logo.png',
            showTagIcon: true,
            isCache: true,
          },
          {
            path: '/main/iframe/blog?src=https://blog.dumogu.top/',
            title: '智奇 博客',
            iconName: 'img:logo.png',
            showTagIcon: true,
            isCache: false,
          },
          {
            path: `/main/iframe/vue?src=${encodeURIComponent(
              'https://cn.vuejs.org/guide/introduction.html'
            )}`,
            title: 'VUE3文档',
            content: '有缓存',
            iconName: 'img:vue.svg',
            showTagIcon: true,
            isCache: true,
          },
          {
            path: `/main/iframe/gaode?src=${encodeURIComponent('https://www.amap.com/')}`,
            title: '高德地图',
            content: '有缓存',
            iconName: 'img:gaode.svg',
            showTagIcon: true,
            isCache: true,
          },
        ],
      },
      {
        name: 'show-list',
        title: '展示列表',
        iconName: 'svg:laptop-check.svg',
        number: 4,
      },
      {
        name: 'merge-table',
        title: '合并表格展示列表',
        iconName: 'svg:laptop-check.svg',
      },
      {
        name: 'other-view',
        title: '其他功能展示',
        iconName: 'svg:map-fill.svg',
        isCache: true,
      },
      {
        title: '大屏展示',
        content: '多种方式',
        iconName: 'svg:laptop.svg',
        childs: [
          {
            title: '示例1',
            isCache: true,
            content: '使用缩放',
            iconName: 'svg:laptop.svg',
            isLink: true,
            path: '/big-screen/show_1',
          },
          {
            title: '示例2',
            isCache: false,
            content: '使用Rem',
            iconName: 'svg:laptop.svg',
            isLink: true,
            path: '/big-screen/show_2',
          },
          {
            title: '示例3',
            isCache: true,
            content: '固定宽高',
            iconName: 'svg:laptop.svg',
            isLink: true,
            path: '/big-screen/show_3',
          },
          {
            title: '示例4(推荐)',
            isCache: true,
            content: '宽高缩放',
            iconName: 'svg:laptop.svg',
            isLink: true,
            path: '/big-screen/show_4',
          },
          {
            title: '示例1(测试)',
            isCache: true,
            content: '内容全屏',
            iconName: 'svg:laptop.svg',
            isLink: false,
            path: '/main/big-screen/show_1',
            viewFullScreen: true,
            hiddenViewFullScreenBt: true,
          },
        ],
      },
      {
        name: 'show-list-info',
        title: '数据详情',
        hidden: true,
        iconName: 'svg:all-fill.svg',
      },
      {
        name: 'show-list-add',
        title: '数据添加',
        hidden: true,
        iconName: 'svg:Navbar-full.svg',
      },
      {
        name: 'show-list-update',
        title: '数据编辑',
        hidden: true,
        isCache: true,
        content: '(有缓存)',
        iconName: 'svg:Navbar-full.svg',
      },
      {
        title: '多级菜单',
        iconName: 'svg:alignleft-fill.svg',
        childs: [
          {
            title: '可点击父级',
            path: '/main/show-list/update/erterter',
            iconName: 'svg:aligncenter-fill.svg',
            childs: [
              {
                name: 'show-list-update',
                path: '/main/show-list/update/123123',
                title: '可点击父级',
                iconName: 'svg:aligncenter-fill.svg',
                childs: [
                  {
                    name: 'show-list-update',
                    path: '/main/show-list/update/1231233',
                    title: '数据编辑 - 测试',
                    iconName: 'svg:test-1.svg',
                    showTagIcon: true,
                  },
                ],
              },
              {
                title: '父级',
                iconName: 'svg:aligncenter-fill.svg',
                childs: [
                  {
                    name: 'show-list-update',
                    path: '/main/show-list/update/1235123',
                    title: '数据编辑 - 测试1',
                    iconName: 'svg:plus-square-fill.svg',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        name: 'icon-list',
        title: 'icon 列表展示',
        isCache: true,
        content: '(有缓存)',
        // iconName:"svg:collection-fill.svg",
        iconName: 'img:logo.png',
        showTagIcon: true,
        number: 20,
      },
      {
        name: 'mine',
        title: '个人中心',
        isCache: true,
        content: '(有缓存)',
        hidden: true,
        iconName: 'svg:Navbar-full.svg',
      },
      {
        name: 'setup-tag',
        title: '设置标签页',
        isCache: true,
        content: '(有缓存)',
        hidden: false,
        iconName: 'svg:tag.svg',
      },
      {
        name: 'setup-menu',
        title: '目录信息',
        isCache: true,
        content: '(有缓存)',
        hidden: false,
        iconName: 'svg:Directory-tree.svg',
      },
      {
        name: 'abcd',
        title: 'ABCD',
        isCache: true,
        content: '(有缓存)',
        hidden: false,
        iconName: 'svg:Directory-tree.svg',
      },
      {
        title: '开源地址',
        iconName: 'svg:git-hub.svg',
        isLink: true,
        path: 'https://github.com/wurencaideli/dumogu-admin',
      },
      {
        title: '一篇文字',
        iconName: 'svg:friendship.svg',
        isLink: true,
        path: 'https://www.dumogu.top/',
      },
      {
        title: '智奇 博客',
        iconName: 'svg:friendship.svg',
        isLink: true,
        path: 'https://blog.dumogu.top/',
      },
      {
        title: '智奇 搜索',
        iconName: 'svg:friendship.svg',
        isLink: true,
        path: 'https://s.dumogu.top/',
      },
      {
        title: '智奇 变量',
        iconName: 'svg:friendship.svg',
        isLink: true,
        path: 'https://var.dumogu.top/',
      },
      {
        title: '站搜搜',
        iconName: 'svg:friendship.svg',
        isLink: true,
        path: 'https://www.zhansousou.com/',
      },
      {
        title: '测试',
        iconName: 'svg:friendship.svg',
        isLink: true,
        path: 'https://www.zhansousou.com/',
      },
    ]
    return Promise.resolve({
      msg: '操作成功',
      code: 200,
      data: menuList,
    })
  },
}

export default allApi
