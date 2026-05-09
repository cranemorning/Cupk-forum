<template>
    <el-container class="layout-container-demo" style="height: auto">
      <GW-aside />
      <el-container>
        <!--多加了一个header标签 否则不垂直排列(element的锅)-->
        <el-header style="position: relative;
        background-color:#6e1a6f;
        color: var(--el-text-color-primary);">
          <GW-header />
        </el-header>
        <el-main style="padding: 0;">
          <el-button :icon="ArrowLeft" @click="goBack" style="margin: 10px;">返回</el-button>
          <el-button type="danger" v-if="roleId=='2' || roleId=='3' " @click="deleteArticle_manager" style="margin: 10px;">删除文章</el-button>
          <el-container class="article-detail">
            <!--发布者信息-->
              <el-header class="article-header">
                    <router-link :to="`/userCenter/${user.id}`" class="article-link">
                      <div class="avatar-wrapper">
                        <el-avatar :src="user.userPic" class="avatar"></el-avatar>
                      </div>
                    </router-link>
                    <div class="user-info-wrapper">
                      <div class="username">{{ user.nickname }}</div>
                      <div class="dates">
                        <span>发布日期: {{ article.createTime }}</span>
                        <span> | 修改日期: {{ article.updateTime }}</span>
                      </div>
                    </div>
              </el-header>
            
            <!--文章主要内容-->
              <el-main class="article-main">
                <h1 class="article-title">{{ article.title }}</h1>
                <span style="margin-right: 20px;">该文评分:  <el-rate v-model="articleRate" :colors="RateColors" disabled show-score @change="RateChange"></el-rate></span>
                <el-image v-if="article.coverImg!=''" class="article-cover" :src="'http://localhost:8080' + article.coverImg || 'https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png'" fit="cover"></el-image>
                <div class="article-content">
                  {{ article.content }}
                </div>
              </el-main>
            <!--对文章进行评论-->
            <div class="commentInputArea" style="margin-top: 20px;">
              <el-input
                type="textarea"
                :rows="4"
                placeholder="留下你的评论！"
                v-model="commentInput">
              </el-input>
              <div style="margin-top: 10px;">
                <el-button type="primary" @click="submitComment" style="margin-right: 50px;">发布评论</el-button>
                <span v-if="RateAvailable" style="margin-right: 20px;">给文章评个分吧!(不评则默认0分)</span>
                <el-rate v-if="RateAvailable" v-model="RateValue" :colors="RateColors" clearable show-text :texts="['烂!', '差', '一般般', '满意', '你这文章,真令我欢喜!']" @change="RateChange"></el-rate>
              </div>
            </div>
          </el-container>
          <!--评论区-->
          <div style="margin: 20px 0;">
            <div style="margin: 10px 0; font-size: 24px; padding: 10px 0; border-bottom: 1px solid #ccc; text-align: left;">评论列表</div>

            <div style="margin: 30px 0; text-align: left;">
              <span v-if="comments.length==0" style="">暂时没有评论,抢个沙发吧~</span>
              <div style="padding: 10px 0;" v-for="item in comments" :key="item.id">
                <div style="display: flex;border-bottom: 1px solid #ccc;">
                  <div style="width: 80px; text-align: right;">
                    <el-avatar :src="item.userPic" class="avatar"></el-avatar>
                  </div>
                  <div style="flex: 1;">
                    <div style="font-weight: bold;">{{ item.userNickname }}</div>
                    <div style="color: gray; font-size: 12px; margin-top: 5px;">{{ item.createTime }}</div>
                    <div style="margin-top: 10px;">{{ item.content }}</div>
                    <div>
                      <el-button type="text" @click="replyClicked(item.id, item.userId,item.userNickname)">回复</el-button>
                      <el-button type="text" v-if="userId_LogNow == item.userId" @click="deleteClicked(item.id, item.userId)" style="margin-left: 50px; color: red;">删除</el-button>
                      <el-button type="text" v-if="roleId=='2'||roleId=='3'" @click="deleteComment_manager(item.id)" style="margin-left: 50px; color: red;">删除(以社管身份)</el-button>
                    </div>
                    <!-- 回复列表 -->
                    
                      <div v-for="sub in item.children" :key="sub.id" style="margin-bottom: 20px;">
                          <div style="display: flex; align-items: center;">
                            <div>
                              <el-avatar :src="sub.userPic" class="avatar" style="height: 40px; width: 40px;"></el-avatar>
                            </div>
                            <div style="margin-left: 10px;">
                              <div style="font-weight: bold;">{{ sub.userNickname }}</div>
                              <div style="color: gray; font-size: 12px; margin-top: 5px;">{{ sub.createTime }}</div>
                            </div>
                          </div>
                          <div style="margin-left: 65px;">
                            <span>回复</span> <span style="color: cornflowerblue">@{{ sub.targetNickname }}: </span> <span>{{ sub.content }}</span>
                            <br>
                            <el-button type="text" @click="replyClicked(item.id, sub.userId,sub.userNickname)">回复</el-button>
                            <el-button type="text" v-if="userId_LogNow == sub.userId" @click="deleteClicked(sub.id, sub.userId)" style="margin-left: 50px; color: red;">删除</el-button>
                            <el-button type="text" v-if="roleId=='2'||roleId=='3'" @click="deleteComment_manager(sub.id)" style="margin-left: 50px; color: red;">删除(以社管身份)</el-button>
                          </div>
                      </div>
                    
                  </div>
                </div>
              </div>
            </div>

            <!--回复对话框-->
            <el-dialog
              v-model="replyDialogVisible"
              width="40%">
              <el-form label-width="auto" style="max-width: 600px"> 
                <!--可编辑信息-->
                <span>回复 @{{ replyTargetNickname }}: </span>
                <el-form-item>
                  <el-input
                    type="textarea"
                    :rows="4"
                    placeholder="对ta说点什么..."
                    v-model="replyInput">
                  </el-input>
                </el-form-item>
              </el-form>
              <template #footer>
                <div class="dialog-footer">
                  <el-button type="primary" @click="replyConfirm">确认回复</el-button>
                </div>
              </template>
            </el-dialog> 

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
    import {ArrowLeft} from '@element-plus/icons-vue'
    import { useRoute,useRouter } from 'vue-router';
  export default {    
      components: {//选项式API:vue2中注册组件的方法
          'GW-aside': aside,
          'GW-header': header,
          'GW-footer': footer
      },
      setup(){
        //获取当前登录用户的角色信息
        const roleId = localStorage.getItem("roleId");
        // 使用 useRoute 钩子获取当前路由对象
        const route = useRoute();
        const router = useRouter();
        // 从路由对象中获取 id 参数
        const articleId = route.params.id;
        const publisherId = ref(null);
        //返回之前的页面
        const goBack = () => {
          router.go(-1); // 返回上一个页面
        };
        //资源定义
        const RateAvailable=ref(true);//当前用户是否可评分
        const userId_LogNow = localStorage.getItem("userId");//获取当前登录用户的id
        const RateValue=ref(0);//用户评分
        const RateColors=ref(['#99A9BF', '#F7BA2A', '#FF9900']);//评分颜色
        const commentInput=ref("");//用户评论
        const replyInput=ref("");//回复
        const replyTargetNickname=ref("null")//回复对象昵称
        const replyDialogVisible = ref(false);//回复弹框是否出现
        const replyCommentId=ref(null);//回复所在的父评论的id
        const replyTargetId=ref(null);//回复对象的id
        const comments=ref([]);//文章评论区
        const user=ref({//用户
          id:null,
          username:"",
          nickname:"null",
          email:"",
          userPic:"https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png",
        })
        const articleRate=ref(null);//用户评分
        const article=ref({//文章
        id:null,
        content:"null",
        title:"null",
        coverImg:"https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png",
        state:"",
        createUser:"",
        createTime:"null",
        updateTime:"null",
        categoryId:null
        });
        //方法
        const RateChange = ()=>{
          console.log("当前评分",RateValue.value,typeof(RateValue.value))
        }
        const getComments = () => {//获取所有评论及留言
          Request({
            method: 'GET',
            url: "/comment/list",
            params: {
                articleId:articleId
              }
            }).then((response) => {
              const responseData=response.data
              comments.value=responseData.data.comments
              articleRate.value = responseData.data.articleRate
              isRateAvailable();
              console.log("评论信息:",responseData);
              console.log("文章评分:",articleRate.value);
              return response;
            }).catch((error) => {
              console.log('get报错', error.message);
            });
        };
        const isRateAvailable = () =>{
          console.log("当前用户id",userId_LogNow)
          comments.value.forEach(comment => {
            console.log("comment.userId",comment.userId)
            if (comment.userId == userId_LogNow) {
              // 如果相同，则设置RateAvailable为false
              RateAvailable.value = false;
              //跳出
            }
          });
        }
        const deleteArticle_manager = () => {//社管删除文章
          ElMessageBox.confirm(
            '是否删除该文章?',
            'Warning',
            {
              confirmButtonText: '确认',
              cancelButtonText: '不要',
              type: 'warning',
            }
          ).then(() => {
              Request({
              method: 'DELETE',
              url: "/ComManager/articleDelete",
              params: {
                  id:article.value.id
                }
              }).then((response) => {
                ElMessage.success("已删除")
                router.replace({ path: "/home" }); // 跳转到首页
                return response;
              }).catch((error) => {
                console.log('删除报错', error.message);
              });
            })
            .catch(() => {
              ElMessage({
                type: 'info',
                message: '取消',
              })
            })
        };
        const deleteComment_manager = (commentId) => {//社管删除评论
          ElMessageBox.confirm(
            '是否删除该评论?',
            'Warning',
            {
              confirmButtonText: '确认',
              cancelButtonText: '不要',
              type: 'warning',
            }
          ).then(() => {
              Request({
              method: 'DELETE',
              url: "/ComManager/commentDelete",
              params: {
                  id:commentId
                }
              }).then((response) => {
                ElMessage.success("已删除")
                getComments();//刷新评论区
                return response;
              }).catch((error) => {
                console.log('删除报错', error.message);
              });
            })
            .catch(() => {
              ElMessage({
                type: 'info',
                message: '取消',
              })
            })
        };
        const deleteClicked = (commentId, targetId) => {//点击删除
          ElMessageBox.confirm(
            '是否删除该评论?',
            'Warning',
            {
              confirmButtonText: '确认',
              cancelButtonText: '不要',
              type: 'warning',
            }
          ).then(() => {
              deleteConfirm(commentId, targetId);//确定删除
            })
            .catch(() => {
              ElMessage({
                type: 'info',
                message: '取消',
              })
            })
        };
        const deleteConfirm = (commentId, targetId) => {//确认删除
          Request({
            method: 'DELETE',
            url: "/comment/delete",
            params: {
                commentId:commentId,
                userId:targetId
              }
            }).then((response) => {
              ElMessage.success("已删除")
              getComments();
              return response;
            }).catch((error) => {
              console.log('删除报错', error.message);
            });
        };
        const replyClicked = (commentId, targetId ,targetNickname) => {//点击回复
          replyDialogVisible.value=true;
          replyTargetNickname.value=targetNickname;
          replyCommentId.value=commentId;
          replyTargetId.value=targetId;
        };
        const replyConfirm = () => {//提交回复
          replyDialogVisible.value=false;//弹框消失
          Request({
            method: 'POST',
            url: "/comment/add",
            data: {
                content:replyInput.value,
                articleId:articleId,
                parentId:replyCommentId.value,
                targetId:replyTargetId.value,
              }
            }).then((response) => {
              ElMessage.success("已提交回复")
              replyInput.value="";//清空输入框
              getComments();
              return response;
            }).catch((error) => {
              console.log('post报错', error.message);
            });
        };
        const submitComment = () => {//提交评论
          Request({
            method: 'POST',
            url: "/comment/add",
            data: {
                content:commentInput.value,
                rate:RateValue.value,
                articleId:articleId,
              }
            }).then((response) => {
              ElMessage.success("已提交评论")
              commentInput.value="";//清空输入框
              getComments();
              return response;
            }).catch((error) => {
              console.log('post报错', error.message);
            });
        };
        const getArticleInfo = () => {
          Request({
            method: 'GET',
            url: "/article/detail",
            params: {
                id:articleId
              }
            }).then((response) => {
              const responseData=response.data
              article.value = responseData.data;
              publisherId.value=article.value.createUser;//获取发布者id
              getUserInfo();
              console.log("文章信息",responseData.data,"\n");
              return response;
            }).catch((error) => {
              console.log('get报错', error.message);
            });
        };
        const getUserInfo = () => {
          Request({
            method: 'GET',
            url: "/user/userInfoById",
            params: {
                id:publisherId.value
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
        onMounted(() => {
          console.log('Article ID:', articleId)
          getArticleInfo();
          getComments();
        });
        //返回 暴露给模板
        return{
          //icons
          ArrowLeft,
          //资源
          roleId,
          article,
          user,
          RateValue,
          RateColors,
          commentInput,
          comments,
          articleRate,
          replyDialogVisible,
          replyInput,
          replyTargetNickname,
          RateAvailable,
          userId_LogNow,
          articleId,
          //方法
          goBack,
          getArticleInfo,
          RateChange,
          submitComment,
          replyClicked,
          replyConfirm,
          deleteClicked,
          deleteConfirm,
          deleteArticle_manager,
          deleteComment_manager
        }
      }
  }
  //
  </script>
  <!--样式表-->
  <style scoped>@import url('../assets/Mycss.css');
  .article-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
 
.article-header {
  display: flex;
  align-items: center;
}
 
.avatar {
  width: 60px;
  height: 60px;
  margin-right: 15px;
}
 
.user-info {
  display: flex;
  flex-direction: column;
}
 
.username {
  font-size: 18px;
  font-weight: bold;
}
 
.dates {
  font-size: 12px;
  color: #888;
}
.article-title {
  font-size: 23px;
  font-weight: bold;
  text-align: center;
}
 
.article-cover {
  width: auto;
  height: 300px;
  margin: 20px;
  object-fit: cover;
}
 
.article-content {
  font-size: 16px;       /* 字体大小设置为16px */
  line-height: 1.5;      /* 行高设置为1.5倍行距 */
  color: #333;           /* 文字颜色设置为深灰色 */
  margin: 20px 0;        /* 上下边距设置为20px，左右为0 */
  padding: 0;            /* 内边距设置为0 */
  text-align: justify;   /* 文本对齐方式设置为两端对齐 */
  word-wrap: break-word; /* 允许单词在单词内换行 */
  hyphens: auto;         /* 允许浏览器在适当的地方自动插入连字符以换行 */
}

.article-main {
  display: flex;
  justify-content: center; /* 使内容在水平方向上居中 */
  align-items: center;     /* 使内容在垂直方向上居中 */
  flex-direction: column;  /* 将子元素垂直排列 */
  padding: 20px;           /* 根据需要添加内边距 */
  box-sizing: border-box;  /* 确保内边距不会增加元素的整体宽度 */
}
 
.article-content-wrapper {
  max-width: 800px;  /* 根据需要设置内容的最大宽度 */
  width: 100%;       /* 使内容在较小屏幕上能够自适应宽度 */
  text-align: center; /* 如果希望文章内容也居中显示，则添加此行 */
}

.commentArea {
  margin-bottom: 20px;
}
 
.commentInputArea {
  margin-top: 20px;
}
.article-link {
  text-decoration: none; /* 去除下划线 */
  color: inherit; /* 继承父元素的颜色，或根据需要设置特定颜色 */
}

.article-link:hover {
  color: #4b78a8; /* 悬停时改变文本颜色，这里使用的是蓝色 */
  background-color: #f8f9fa; /* 悬停时添加淡灰色背景，可选 */
  /* 你可以根据需要添加更多样式，比如边框、阴影等 */
}
  </style>