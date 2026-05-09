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
              <el-breadcrumb-item>文章管理</el-breadcrumb-item>
              <el-breadcrumb-item>我的文章</el-breadcrumb-item>
            </el-breadcrumb>         
            <!--分类查询-->
            <el-form @submit.native.prevent :model="form" label-width="auto" style="margin:30px;display: flex;"> 
              <el-text class="mx-1" style="margin-right: 10px;">文章分类:</el-text>
              <el-dropdown split-button type="plain" @command="categoryChange">{{categoryShow}}
                <template #dropdown>
                  <el-dropdown-menu :data="tableData">
                    <el-dropdown-item command=-1>全部</el-dropdown-item>
                    <el-dropdown-item command=1>美食</el-dropdown-item>
                    <el-dropdown-item command=2>人文</el-dropdown-item>
                    <el-dropdown-item command=3>军事</el-dropdown-item>
                    <el-dropdown-item command=4>游戏</el-dropdown-item>
                    <el-dropdown-item command=5>日常</el-dropdown-item>
                    <el-dropdown-item command=0>其他</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              <span style="margin-left: 30px;"></span>
              <el-text class="mx-2" style="margin-right: 10px;">文章状态:</el-text>
              <el-dropdown split-button type="primary" @command="stateChange">{{state}}
                <template #dropdown>
                  <el-dropdown-menu :data="tableData">
                    <el-dropdown-item command="全部">全部</el-dropdown-item>
                    <el-dropdown-item command="已发布">已发布</el-dropdown-item>
                    <el-dropdown-item command="草稿">草稿</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </el-form>        
            <!--数据展示-->
            <el-table v-loading="false" :data="tableData"  max-height="800" border style="width: 100%;margin-bottom: 20px;">
              <el-table-column label="标题" width="200">
                <template #default="scope">
                  <router-link :to="`/Article_Detail/${scope.row.id}`" style="text-decoration: none; /* 去除下划线 */">
                    {{ scope.row.title }}
                  </router-link>
                </template>
              </el-table-column>
              <el-table-column label="内容" width="410">
                <template #default="scope">
                  {{ scope.row.content.length > 30 ? scope.row.content.substring(0, 30) + '...' : scope.row.content }}
                </template>
              </el-table-column>
              <el-table-column prop="updateTime" label="更新时间" width="180" />
              <el-table-column prop="createTime" label="发布时间" width="180" />
              <el-table-column prop="state" label="状态" width="100" >
                <template #default="scope">
                  <span v-if="scope.row.state=='已发布'" style="background-color:#5edc92;border-radius: 10%;color: white;font-weight: bold;">{{ scope.row.state }}</span>
                  <span v-else style="background-color:#d4e32e;border-radius: 10%;color: white;font-weight: bold;" >{{ scope.row.state }}</span>
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="操作" width="120"> 
                <template #default="scope">
                  <el-button link type="primary" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                  <el-button link type="primary" size="small" @click="DeleteConfirm(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!--编辑文章对话框-->
            <el-dialog
              v-model="EditDialogVisible"
              title="文章修改"
              width="50%"
              :before-close="handleEditClose">
            <el-form :model="form" label-width="auto" style="max-width: 600px"> 
              <!--可编辑信息-->
              <el-form-item label="标题">
                <el-input v-model="form.title" />
              </el-form-item>
              <el-form-item label="内容">
                <el-input type="textarea" :rows="5" maxlength="3000"
                style="width: 100%" v-model="form.content"/>
              </el-form-item>
              <el-form-item label="封面">
                            <el-upload 
                            ref="uploadRef"
                            class="coverImg-uploader" 
                            :show-file-list="false"
                            :auto-upload="true"
                            action="/api/upload"
                            name="file"
                            :headers="{'Authorization':token}"
                            :on-success="uploadSuccess"
                            >
                            <img v-if="form.coverImg" :src="form.coverImg" class="coverImg" />
                            <img v-else src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" width="278" />
                        </el-upload>
                        <br />
                        <el-button type="primary" :icon="Plus" size="large"  @click="uploadRef.$el.querySelector('input').click()" style="margin: 30px;">
                            上传图片
                        </el-button>
              </el-form-item>
            </el-form>
              <template #footer>
                <div class="dialog-footer">
                  <el-button type="success" v-if="form.state=='草稿'" @click="form.state='已发布',EditConfirm()">发布该文章</el-button>
                  <el-button type="primary" @click="EditConfirm">确认修改</el-button>
                </div>
              </template>
            </el-dialog> 
  <!--分页-->
  <div class="demo-pagination-block">
  <el-pagination
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    :size="size"
    :disabled="disabled"
    :background="background"
    layout="prev, pager, next, jumper"
    :total="total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</div>
        </el-main>
        <GW-footer/>
      </el-container>
    </el-container>
  </template> 
  <script lang="ts">
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  import aside from '../components/aside.vue';
  import header from '../components/header.vue';
  import footer from '../components/footer.vue';
  import{onMounted, reactive, ref} from 'vue';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import type { Action } from 'element-plus'
  import {ArrowRight } from '@element-plus/icons-vue'
  import { ArrowDown } from '@element-plus/icons-vue'
  import { Plus, Upload } from '@element-plus/icons-vue'
  import { message } from 'ant-design-vue';
  import Request from '@/api/request';
  import jwt from '../../jwt';
  import type { ComponentSize } from 'element-plus'
