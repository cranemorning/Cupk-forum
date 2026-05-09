<template>
<el-footer>
    <el-divider />
    <el-row :gutter="50" class="footer"><!--布局:一个row 内 4个col 每个col里面一个tr-->

    <el-col :span="6" class="gutter-row">

        <div class="gutter-box logo-area">

        <router-link to="/">

            <img 
            class="logo" 
            :src="logoSrc"
            alt="nav-logo"
            @mouseover="logoChange(true)"
            @mouseleave="logoChange(false)"
            />
        </router-link>  

        </div>

    </el-col>

    <el-col :span="6" class="link-area">

        <tr class="gutter-box link-area">
        <td class="title">站点</td> 

        <td>

            <router-link to="/home">首页</router-link>

        </td>
        </tr>

    </el-col>

    <el-col :span="6">
    <tr class="gutter-row link-area">

        <td class="title">链接</td>

        <td>

            <a href="https://tieba.baidu.com/index.html" target="_blank">百度贴吧</a>

        </td> 

        <td>

            <a href="https://www.cupk.edu.cn" target="_blank">中国石油大学</a>

        </td>

    </tr>
    </el-col>

    <el-col :span="6">
    <tr class="gutter-row link-area">
        
        <td class="title">联系我们</td>

        <td>

            <a href="mailto:2052504525@qq.com">Email</a>

        </td>
    </tr>
    </el-col>

    </el-row>

    <div class="copyright">
    <router-link to="/home">服务条款</router-link>
    <el-divider direction="vertical" />
    <router-link to="/home">隐私政策</router-link>
    <el-divider direction="vertical" />
    <a href="https://beian.miit.gov.cn/" target="_blank">京ICPxxxxxx备号xx</a>
    <br>
    Built with <a href="https://vuejs.org/" target="_blank">Vue</a>. Colored with <a href="https://element.eleme.cn" target="_blank">Element UI</a>.
    <br>
    Copyright © 2024 XXXXXXX All rights reserved.
    </div>

</el-footer>
</template>




<script lang="ts" setup>
import { ref } from 'vue';
//忽略导入文件类型检查:
// @ts-ignore
import defaultSrc from '../assets/images/cupk.jpg';

// @ts-ignore 
import hoverSrc from '../assets/images/cupk.jpg';

const logoSrc = ref(defaultSrc);
function logoChange(ishover: boolean) {
    logoSrc.value = ishover ? hoverSrc : defaultSrc;
}//hover作用

</script>

<style scoped>

a{
    text-decoration: none;
    transition: all 0.3s ease;
}
.footer {
    padding: 24px 0;
    height: 300px;
    background-color: #f8f9fa;
    border-top: 1px solid #e9ecef;
    transition: all 0.3s ease;
}

.footer:hover {
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

.router-link-active {
  text-decoration: none;
}
.link-area{
    line-height: 40px; 
    text-decoration: none;
    display: flex;
    flex-direction: column;
}
.link-area .title{
    font-size: var(--el-font-size-extra-large);
    margin-bottom: 10px;
    transition: all 0.3s ease;
}

.link-area .title:hover {
    color: #628ae8;
    transform: translateX(5px);
}

.logo-area {
    text-align: center;
    transition: all 0.3s ease;
}

.logo-area:hover {
    transform: translateY(-5px);
}

.logo-area .logo {
    width: 80%;
    height: auto;
    transition: all 0.3s ease;
}

.logo-area .logo:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.slogan {
    font-size: 1rem;
    font-weight: 400;
}

.link-area a {
    color: black;
    position: relative;
    padding-left: 10px;
}

.link-area a::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 2px;
    background-color: #628ae8;
    transition: all 0.3s ease;
}

.link-area a:hover {
    color: #628ae8;
    transform: translateX(5px);
}

.link-area a:hover::before {
    width: 5px;
}

.copyright {
    text-align: center;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #e9ecef;
    transition: all 0.3s ease;
}

.copyright:hover {
    color: #628ae8;
}

/* 动画效果 */
@keyframes fade-in {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.footer {
    animation: fade-in 0.6s ease forwards;
}

.link-area {
    animation: fade-in 0.8s ease forwards;
}

.logo-area {
    animation: fade-in 0.6s ease forwards;
}

.copyright {
    animation: fade-in 1s ease forwards;
}
</style>