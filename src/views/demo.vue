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
          
        </el-main>
        <GW-footer/>
      </el-container>
    </el-container>
  </template>
  
  <script lang="ts">
    import aside from '../components/aside.vue';
    import header from '../components/header.vue';
    import footer from '../components/footer.vue';
    import{onMounted, reactive, ref} from 'vue';
    import { ElMessage, ElMessageBox } from 'element-plus';
    import type { Action } from 'element-plus'
    import { message } from 'ant-design-vue';
    import Request from '@/api/request';
    import jwt from '../../jwt';
    import type { ComponentSize } from 'element-plus'

  export default {    
      components: {//选项式API:vue2中注册组件的方法
          'GW-aside': aside,
          'GW-header': header,
          'GW-footer': footer
      },
      setup(){
        onMounted(() => {
          
        });
        
        return{
          
        }
      }
  }
  //
  </script>
  <!--样式表-->
  <style scoped>
   @import url('../assets/Mycss.css');
  </style>