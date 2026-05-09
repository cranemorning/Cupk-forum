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
          <el-breadcrumb-item>头像修改</el-breadcrumb-item>
        </el-breadcrumb>
        <!--更换头像-->
            <el-card style="box-shadow: 0 0px 16px rgba(0,0,0,0.1); margin: 20px auto;">
                <template #header>
                    <div class="header">
                        <span>更换头像</span>
                    </div>
                </template>
                <el-row>
                    <el-col :span="12">
                        <el-upload 
                            ref="uploadRef"
                            class="avatar-uploader" 
                            :show-file-list="false"
                            :auto-upload="true"
                            action="/api/upload"
                            name="file"
                            :headers="{'Authorization':token}"
                            :on-success="uploadSuccess"
                            >
                            <img v-if="imgUrl" :src="imgUrl" class="avatar" />
                            <img v-else src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" width="278" />
                        </el-upload>
                        <br />
                        <el-button type="primary" :icon="Plus" size="large"  @click="uploadRef.$el.querySelector('input').click()">
                            上传图片
                        </el-button>
                        <el-button type="success" :icon="Upload" size="large" @click="updateAvatar">
                            使用该头像
                        </el-button>
                    </el-col>
                </el-row>
            </el-card>
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
    import {ArrowRight } from '@element-plus/icons-vue'
    import { Plus, Upload } from '@element-plus/icons-vue'
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
        const uploadRef = ref()
        //用户头像地址
        const imgUrl= ref(localStorage.getItem("userPic"))
        const token =ref(localStorage.getItem("Authorization"))
        //图片上传成功的回调函数
//上传成功的回调函数
        const uploadSuccess = (result)=>{
            console.log('上传成功返回结果:', result);
            // 使用相对路径，通过Vite代理访问
            imgUrl.value = result.data;
            console.log('设置imgUrl为:', imgUrl.value);
        }

        //头像修改
        const updateAvatar = async ()=>{
            //修改用户头像数据
            console.log("用户头像:",imgUrl.value);
            //传给后端
            Request({
                method: 'patch',
                url: "/user/updateAvatar",
                params:{
                    avatarUrl:imgUrl.value
                }
            }).then((response) => {
                ElMessage.success("头像更新成功");
                jwt.getProfile();//更新localstorage的用户信息
                // 手动更新本地ref值，确保UI立即更新
                setTimeout(() => {
                    imgUrl.value = localStorage.getItem("userPic");
                }, 100);
                return response;
            }).catch((error) => {
                ElMessage.error("更新失败")
                console.log('头像更新报错', error.message);
            });
        }
        //返回 暴露给模板
        return{
            Plus,
            Upload,
            ArrowRight,
            updateAvatar,
            uploadSuccess,
            imgUrl,
            token,
            uploadRef
        }
      }
  }
  //
  </script>
  <!--样式表-->
  <style lang="scss" scoped>
   @import url('../assets/Mycss.css');
  .el-carousel{
    margin: 30px;
  }
  
  
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
  }

  .avatar-uploader {
    :deep() {
        .avatar {
            width: 278px;
            height: 278px;
            display: block;
        }

        .el-upload {
            border: 1px dashed var(--el-border-color);
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: var(--el-transition-duration-fast);
        }

        .el-upload:hover {
            border-color: var(--el-color-primary);
        }

        .el-icon.avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 278px;
            height: 278px;
            text-align: center;
        }
    }
}
  </style>