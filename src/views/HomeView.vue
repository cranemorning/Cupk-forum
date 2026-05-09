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
        <!--轮播图-->
        <el-carousel :interval="4000" type="card" height="300px" arrow="always" style="margin: 30px;">
          <el-carousel-item v-for="item in photos" :key="item">
            <el-image :src=" item.url " style="height: 300px;width: auto;"></el-image>
          </el-carousel-item>
        </el-carousel>
        <!--文章列表-->
        <div class="articleList">
          <div style="margin: 10px 0; font-size: 24px; padding: 10px 0; border-bottom: 1px solid #ccc; text-align: left;">
            论坛动态
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
            <!--发布者信息-->
            <router-link :to="`/userCenter/${item.userId}`" class="article-link">
              <div class="article-header">
                <el-avatar :src="item.userPic" class="avatar"></el-avatar>
                <div class="meta-data">
                  <div class="nickname">{{ item.nickname }}</div>
                  <div class="updatetime">修改于: {{ item.updateTime }}</div>
                </div>
              </div>
            </router-link>
            <!--文章内容-->
            <router-link :to="`/Article_Detail/${item.id}`" class="article-link">
              <div class="article-title">
                {{item.title}}
              </div>
              <div class="article-content">
                {{ truncateText(item.content, 200) }}
              </div>
              <el-image v-if="item.coverImg!=='' " :src="item.coverImg" class="cover-img"></el-image>
            </router-link>
          </div>
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
  function getAssetsImages(name) {
      return new URL(`../assets/images/${name}`, import.meta.url).href;
  }
const image1=  getAssetsImages('slide_verify_picture/cupk1.jpg');
const image2=  getAssetsImages('slide_verify_picture/cupk1.jpg');
const image3=  getAssetsImages('slide_verify_picture/cupk1.jpg');
const image4=  getAssetsImages('slide_verify_picture/cupk1.jpg');
const image5=  getAssetsImages('slide_verify_picture/cupk1.jpg');
const photos=ref([
      {url:image1},
	    {url:image2},
	    {url:image3},
	    {url:image4},
      {url:image5}   
]);
const tableData=ref([])
//分页栏所需的变量
const currentPage = ref(1)
const pageSize = ref(5)
const size = ref<ComponentSize>('default')
const background = ref(false)
const disabled = ref(false)
const total=ref(1);
//文章分类变量
const categoryId = ref(-1);
const categoryShow = ref("全部");
export default {    
    components: {//选项式API:vue2中注册组件的方法
        'GW-aside': aside,
        'GW-header': header,
        'GW-footer': footer
    },
    setup(){
      onMounted(() => {
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
      //获取文章列表
      const get_data = () => {
        Request({
          method: 'GET',
          url: "/article/listForAllWithUser",
          params: {
              pageNum: currentPage.value,
              pageSize: pageSize.value,
              categoryId: categoryId.value==-1? null:categoryId.value,
            }
        }).then((response) => {
          const responseData=response.data
          total.value = responseData.data.total;
          tableData.value = responseData.data.items;
          console.log("文章数据:",responseData.data);
          console.log("total:",total.value);
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
        photos,
        tableData,
        categoryId,
        categoryShow,
        //方法
        truncateText,
        categoryChange,
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
  margin-top: 30px;
}

.article-item {
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
  transition: all 0.3s ease;
  animation: article-fade-in 0.6s ease forwards;
}

.article-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}
 
.article-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  transition: all 0.3s ease;
}
 
.avatar {
  margin-right: 15px;
  transition: all 0.3s ease;
}

.avatar:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}
 
.meta-data {
  display: flex;
  flex-direction: column;
}
 
.nickname {
  font-weight: bold;
  font-size: 16px;
  transition: all 0.3s ease;
}

.nickname:hover {
  color: #628ae8;
}
 
.updatetime {
  color: gray;
  font-size: 12px;
  margin-top: 5px;
}

.article-link {
  text-decoration: none; /* 去除下划线 */
  color: inherit; /* 继承父元素的颜色，或根据需要设置特定颜色 */
  display: block;
  transition: all 0.3s ease;
}

.article-link:hover {
  color: #4b78a8; /* 悬停时改变文本颜色，这里使用的是蓝色 */
}

.article-title {
  margin-bottom: 15px;
  line-height: 1.5;
  font-weight: bold; /* 设置字体加粗 */
  font-size: 20px;
  transition: all 0.3s ease;
}

.article-title:hover {
  color: #628ae8;
  transform: translateX(5px);
}
 
.article-content {
  line-height: 1.5;
  transition: all 0.3s ease;
}
 
.cover-img {
  width: auto;
  height: 250px;
  border-radius: 5px;
  transition: all 0.3s ease;
  margin-top: 15px;
}

.cover-img:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
}

/* 轮播图动画 */
:deep(.el-carousel__item) {
  transition: all 0.5s ease;
}

:deep(.el-carousel__item h3) {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s ease;
}

:deep(.el-carousel__item.is-active h3) {
  opacity: 1;
  transform: translateY(0);
}

/* 动画效果 */
@keyframes article-fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 为不同的文章项添加延迟动画 */
.article-item:nth-child(1) { animation-delay: 0.1s; }
.article-item:nth-child(2) { animation-delay: 0.2s; }
.article-item:nth-child(3) { animation-delay: 0.3s; }
.article-item:nth-child(4) { animation-delay: 0.4s; }
.article-item:nth-child(5) { animation-delay: 0.5s; }

/* 分页按钮动画 */
:deep(.el-pagination__item) {
  transition: all 0.3s ease;
}

:deep(.el-pagination__item:hover) {
  transform: scale(1.1);
}

:deep(.el-pagination__item.is-current) {
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(98, 138, 232, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(98, 138, 232, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(98, 138, 232, 0);
  }
}
</style>