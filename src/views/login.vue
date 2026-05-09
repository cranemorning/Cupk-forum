<template>
  <el-container class="layout-container-demo" style="height: auto">
      <!--login页面无侧边栏-->
    <el-container>
      <!--多加了一个header标签 否则不垂直排列(element的锅)-->
      <el-header style="position: relative;
      background-color: #6e1a6f;
      color: var(--el-text-color-primary);">
        <GW-header />
      </el-header>


      <!--main------------------------------------------------------------------------------------------------------------->


      <el-main style="padding: 0;">
      <div class="box">
        <!-- 遮罩层 -->
       <div class="mask" v-if="Show_verification">
          <!-- 用来放置验证模块 -->
          <div class="verification"> 
            <GW-verification @verified="verified" @close="Show_verification_Change"></GW-verification>
          </div>
       </div>
        <div class="content">
          <div class="login-wrapper">
              <h1>您好,欢迎!</h1>
              <div class="login-form">
                  <div class="username form-item">
                      <span>账号</span>
                      <input type="text" class="input-item" :value="account"
                      @input="account = $event.target.value">
                  </div>
                  <div class="password form-item">
                      <span>密码</span>
                      <input type="password" class="input-item" v-model="password">
                  </div>
                  <button class="login-btn" @click="login_clicked">登 录</button>
                  <div style="text-align: center; margin-top: 20px;">
                    <span @click="router.replace('/userRegister')" style="cursor: pointer; color: #409EFF;">没有账号？点我注册！</span>
                  </div>
              </div>
            </div>
      </div>
  </div>
      </el-main>
      <!--main------------------------------------------------------------------------------------------------------------->
      <!--footer-->
      <GW-footer/>
    </el-container>
  </el-container>
</template>

<script>
import Request from '../api/request'
import { message } from 'ant-design-vue';
import { ref, watchEffect } from 'vue'
import '../assets/css/login.css';//引入样式
//引入组件
import aside from '../components/aside.vue';
import header from '../components/header.vue';
import footer from '../components/footer.vue';
import  Vverify from "../components/verification.vue"; 
import jwt from '../../jwt';
import router from '../../router/index.js'
//
export default {
    components: {
        'GW-aside': aside,
        'GW-header': header,
        'GW-footer': footer,
        'GW-verification':Vverify
    },
    setup()
    {
      let account=ref("");
      let password=ref("");
      let Show_verification = ref(false)
      function Show_verification_Change(isClose){
        Show_verification.value=isClose;
      }
      async function verified (val)  {
        if(val==true)
        {
          
          // //随便设置token 方便调试
          // router.replace({ path: "/home" });
          // jwt.setToken('This is a fuking token')

          Show_verification.value = false
          //交给后端账号密码 获取token->设置token->检查有无token
          console.log("login请求:")
          const UUUurl=ref("/user/login");
          console.log("登录访问Url:",UUUurl.value)
            Request({
                method: 'POST',
                url: UUUurl.value,
                headers:{
                  'Content-Type':'application/x-www-form-urlencoded'
                },
                data: {
                    username:account.value,//账户
                    password:password.value//密码
                }
            }).then(response => {
              const responseData=response.data
              console.log("返回的token:",responseData.data)
              if((responseData.data === null)==false){
                jwt.setToken(responseData.data)//设置token
                jwt.getProfile(); //获取用户信息存储在localstorage中
                //延迟跳转
                setTimeout(() => {
                    router.replace({ path: "/home" }); // 跳转到首页
                }, 100);
              }else{
                message.error("登录失败,请检查用户名和密码")
              }
              return responseData
            }, error => {
            console.log('错误', error.message)
            })
          }
          else
          {
            message.error("验证失败")
            console.log("滑块验证失败!")
          }
      }
      function login_clicked(){
        Show_verification.value = true
      }
      return{
        Show_verification_Change,
        verified,
        login_clicked,
        Show_verification,
        account,
        password,
        jwt,
        router
      }
    }
}
</script>
<!--样式表-->
<style scoped>
.login {
position: relative;
overflow: hidden;
background-color: #5fd05d;
min-height: 100vh; /* 设置最小高度为视口高度的100% */
.cover{
  width: fit-content;
  background-color: aliceblue;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  z-index: 1000;
}
}
.mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 999999;
  background: rgba(0, 0, 0, 0.5);
}
.verification {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
}
</style>