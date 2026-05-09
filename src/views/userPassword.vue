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
          <el-breadcrumb-item>用户密码修改</el-breadcrumb-item>
        </el-breadcrumb>
        <!--个人信息-->
          <div class="container">
            <div style="margin: 30px;">密码</div>
            <el-form :model="form" label-width="auto" style="max-width: 600px">
                <el-form-item label="原密码">
                    <el-input type="password" v-model="form.old_pwd"/>
                </el-form-item>
                <el-form-item label="新密码">
                    <el-input type="password" v-model="form.new_pwd"/>
                </el-form-item>
                <el-form-item label="再次输入新密码">
                    <el-input type="password" v-model="form.re_pwd" />
                </el-form-item>
                <el-button @click="formSubmit()" type="primary" plain style="margin: 50px;">确认更改密码</el-button>
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
          <h2>确认修改密码?</h2>
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
      old_pwd:"",
      new_pwd:"",
      re_pwd:""
      });
      const formSubmit=()=>{
        console.log("即将提交的数据:",form.value);
        if(form.value.new_pwd!==form.value.re_pwd){
          ElMessage.error("两次新密码输入不一致!")
          form.value.re_pwd ="";
          form.value.new_pwd="";
        }else
        Confirm_dialogVisible.value=true;
      };
      const formSubmit_Confirm=()=>{
        Confirm_dialogVisible.value = false;//confirm对话框隐藏
        Request({
                method: 'Patch',
                url: "/user/updatePwd",
                data:{
                    old_pwd:form.value.old_pwd,
                    new_pwd:form.value.new_pwd,
                    re_pwd:form.value.re_pwd,
                }
            }).then((response) => {
                const responseData =response.data;
                if(responseData.code===0)
                ElMessage.success("密码修改成功");
                else
                ElMessage.error(responseData['message'])
                form.value={//清空密码栏
                    old_pwd:"",
                    new_pwd:"",
                    re_pwd:""
                };
                return response;
            }).catch((error) => {
                ElMessage.error("修改失败")
                console.log('密码修改报错', error.message);
            });
      };
      onMounted(() => {

      });
      return {
        ArrowRight,
        Confirm_dialogVisible,
        form,
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