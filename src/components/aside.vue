<template>
      <el-aside style="min-height: 100%;">
        <div style="background-color:  rgb(88, 24, 76); height: 60px; line-height: 60px; font-size: 20px; display: flex; align-items: center; justify-content: center">
        <span class="logo-title" v-show="!isCollapse" style="color: white;">CUPK论坛</span>
        </div>
          <el-menu :default-active="$route.path" router><!--给el-menu加上router属性 使menu-item可以直接路由-->
            <el-menu-item index="/home"><el-icon><House /></el-icon>首页</el-menu-item>
            <el-sub-menu v-if="jwt.hasToken()" index="1">
              <template #title>
              文章管理
              </template>
              <el-menu-item-group>
                <template #title></template>
                <el-menu-item index="/Article_User"><el-icon><Memo /></el-icon>我的文章</el-menu-item>
                <el-menu-item index="/Article_Post"><el-icon><Sell /></el-icon>文章发布</el-menu-item>
              </el-menu-item-group>
            </el-sub-menu>
            <el-sub-menu v-if="jwt.hasToken()" index="2">
              <template #title>
              个人中心
              </template>
              <el-menu-item-group>
                <template #title></template>
                <el-menu-item :index="`/userCenter/${userId}`" ><el-icon><Document /></el-icon>查看个人主页</el-menu-item>
                <el-menu-item index="/userInfo"><el-icon><Document /></el-icon>基本信息修改</el-menu-item>
                <el-menu-item index="/userAvatar"><el-icon><Avatar /></el-icon>头像修改</el-menu-item>
                <el-menu-item index="/userPassword"><el-icon><WarnTriangleFilled /></el-icon>密码修改</el-menu-item>
              </el-menu-item-group>
            </el-sub-menu>
            <!-- 管理员中心 -->
            <el-menu-item v-if="jwt.hasToken() && isAdmin" index="/admin"><el-icon><Setting /></el-icon>管理员中心</el-menu-item>
          </el-menu>
      </el-aside>
  </template>
  
  <script>
  import {Setting, House ,Document,Avatar} from '@element-plus/icons-vue'
  import {WarnTriangleFilled,Memo,Sell} from '@element-plus/icons-vue'
  import {ref} from 'vue'
  import jwt from '../../jwt';
  export default {
    setup() {
      const isCollapse = ref(false); // 控制侧边栏折叠状态
      const userId = ref(localStorage ? localStorage.getItem('userId') : null);//获取当前登录用户的id
      const isAdmin = ref(localStorage ? localStorage.getItem('roleId') === '2' : false); // 检查是否为管理员
      return {
        isCollapse,
        userId,
        jwt,
        isAdmin
      };
    }
  }
  </script>
  
  <style scoped>
 .el-header {
    position: relative;
    background-color: var(--el-color-primary-light-7);
    color: var(--el-text-color-primary);
  }
 .el-aside {
    color: var(--el-text-color-primary);
  }
 .el-menu {
    border-right: none;
  }
 .el-main {
    padding: 0;
  }
 .toolbar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    right: 20px;
  }
  </style>