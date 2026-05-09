<template>
  <el-container class="layout-container-demo" style="height: auto">
    <GW-aside />
    <el-container>
      <el-header style="position: relative;
  background-color: #6e1a6f;
  color: var(--el-text-color-primary);">
        <GW-header />
      </el-header>
      <el-main style="padding: 0;">
        <el-breadcrumb :separator-icon="ArrowRight" style="margin: 20px;">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>文章管理</el-breadcrumb-item>
          <el-breadcrumb-item>发布文章</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button @click="$router.push('/home')" type="primary">回到首页</el-button>
        <div class="container">
          <el-steps style="width: 800px" :active="phase" finish-status="success" align-center>
              <el-step title="编辑文章" description="发表你的新闻!" :icon="Edit"/>
          </el-steps>
        </div>
      <div v-if="phase==0" class="container">
          <el-form :model="form" label-width="auto" style="max-width: 600px">
            <div>
              <el-form-item label="文章标题">
              <el-input v-model="form.title"/>
              </el-form-item>
              <el-form-item label="文章分区">
              <el-dropdown split-button @command="categoryChange">{{categoryShow}}
                <template #dropdown>
                  <el-dropdown-menu >
                    <el-dropdown-item command=1>美食</el-dropdown-item>
                    <el-dropdown-item command=2>人文</el-dropdown-item>
                    <el-dropdown-item command=3>军事</el-dropdown-item>
                    <el-dropdown-item command=4>游戏</el-dropdown-item>
                    <el-dropdown-item command=5>日常</el-dropdown-item>
                    <el-dropdown-item command=0>其它</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </el-form-item>
            </div>
            <el-form-item label="内容">
              <el-input type="textarea"
                  placeholder="请输入内容"
                  :rows="10"
                  maxlength="1000"
                  style="width: 400px" v-model="form.content"/>
            </el-form-item>
            <el-form-item label="文章封面">
              <el-upload
                ref="uploadRef"
                class="coverImg-uploader"
                :show-file-list="false"
                :auto-upload="true"
                action="/upload"
                name="file"
                :headers="{'Authorization':token}"
                :on-success="uploadSuccess"
              >
                <img v-if="form.coverImg" :src="form.coverImg" class="coverImg" />
                <img v-else src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" width="278" />
              </el-upload>
              <el-button style="margin: 30px;" type="primary" :icon="Plus" size="large" @click="triggerUpload">
                  上传图片
              </el-button>
            </el-form-item>
          </el-form>

          <div>
            <el-button @click="phase=1;postDraft()"  style="margin: 50px;">保存为草稿</el-button>
            <el-button @click="postArticle()" type="primary" style="margin: 50px;">发布文章</el-button>
          </div>

      </div>
      <div v-if="phase==1" class="container">
          <el-result
          icon="success"
          title="操作已完成"
          sub-title="可返回首页"
          ></el-result>
          <el-button @click="$router.push('/home')" type="primary">回到首页</el-button>
      </div>
      </el-main>
      <GW-footer/>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import aside from '../components/aside.vue';
import header from '../components/header.vue';
import footer from '../components/footer.vue';
import{onMounted, reactive, ref,watch} from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { message } from 'ant-design-vue';
import Request from '@/api/request';
import jwt from '../../jwt';
import type { ComponentSize } from 'element-plus'
import { ElNotification } from 'element-plus'
import {ArrowRight,Edit, Tickets,Stamp,Plus} from '@element-plus/icons-vue'

const watermark_font = reactive({
  color: 'rgba(0, 0, 0, .15)',
})
const currentPage = ref(1)
const pageSize = ref(5)
const size = ref<ComponentSize>('default')
const background = ref(false)
const disabled = ref(false)
const total=ref(1);
const categoryId = ref(0);
const categoryShow = ref("其它");
const token = ref(localStorage.getItem("Authorization"))
const uploadRef = ref()

export default {
  setup(){
    const phase=ref(0);
    const filted=ref(false);
    const form=ref({
        id:null,
        content:"",
        title:"",
        coverImg:"",
        state:"",
        createTime:"",
        updateTime:"",
        categoryId:1
    });

    // 正确触发上传
    const triggerUpload = () => {
      uploadRef.value.$el.querySelector('input').click();
    };

    // 图片上传成功
    const uploadSuccess = (result)=>{
      form.value.coverImg = result.data;
      console.log('上传成功，图片地址：', form.value.coverImg);
      ElMessage.success("图片上传成功！");
    };

    // 发布文章
    const postArticle = () => {
      ElMessageBox.confirm('确定发布文章?','Warning',{
        confirmButtonText: '确认',
        cancelButtonText: '不要',
        type: 'warning',
      }).then(() => {
        Request({
          method: 'POST',
          url: '/article/add',
          data: {
            title:form.value.title,
            content:form.value.content,
            coverImg:form.value.coverImg,
            state:"已发布",
            categoryId:form.value.categoryId
          }
        }).then(() => {
          ElMessage.success("成功发布文章！")
          phase.value=1;
        }).catch((error) => {
          console.log(error);
        });
      }).catch(() => {
        ElMessage.info('取消')
      })
    };

    // 存草稿
    const postDraft = () => {
      Request({
        method: 'POST',
        url: '/article/add',
        data: {
          title:form.value.title,
          content:form.value.content,
          coverImg:form.value.coverImg,
          state:"草稿",
          categoryId:form.value.categoryId
        }
      }).then(() => {
        ElMessage.success("草稿保存成功！");
      }).catch((error) => {
        console.log(error);
      });
    };

    // 分类切换
    const categoryChange=(command: number)=>{
      categoryId.value = command;
      form.value.categoryId=command;
      const map = {0:"其它",1:"美食",2:"人文",3:"军事",4:"游戏",5:"日常"};
      categoryShow.value = map[command];
    };

    onMounted(() => {});
    return {
      currentPage,pageSize,size,background,disabled,total,
      form,watermark_font,ArrowRight,Edit,Tickets,Stamp,Plus,
      phase,filted,postArticle,postDraft,categoryChange,
      categoryId,categoryShow,token,uploadRef,uploadSuccess,triggerUpload
    };
  },
  components: {
    'GW-aside': aside,
    'GW-header': header,
    'GW-footer': footer
  },
}
</script>

<style lang="scss" scoped>
@import url('../assets/Mycss.css');
.coverImg-uploader {
    :deep() {
        .coverImg {
            width: auto;
            max-height: 278px;
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
    }
}
</style>