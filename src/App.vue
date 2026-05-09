<template>
  <router-view :key="$route.fullPath"></router-view> <!--在<router-view>上添加唯一Key，通过$route.fullPath或动态参数生成唯一标识，强制组件重新渲染-->
</template>

<script>

</script>