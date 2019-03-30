import Main from '@/components/main'
import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */
//0-读者 1-管理员 2-超管
export default [
  // 系统管理
  {
    path: '/system',
    name: 'system',
    meta: {
      access: ['1', '2'],
      icon: 'md-flower',
      title: '系统管理'
    },
    component: Main,
    children: [
      {
        path: 'user',
        name: 'user',
        meta: {
          access: ['1', '2'],
          icon: 'md-person',
          title: '读者管理'
        },
        component: () => import('@/view/system/User.vue')
      }, {
        path: 'admin',
        name: 'admin',
        meta: {
          access: ['1', '2'],
          icon: 'ios-people',
          title: '管理员管理'
        },
        component: () => import('@/view/system/Admin.vue')
      }]
  },
  // 图书管理
  {
    path: '/book',
    name: 'book',
    meta: {
      access: ['1', '2'],
      title: '图书管理',
      icon: 'ios-book'
    },
    component: Main,
    children: [
      {
        path: 'info',
        name: 'info',
        meta: {
          access: ['1', '2'],
          icon: 'md-book',
          title: '图书信息管理'
        },
        component: () => import('@/view/book/Book.vue')
      }, {
        path: 'type',
        name: 'type',
        meta: {
          access: ['1', '2'],
          icon: 'ios-bookmark',
          title: '图书类目管理'
        },
        component: () => import('@/view/book/BookType.vue')
      }]
  },
  // 借阅管理
  {
    path: '/record',
    name: 'record',
    meta: {
      access: ['1', '2'],
      title: '借阅与催还管理',
      icon: 'md-browsers'
    },
    component: Main,
    children: [
      {
        path: 'borrow',
        name: 'borrow',
        meta: {
          access: ['1', '2'],
          icon: 'md-book',
          title: '借阅记录'
        },
        component: () => import('@/view/borrowRecord/BorrowRecord.vue')
      }, {
        path: 'back',
        name: 'back',
        meta: {
          access: ['1', '2'],
          icon: 'ios-clock',
          title: '催还记录'
        },
        component: () => import('@/view/backRecord/backRecord.vue')
      }]
  },
  // 个人记录
  {
    path: '/own-record',
    name: 'own-record',
    meta: {
      access: ['0'],
      title: '个人记录',
      icon: 'ios-contact'
    },
    component: Main,
    children: [
      {
        path: 'my-borrow',
        name: 'my-borrow',
        meta: {
          icon: 'md-book',
          title: '我的借阅记录'
        },
        component: () => import('@/view/borrowRecord/MyBorrowRecord.vue')
      }, {
        path: 'my-back',
        name: 'my-back',
        meta: {
          icon: 'ios-clock',
          title: '我的催还记录'
        },
        component: () => import('@/view/backRecord/MyBackRecord.vue')
      }]
  },
  // 图书借阅
  {
    path: '/own-borrow',
    name: 'own-borrow',
    meta: {
      access: ['0'],
      title: '图书借阅',
      icon: 'ios-contact'
    },
    component: Main,
    children: [
      {
        path: 'borrowBooks',
        name: 'borrowBooks',
        meta: {
          icon: 'md-book',
          title: '我要借书'
        },
        component: () => import('@/view/book/BorrowBook.vue')
      }]
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true,
          icon: 'md-home'
        },
        component: () => import('@/view/single-page/home')
      },
      {
        path: 'ownspace',
        name: 'own-space',
        meta: {
          title: '个人中心',
          hideInMenu: true
        },
        component: () => import('@/view/own-space/own-space.vue')
      },
      {
        path: 'own-message',
        name: 'own-message',
        meta: {
          access:['0'],
          icon: 'ios-book',
          title: '我要留言',
        },
        component: () => import('@/view/message/MyMessage.vue')
      },
      {
        path: '/message',
        name: 'message',
        meta: {
          access:['1','2'],
          icon: 'ios-book',
          title: '留言管理',
        },
        component: () => import('@/view/message/Message.vue')
      },
    ]
  },
  {
    path: 'ownspace',
    name: 'own-space',
    meta: {
      icon: 'md-person',
      title: '个人中心',
    },
    component: () => import('@/view/own-space/own-space.vue')
  },
  {
    path: '/own-message',
    name: 'own-message',
    meta: {
      access:['0'],
      icon: 'ios-book',
      title: '我要留言',
    },
    component: () => import('@/view/message/MyMessage.vue')
  },
  {
    path: '/message',
    name: 'message',
    meta: {
      access:['1','2'],
      icon: 'ios-book',
      title: '留言管理',
    },
    component: () => import('@/view/message/Message.vue')
  },


  {
    path: '',
    name: 'doc',
    meta: {
      title: '文档',
      href: 'https://lison16.github.io/iview-admin-doc/#/',
      icon: 'ios-book',
      hideInMenu: true
    }
  },

  {
    path: '/argu',
    name: 'argu',
    meta: {
      hideInMenu: true
    },
    component: Main,
    children: [
      {
        path: 'params/:id',
        name: 'params',
        meta: {
          icon: 'md-flower',
          title: route => `{{ params }}-${route.params.id}`,
          notCache: true,
          beforeCloseName: 'before_close_normal'
        },
        component: () => import('@/view/argu-page/params.vue')
      },
      {
        path: 'query',
        name: 'query',
        meta: {
          icon: 'md-flower',
          title: route => `{{ query }}-${route.query.id}`,
          notCache: true
        },
        component: () => import('@/view/argu-page/query.vue')
      }
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
