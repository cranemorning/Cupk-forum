import axios from "axios";
import { message } from "ant-design-vue";
import router from "../../router/index.js"
import jwt from '../../jwt';

const Request = axios.create({
    baseURL: '/api',
    timeout: 10000,
});

// 请求拦截器
Request.interceptors.request.use(function (config) {
    // 放行图片路径，不添加任何token
    if (config.url && config.url.startsWith("/uploads")) {
        config.method = "GET";
        config.headers = {};
        return config;
    }

    const token = localStorage.getItem("Authorization");
    const whiteList = [
        "/user/login",
        "/user/register",
        "/article/listForAllWithUser",
        "/article/detail",
        "/user/userInfoById",
        "/comment/list",
        "/article/listById",
        "/api/upload"
    ];

    // 白名单直接放行
    if (whiteList.includes(config.url)) {
        return config;
    }

    // 需要token的接口
    if (!token) {
        message.error('登录信息失效,请重新登录!');
        router.replace({ path: "/login" });
        return Promise.reject("无token");
    }

    config.headers.Authorization = token;
    return config;

}, function (error) {
    return Promise.reject(error);
});

// 响应拦截器
Request.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    if (error.response && error.response.status === 401) {
        message.error('登录信息失效,请重新登录!');
        jwt.logout();
        router.replace({ path: "/login" });
    }
    return Promise.reject(error);
});

export default Request