import { RouterLink } from 'vue-router';
//分页栏所需的变量
const currentPage = ref(1)
const pageSize = ref(5)
const size = ref<ComponentSize>('default')
const background = ref(false)
const disabled = ref(false)
const total=ref(1);
//文章
const categoryId = ref(-1);
const categoryShow = ref("全部");
const state = ref("全部");
//上传图片所需变量
const token = ref(localStorage.getItem("Authorization"))
const uploadRef = ref()
  export default {
    setup(){
      let EditDialogVisible=ref(false);
      //是否弹出对话框
    const tableData = ref([]);//文章数据
    const form=ref({
        id:null,
        content:"",
        title:"",
        coverImg:"",
        state:"",
        createTime:"",
        updateTime:"",
        categoryId:null
    });
    //图片上传成功的回调函数
    const uploadSuccess = (result)=>{
      form.value.coverImg = result.data;
    }
      //处理编辑
      const handleEdit = (index, row) => { // 处理编辑
          console.log("当前行数据:", row);
          form.value = JSON.parse(JSON.stringify(row)); // 把表格数据复制到表单对象上去
          console.log("当前编辑的数据", form.value);
          EditDialogVisible.value = true;
        };
      //确认编辑
      const EditConfirm = () => {
      EditDialogVisible.value = false;
      console.log("EditConfirm");
      console.log("向后端提交的数据", form.value);
      const UUUurl = '/article/update';
      Request({
        method: 'PUT',
        url: UUUurl,
        data: {
          id:form.value.id,
          title:form.value.title,
          content:form.value.content,
          coverImg:form.value.coverImg,
          state:form.value.state,
          categoryId:form.value.categoryId
        }
      }).then(response => {
        get_data();
        return response;
      }).catch((error) => {
        get_data();
        console.log(error);
      });
    };
    //点击删除
    const DeleteConfirm = (index, row)=>{
      console.log("当前行数据:", row);
      form.value = JSON.parse(JSON.stringify(row)); // 把表格数据复制到表单对象上去
      console.log("即将删除的数据", form.value);
      ElMessageBox.confirm(
      '确实要删除?',
      'Warning',
      {
        confirmButtonText: '确认',
        cancelButtonText: '不要',
        type: 'warning',
      }
    )
      .then(() => {
        handleDelete(index, row);//确认删除
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消删除',
        })
      })    
    };
    //删除处理
    const handleDelete = (index, row) => { // 删除
      const UUUurl = '/article/delete';
      Request({
        method: 'delete',
        url: UUUurl,
        params:{
          id:form.value.id
        }
      }).then(response => {
        ElMessage.success("删除成功")
        get_data();
        return response;
      }).catch((error) => {
        get_data();
        console.error(error);
      });
    };
//分页
const handleSizeChange = (val: number) => {
console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  console.log("当前页:",currentPage.value)
  get_data();
}
//处理文章分类切换
const categoryChange=(command: number)=>{
  categoryId.value = command;
  currentPage.value=1;//每次切换显示后 当前页面都为1
  if(categoryId.value==-1){
    categoryShow.value = "全部";
  }else if(categoryId.value==0){
    categoryShow.value = "其他";
  }else if(categoryId.value==1){
    categoryShow.value = "美食";
  }else if(categoryId.value == 2){
    categoryShow.value = "人文";
  }else if(categoryId.value == 3){
    categoryShow.value = "军事";
  }else if(categoryId.value == 4){
    categoryShow.value = "游戏";
  }else if(categoryId.value == 5){
    categoryShow.value = "日常";
  }
  console.log("当前文章分类:",categoryId.value,categoryShow.value)
  get_data();
  }//
//处理文章状态切换
const stateChange=(command: string)=>{
  state.value = command;
  currentPage.value=1;//每次切换显示后 当前页面都为1
  console.log("当前文章状态:",state.value)
  get_data();
  }//
  const get_data = () => {
    const UUUurl ="/article/list"
      Request({
        method: 'GET',
        url: UUUurl,
        params: {
            pageNum: currentPage.value,
            pageSize: pageSize.value,
            categoryId: categoryId.value==-1? null:categoryId.value,
            state: state.value=='全部'? null:state.value
          }
      }).then((response) => {
        const responseData=response.data
        total.value = responseData.data.total;
        tableData.value = responseData.data.items;
        console.log("get的数据:",responseData.data,"\n");
        console.log("total:",total.value,"\n");
        console.log("tableData:",tableData.value);
        return response;
      }).catch((error) => {
        console.log('get报错', error.message);
      });
    };
    //关闭编辑dialog
    const handleEditClose = (done: () => void) => {
      ElMessageBox.confirm('确定要退出编辑?') // 处理表单取消后询问是否需要关闭表单
          .then(() => {
            done();
          })
          .catch(() => {
            // catch error
          });
    };
    //查询
    const handleQuery=()=>{
        const UUUurl= "";
    }
    //页面初始
    onMounted(() => {
      get_data();
    });

    return {
      currentPage,
      pageSize,
      size,
      background,
      disabled,
      total,
      handleSizeChange,
      handleCurrentChange,
      //
      categoryId,
      categoryShow,
      state,
      //
      tableData,
      form,
      token,
      uploadRef,
      EditDialogVisible,
      uploadSuccess,
      get_data,
      handleQuery,
      categoryChange,
      stateChange,
      handleEdit,
      handleEditClose,
      EditConfirm,
      DeleteConfirm,
      //
      ArrowRight,
      ArrowDown,
      Plus
    };
  },
  components: {
    'GW-aside': aside,
    'GW-header': header,
    'GW-footer': footer
  }
};
  </script>
  <!--样式表-->
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

        .el-icon.coverImg-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 278px;
            height: 278px;
            text-align: center;
        }
    }
}
  </style>