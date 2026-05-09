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
        <el-button @click="handleAdd()" type="primary" success class="manage_button">添加用户账户</el-button>
          <el-table v-loading="false"  :data="tableData"  max-height="800" border style="width: 100%;margin-top: 20px;margin-bottom: 20px;">
            <el-table-column prop="username" label="账号" width="520" />
            <el-table-column prop="nickname" label="用户昵称" width="520" />
            <el-table-column  fixed="right" label="操作" width="130">   
              <template #default="scope">
                <el-button link type="primary" size="small" @click="handleEdit(scope.$index, scope.row)">设置密码</el-button>
                <el-button link type="primary" size="small" @click="DeleteConfirm(scope.$index, scope.row)">删除账户</el-button>
              </template>
            </el-table-column>
          </el-table>
<el-dialog v-model="dialogVisible" :title="'编辑用户账户'" width="500" :before-close="handleClose">
  <el-form :model="form" label-width="auto" style="max-width: 600px">
  <el-form-item label="账号"><el-input disabled v-model="form.username" /></el-form-item>
  <el-form-item label="用户昵称"><el-input disabled v-model="form.nickname" /></el-form-item>
  <el-form-item label="密码"><el-input v-model="form.password" /></el-form-item>
</el-form>
  <template #footer>
    <div class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="EditConfirm">确认修改</el-button>
    </div>
  </template>
</el-dialog> 
      
<el-dialog v-model="Add_dialogVisible" :title="'添加用户账户'" width="500":before-close="handleClose">
  <el-form :model="form" label-width="auto" style="max-width: 600px">
  <el-form-item label="账号"><el-input  v-model="form.username" /></el-form-item>
  <el-form-item label="用户昵称"><el-input  v-model="form.nickname" /></el-form-item>
  <el-form-item label="密码"><el-input v-model="form.password" /></el-form-item>
</el-form>
  <template #footer>
    <div class="dialog-footer">
      <el-button @click="Add_dialogVisible = false">Cancel</el-button>
      <el-button type="primary" @click="AddConfirm">Confirm</el-button>
    </div>
  </template>
</el-dialog> 

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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
import aside from '../components/aside.vue';
import header from '../components/header.vue';
import footer from '../components/footer.vue';
import{onMounted, reactive, ref} from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { Action } from 'element-plus'
import { message } from 'ant-design-vue';
import Request from '../api/request';
import jwt from '../../jwt';
import type { ComponentSize } from 'element-plus'
//分页栏所需的变量
const total=ref(1);
const currentPage = ref(1)
const pageSize = ref(5)
const size = ref<ComponentSize>('default')
const background = ref(false)
const disabled = ref(false)
//
export default {
  setup(){
    let Add_dialogVisible=ref(false);
    let dialogVisible=ref(false);
    //是否弹出对话框
    const tableData = ref([]);
    const form=ref({//用来保存修改后的表单数据
      id: null,
      username: "",
      password: "",
      nickname: ""
    });
const copyOFrow=ref({});//保存修改前的表单数据
/////////////////////////////////////////以上为数据 以下为函数
//分页数据处理
const handleSizeChange = (val: number) => {
console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  console.log("当前页:",currentPage.value)
get_data()
}
//
const get_data = () => {
  const UUUurl = '/admin/users'; // 使用正确的API路径
  console.log("get_data:");
  Request({
    method: 'GET',
        url: UUUurl,
        params: {
          pageNum: currentPage.value,
          pageSize: pageSize.value
        }
      }).then((response) => {
        total.value = response.data.data.total;
        tableData.value = response.data.data.items;
        console.log("get的数据:",tableData.value)
        return response;
      }).catch((error) => {
        console.log('get报错', error.message);
      });
};

const handleClose = (done: () => void) => {
ElMessageBox.confirm('Are you sure to close this dialog?')//处理表单cancle后 询问是否需要关闭表单
  .then(() => {
    done()
  })
  .catch(() => {
    // catch error
  })
}

const handleEdit = (index, row) => { // 处理编辑
      console.log("当前行数据:", row);
      form.value = JSON.parse(JSON.stringify(row)); // 把表格数据复制到表单对象上去
      copyOFrow.value = JSON.parse(JSON.stringify(row)); // 保存将要被修改的数据
      console.log("当前编辑的数据", form.value);
      dialogVisible.value = true;
    };

    const EditConfirm = () => { // 编辑确认
      dialogVisible.value = false;
      Add_dialogVisible.value = false; // 关闭对话框
      console.log("EditConfirm");
      console.log("向后端提交的数据", form.value);
      // 把编辑后的表单传给后端
      const UUUurl = '/admin/users';
      Request({
        method: 'PUT',
        url: UUUurl,
        data: {
          id: form.value.id,
          password: form.value.password,
        }
      }).then(response => {
        get_data();
        return response;
      }).catch((error) => {
        get_data();
        console.log(error);
      });
    };

    const handleAdd = () => { // 添加
      console.log("点击了添加用户");
      Add_dialogVisible.value = true;
      form.value = {
        id: null,
        username: "",
        password: "",
        nickname: ""
      };
    };

    const AddConfirm = () => { // 添加确认
      dialogVisible.value = false;
      Add_dialogVisible.value = false; // 关闭对话框
      console.log("AddConfirm");
      console.log("向后端提交的数据", form.value);
      // 把编辑后的表单传给后端
      const UUUurl = '/admin/users';
      Request({
        method: 'POST',
        url: UUUurl,
        data: {
          username: form.value.username,
          nickname: form.value.nickname,
          password: form.value.password,
        }
      }).then(response => {
        get_data();
        return response;
      }).catch((error) => {
        get_data();
        console.log(error);
      });
    };
    const DeleteConfirm = (index, row)=>{//删除确认
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
        handleDelete(index, row);//确认提交
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消提交',
        })
      })
    };
    const handleDelete = (index, row) => { // 删除
      console.log("handleDelete");
      form.value = JSON.parse(JSON.stringify(row)); // 把表格数据复制到表单对象上去
      //将数据发给后端:
      const Delete_id = form.value.id; // 获取要删除的信息的id
      const UUUurl = '/admin/users/' + Delete_id;
      Request({
        method: 'delete',
        url: UUUurl,
      }).then(response => {
        console.log(response);
        get_data();
        return response;
      }).catch((error) => {
        get_data();
        console.error(error);
      });
    };
  
    onMounted(() => {
      get_data();
    });
//////////////
return{
  currentPage,
      pageSize,
      size,
      background,
      disabled,
      total,
  //
  tableData,
  copyOFrow,
  form,
  dialogVisible,
  Add_dialogVisible,
  get_data,
  handleClose,
  handleEdit,
  DeleteConfirm,
  handleDelete,
  AddConfirm,
  handleAdd,
  EditConfirm,
  handleCurrentChange,
  handleSizeChange,
}
},
    components: {//选项式API:vue2中注册组件的方法
        'GW-aside': aside,
        'GW-header': header,
        'GW-footer': footer
    }
}
//
</script>
<!--样式表-->
<style scoped>
@import url('../assets/Mycss.css');
</style>