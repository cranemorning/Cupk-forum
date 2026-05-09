import {createRouter, createWebHashHistory,createWebHistory} from "vue-router";
import { message } from 'ant-design-vue';
import jwt from '../jwt'
const routes = [
    {
    path: '/index',
    redirect: '/',
    },
    {
    path: '/home',
    redirect: '/',
    },
    {
      path: '/',
      name: 'Home',
        meta: {
            title: '主页',
            requireAuth: false,
          },
        component:()=>import("../src/views/HomeView.vue")
    },
    {
      path:"/login",
      meta: {
          title: '登录',
          requireAuth: false,
        },
      component:()=>import("../src/views/login.vue")
  },
    {
        path:"/userRegister",
        meta: {
            title: '用户注册',
            requireAuth: false,
          },
        component:()=>import("../src/views/userRegister.vue")
    },
    {
      path:"/userInfo",
      meta: {
          title: '用户基本信息',
          requireAuth: true,
        },
      component:()=>import("../src/views/userInfo.vue")
  },
  {
    path:"/userAvatar",
    meta: {
        title: '用户头像修改',
        requireAuth: true,
      },
    component:()=>import("../src/views/userAvatar.vue")
  },
  {
    path:"/userPassword",
    meta: {
        title: '用户密码修改',
        requireAuth: true,
      },
    component:()=>import("../src/views/userPassword.vue")
  },
  {
    path:"/Article_Post",
    meta: {
        title: '文章发布页',
        requireAuth: true,
      },
    component:()=>import("../src/views/Article_Post.vue")
  },
    {
      path:"/Article_User",
      meta: {
          title: '用户文章页',
          requireAuth: false,
        },
      component:()=>import("../src/views/Article_User.vue")
    },
    {
      path:"/Article_Detail/:id",
      meta: {
          name:'detail',
          title: '文章详情',
          requireAuth: false,
        },
      component:()=>import("../src/views/Article_Detail.vue")
    },
    {
      path:"/userCenter/:userId",
      meta: {
          name:'userCenter',
          title: '用户主页',
          requireAuth: false,
        },
      component:()=>import("../src/views/userCenter.vue")
    },
    {
      path:"/admin",
      meta: {
          title: '管理员中心',
          requireAuth: true,
          requireAdmin: true
        },
      component:()=>import("../src/views/users_manage.vue")
    }
]
 
const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
          // 用户通过浏览器的“后退”按钮导航，回到之前保存的滚动位置
          return savedPosition;
        } else {
          // 用户通过页面上的链接跳转，滚动到页面顶部
          return { top: 0 };
        }
      }
});

// 路由守卫
router.beforeEach((to,from,next) => {
    // 设置页面标题
    let wholeTitle = to.meta.title + " | CUPK论坛";
    document.title = wholeTitle;//添加标签
    //在设置next时 要非常严谨 否则会出现无限嵌套循环导致报错
    if(!(
      to.path==='/login' || to.path==='/' || to.path==='/userRegister' || to.path.startsWith('/Article_Detail/') || to.path.startsWith('/userCenter/')
    ))//豁免网页
    {
      if(jwt.hasToken())
      {
        console.log("jwt验证通过");
        // 检查是否需要管理员权限
        if (to.meta.requireAdmin) {
          const roleId = localStorage ? localStorage.getItem('roleId') : null;
          if (roleId === '2') {
            console.log("管理员权限验证通过");
            next();//验证通过:放行
          } else {
            console.log("非管理员,无法访问");
            message.error("您不是管理员,无法访问该页面")
            next('/');
          }
        } else {
          next();//验证通过:放行
        }
      }
      else
      {//验证不通过 跳转到登录界面使用户先登录
        console.log("jwt验证不通过");
        message.error("请先登录")
        next('/login');
      }
    }
    else//去到不需要验证的网页时直接放行
    {
      console.log("该页无需登录,放行");
      next();
    }
    //如果用户已经登录 则不能进入登录网页
  });

export default router