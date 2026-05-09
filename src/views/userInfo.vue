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
          <!--面包屑-->
        <el-breadcrumb :separator-icon="ArrowRight" style="margin: 20px;">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>用户信息</el-breadcrumb-item>
          <el-breadcrumb-item>基本信息检查与修改</el-breadcrumb-item>
        </el-breadcrumb>
        <!--个人信息-->
          <div class="container">
            <div style="margin: 30px;">个人信息</div>
            <el-form :model="form" label-width="auto" style="max-width: 600px">
              <el-form-item label="昵称">
                <el-input v-model="form.nickname"/>
              </el-form-item>
              <el-form-item label="账号">
                <el-input disabled v-model="form.username"/>
              </el-form-item>
              <el-form-item label="性别">
                <el-input v-model="form.sex" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="form.email" />
              </el-form-item>
              <el-form-item label="个人简介">
                  <el-input
                    type="textarea"
                    :rows="4"
                    placeholder="你的个人简介"
                    v-model="form.profile">
                  </el-input>
                </el-form-item>
              <el-button @click="formSubmit()" type="primary" plain style="margin: 50px;">确认更改</el-button>
              <el-button @click="formReset()" type="plain" plain style="margin: 50px;" >重置</el-button>
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
          <h2>真的要修改吗！</h2>
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
  import type { ComponentSize } from 'element-plus'
  export default {
    setup(){
      let Confirm_dialogVisible=ref(false);
      const form=ref({
      id:1,//int
      username:"null",
      password:"null",
      nickname:"null",
      sex:"",
      email:"null",
      userPic:"null",
      profile:"",
      create_time:"",
      update_time:""
      });
      const get_data = async() => {
      const UUUurl = "/user/userInfo";
      console.log("get_data:");
        Request({
          method: 'GET',
          url: UUUurl,
        }).then((response) => {
          form.value = response.data.data;
          console.log("get的数据:",form.value)
          return response;
        }).catch((error) => {
          console.log('get报错', error.message);
        });
      };
      const formReset=async()=>{
        console.log("Reset:");
        //调用get_data 重置form数据
        await get_data();
        console.log("get_data完成")
      };
      const formSubmit=()=>{
        console.log("即将提交的数据:",form.value);
        Confirm_dialogVisible.value=true;
      };
      const formSubmit_Confirm=()=>{
        Confirm_dialogVisible.value = false;//confirm对话框隐藏
        const UUUurl = "/user/update";
        Request({
          method: 'PUT',
          url: UUUurl,
          data: {
            id: form.value.id,
            nickname: form.value.nickname,
            sex:form.value.sex,
            profile:form.value.profile,
            email:  form.value.email,
        }
        }).then((response) => {
          ElMessage.success("基本信息更新成功")
          jwt.getProfile();//更新localstorage的用户信息
          return response;
        }).catch((error) => {
          ElMessage.error("更新失败")
          console.log('更新用户信息报错:', error.message);
        });
      };
      onMounted(() => {
        get_data();
      });
      return {
        ArrowRight,
        Confirm_dialogVisible,
        form,
        formReset,
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