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
          <router-view :key="$route.fullPath" />
          <!--用户信息卡片-->
            <div class="user-info-card">
                <el-col :span="4" class="user-pic-col">
                    <el-avatar :src="user.userPic==null || user.userPic==''? 'https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png':user.userPic" class="avatar"></el-avatar>
                </el-col>
                <el-col :span="10" class="user-info-col">
                    <div class="user-nickname">
                    {{ user.nickname }}
                    </div>
                    <div class="user-email">
                    {{ (user.profile==null||user.profile=="") ? "此人很懒,没有个人简介....":user.profile }}
                    </div>
                </el-col>
                <el-col :span="10" class="user-info-col">
                  <div class="user-email">
                    性别:{{ (user.sex==null||user.sex=="") ? "此人很懒,甚至没有性别....":user.sex }}
                  </div>
                  <div class="user-email">
                    联系邮箱:{{ (user.email==null||user.email=="") ? "此人很懒,没有邮箱....":user.email }}
                  </div>
                </el-col>
            </div>  
          <!--文章列表-->
          <div class="articleList">
            <div style="margin: 10px 0; font-size: 24px; padding: 10px 0; border-bottom: 1px solid #ccc; text-align: left;">
                ta的文章
                <!--文章分类-->
                <el-dropdown split-button type="plain" @command="categoryChange">{{categoryShow}}
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item command=-1>全部</el-dropdown-item>
                      <el-dropdown-item command=1>美食</el-dropdown-item>
                      <el-dropdown-item command=2>人文</el-dropdown-item>
                      <el-dropdown-item command=3>军事</el-dropdown-item>
                      <el-dropdown-item command=4>游戏</el-dropdown-item>
                      <el-dropdown-item command=5>日常</el-dropdown-item>
                      <el-dropdown-item command=0>其它</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
            </div>
            <!--空-->
            <span v-if="tableData.length==0" style="">空空如也。。</span>
            <!--文章-->
            <div v-for="(item, index) in tableData" :key="index" class="article-item">
              <!--文章内容-->
              <router-link :to="`/Article_Detail/${item.id}`" class="router-link">
                <div class="article-title">
                  {{item.title}}
                </div>
                <div class="article-content">
                  {{ truncateText(item.content, 200) }}
                </div>
                <el-image v-if="item.coverImg!=='' " :src="item.coverImg" class="cover-img"></el-image>
              </router-link>
            </div>
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
    import{onMounted, reactive, ref} from 'vue';
    import { ElMessage, ElMessageBox } from 'element-plus';
    import type { Action } from 'element-plus'
    import { message } from 'ant-design-vue';
    import Request from '@/api/request';
    import jwt from '../../jwt';
    import type { ComponentSize } from 'element-plus'
    import { useRoute,useRouter } from 'vue-router'
  export default {    
      components: {//选项式API:vue2中注册组件的方法
          'GW-aside': aside,
          'GW-header': header,
          'GW-footer': footer
      },
      setup(){
        // 使用 useRoute 钩子获取当前路由对象
        const route = useRoute();
        const router = useRouter();
        // 从路由对象中获取 id 参数
        const userPageId = route.params.userId;
        //分页栏所需的变量
        const currentPage = ref(1)
        const pageSize = ref(5)
        const size = ref<ComponentSize>('default')
        const background = ref(false)
        const disabled = ref(false)
        const total=ref(1);
        //文章
        const tableData=ref([])
        //用户
        const user=ref({
          id:null,
          username:"username(null)",
          nickname:"nickname(null)",
          sex:"这个人还没有性别。。。",
          email:"email(null)",
          profile:"这个人很懒,没有简介..",
          userPic:"https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png",
        })
        //文章分类变量
        const categoryId = ref(-1);
        const categoryShow = ref("全部");
        onMounted(() => {
            console.log("当前用户页所属用户ID:",userPageId)
            getUserInfo();
          get_data();
        });
        //截断字符串
        function truncateText(text, length) {
        if (text.length > length) {
          return text.substring(0, length) + '...';
        }
        return text;
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
        }
        //分页
        const handleSizeChange = (val: number) => {
        console.log(`${val} items per page`)
        }
        const handleCurrentChange = (val: number) => {
          console.log("当前页:",currentPage.value)
        get_data()
        }
        //获取用户文章列表
        const get_data = () => {
          Request({
            method: 'GET',
            url: "/article/listById",
            params: {
                pageNum: currentPage.value,
                pageSize: pageSize.value,
                userId: userPageId,
                categoryId: categoryId.value==-1? null:categoryId.value,
                state:"已发布"
            }
          }).then((response) => {
            const responseData=response.data;
            total.value = responseData.data.total;
            tableData.value = responseData.data.items;
            console.log("文章数据:",responseData.data);
            console.log("total:",total.value);
            return response;
          }).catch((error) => {
            console.log('get报错', error.message);
          });
        };
        //获取用户信息
        const getUserInfo = () => {
          Request({
            method: 'GET',
            url: "/user/userInfoById",
            params: {
                id:userPageId
              }
            }).then((response) => {
              const responseData=response.data
              user.value = responseData.data;
              console.log("文章用户信息:",responseData.data,"\n");
              return response;
            }).catch((error) => {
              console.log('get报错', error.message);
            });
        };
        //返回 暴露给模板
        return{
          //分页数据
          currentPage,
          pageSize,
          size,
          background,
          disabled,
          total,
          handleSizeChange,
          handleCurrentChange,
          //资源
          tableData,
          user,
          categoryId,
          categoryShow,
          //方法
          categoryChange,
          truncateText,
        }
      }
  }
  //
  </script>
  <!--样式表-->
  <style scoped>
   @import url('../assets/Mycss.css');
   .articleList{
    width: 90%;
    background-color: #fff; /* 背景颜色设置为白色 */
    border-radius: 30px; /* 圆角半径设置为15px */
    box-shadow: 0 8px 8px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
    padding: 20px; /* 内边距设置为20px */
    margin: 20px; /* 外边距设置为20px */
    }

.article-item {
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.router-link {
  text-decoration: none; /* 去除下划线 */
  color: inherit; /* 继承父元素的颜色，或根据需要设置特定颜色 */
}

.router-link:hover {
  color: #4b78a8; /* 悬停时改变文本颜色，这里使用的是蓝色 */
  background-color: #f8f9fa; /* 悬停时添加淡灰色背景，可选 */
  /* 你可以根据需要添加更多样式，比如边框、阴影等 */
}

.article-title {
  margin-bottom: 15px;
  line-height: 1.5;
  font-weight: bold; /* 设置字体加粗 */
  font-size: 20px;
}
 
.article-content {
  line-height: 1.5;
}
 
.cover-img {
  width: auto;
  height: 250px;
  border-radius: 5px;
}

.user-info-card {
    width: 90%;
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin: 20px;
  display: flex;
  align-items: center;
}
 
.user-pic-col {
  margin-left: 30px;
  display: flex;
}
 
.avatar {
    width: auto;
  height: 100px;
}
 
.user-info-col {
  display: flex;
  flex-direction: column;
}
 
.user-nickname {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}
 
.user-email {
  font-size: 16px;
  color: #666;
}
  </style>