<template>
  <el-header style="background-color:#6e1a6f">
    <div class="toolbar">
      <el-avatar :size="40" :src="userPic" @error="errorHandler" style="cursor: pointer;" v-if="jwt.hasToken()" @click="router.replace('/userAvatar')">
      <img
        src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
      />
      </el-avatar>
      <el-button type="success" :icon="User" round @click="router.replace('/login')" v-if="!jwt.hasToken()">登录</el-button>
      <el-button :icon="User" round @click="router.replace('/userInfo')" v-if="jwt.hasToken()">{{nickname}}</el-button>
      <el-dropdown v-if="jwt.hasToken()">
        <el-icon style="margin: 10px;color: white;"><MoreFilled /></el-icon>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="jwt.logout()">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script setup>
import jwt from '../../jwt';
import { MoreFilled, User } from '@element-plus/icons-vue';
import router from '../../router/index.js';
import { ref, onMounted, onUnmounted, watch } from 'vue';
const errorHandler = () => true
// 使用ref确保nickname是响应式的
const nickname = ref(localStorage.getItem('nickname'));
const userPic = ref(localStorage.getItem('userPic'));
const userId=localStorage.getItem('userId');//获取当前登录用户的id

// 监听localStorage变化，更新用户信息
const updateUserInfo = () => {
  nickname.value = localStorage.getItem('nickname');
  userPic.value = localStorage.getItem('userPic');
  console.log('Header组件更新用户信息:', { nickname: nickname.value, userPic: userPic.value });
};

// 组件挂载时更新用户信息
onMounted(() => {
  updateUserInfo();
  // 监听localStorage变化
  window.addEventListener('storage', updateUserInfo);
});

// 组件卸载时移除监听
onUnmounted(() => {
  window.removeEventListener('storage', updateUserInfo);
});

// 监听路由变化，确保用户信息始终最新
watch(() => router.currentRoute.value, () => {
  updateUserInfo();
});
</script>

<style scoped>
.el-header {
  text-align: right;
  font-size: 12px;
  position: relative;
  background-color: var(--el-color-primary-light-7);
  color: var(--el-text-color-primary);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 20px;
  gap: 10px; /* 添加间距以便元素之间有一定的间隔 */
}

/* 你可以添加更多样式来美化昵称的显示 */
.toolbar span {
  font-weight: bold;
  color: #333;
}

/* 头像悬停效果 */
:deep(.el-avatar) {
  transition: all 0.3s ease;
}

:deep(.el-avatar):hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* 按钮悬停效果 */
:deep(.el-button) {
  transition: all 0.3s ease;
}

:deep(.el-button):hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* 下拉菜单动画 */
:deep(.el-dropdown-menu) {
  animation: dropdown-fade-in 0.3s ease;
}

@keyframes dropdown-fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>