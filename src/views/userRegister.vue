<template>
    <el-container class="layout-container-demo" style="height: auto">
      
      <GW-aside />
      <el-container>
        <!--多加了一个header标签 否则不垂直排列(element的锅)-->
        <el-header style="position: relative;
          background-color: #6e1a6f;
          color: var(--el-text-color-primary);">
          <GW-header />
        </el-header>
        <el-main style="padding: 0;">
          <div class="container">
            <div style="margin: 30px;">注册新账户</div>
            <el-form :model="form" label-width="auto" style="max-width: 600px" :rules="rules" ref="formRef">
                <el-form-item label="账号" prop="username">
                    <el-input v-model="form.username"/>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="form.password"/>
                </el-form-item>
                <el-form-item label="再次确认密码" prop="passwordConfirm">
                    <el-input type="password" v-model="form.passwordConfirm"/>
                </el-form-item>
                <el-form-item label="昵称" prop="nickname">
                    <el-input  v-model="form.nickname" />
                </el-form-item>
                <el-button @click="formSubmit()" type="primary" plain style="margin: 50px;">确认注册</el-button>
            </el-form>
          </div>

          <el-dialog
            style="display: flex; /* 启用Flexbox布局 */  
            flex-direction: column; /* 设置主轴方向为垂直方向 */  
            align-items: center; /* 在交叉轴上居中对齐子元素（这里是水平居中，因为主轴是垂直的） */  
            justify-content: center"
            v-model="Confirm_dialogVisible"
            width="400"
          >
          <h2>确认要注册?</h2>
          <div class="dialogConfirm">
            <el-button type="primary" @click="formSubmit_Confirm">确认</el-button>
            <el-button @click="Confirm_dialogVisible = false">再想想</el-button>
          </div>
        </el-dialog>
        </el-main>
        <GW-footer/>
      </el-container>
    </el-container>
  </template>
  
  <script lang="ts">
  import {ArrowRight } from '@element-plus/icons-vue'
  import aside from '../components/aside.vue';
  import header from '../components/header.vue';
  import footer from '../components/footer.vue';
  import{onMounted, reactive, ref} from 'vue';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import type { Action } from 'element-plus'
  import { InputPassword, message } from 'ant-design-vue';
  import Request from '@/api/request';
  import jwt from '../../jwt';
  import router from '../../router/index.js'
  import type { ComponentSize } from 'element-plus'
  export default {
    setup(){
      let Confirm_dialogVisible=ref(false);
      const form=ref({
        username:"",
        password:"",
        nickname:"",
        passwordConfirm:""
      });
      const formRef = ref(null);
      const rules = {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 5, max: 16, message: '用户名长度在 5 到 16 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, max: 26, message: '密码长度在 5 到 26 个字符', trigger: 'blur' }
        ],
        passwordConfirm: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: (rule, value, callback) => {
              if (value !== form.value.password) {
                callback(new Error('两次输入密码不一致'));
              } else {
                callback();
              }
            }, trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: '请输入昵称', trigger: 'blur' }
        ]
      };
      const formSubmit=()=>{
        formRef.value.validate((valid) => {
          if (valid) {
            console.log("即将提交的数据:",form.value);
            Confirm_dialogVisible.value=true;
          } else {
            ElMessage.error('表单验证失败');
            return false;
          }
        });
      };
      const formSubmit_Confirm=()=>{
        Confirm_dialogVisible.value = false;//confirm对话框隐藏
        console.log("开始注册，提交数据:", form.value);
        Request({
                method: 'POST',
                url: "/user/register",
                headers:{
                  'Content-Type':'application/x-www-form-urlencoded'
                },
                data: `username=${encodeURIComponent(form.value.username)}&password=${encodeURIComponent(form.value.password)}&nickname=${encodeURIComponent(form.value.nickname)}`
            }).then((response) => {
                console.log("注册响应:", response);
                const responseData = response.data;
                if (responseData) {
                    if(responseData.code===0){
                        ElMessage.success("注册成功!请登录");
                        router.replace({ path: "/login" });//跳转到首页
                    }
                    else {
                        ElMessage.error(responseData.message || "注册失败");
                    }
                } else {
                    ElMessage.error("注册失败: 响应数据格式错误");
                }
                return response;
            }).catch((error) => {
                console.log('注册报错', error);
                ElMessage.error("注册失败: " + (error.message || "网络错误"));
            });
      };
      onMounted(() => {

      });
      return {
        ArrowRight,
        Confirm_dialogVisible,
        form,
        formRef,
        rules,
        formSubmit,
        formSubmit_Confirm
      };
    },
      components: {
          'GW-aside': aside,
          'GW-header': header,
          'GW-footer': footer,
      },
  }
  </script>
  <!--样式表-->
  <style scoped>
  @import url('../assets/Mycss.css');
  </style>