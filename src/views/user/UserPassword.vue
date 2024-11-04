<template>
  <page-container title="重置密码">
    <el-form :model="formModel" :rules="rules">
      <el-form-item label="原密码" prop="old_pwd" style="margin-left: 27px">
        <el-input
          v-model="formModel.old_pwd"
          type="password"
          style="width: 400px"
        ></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="new_pwd" style="margin-left: 27px">
        <el-input
          v-model="formModel.new_pwd"
          type="password"
          style="width: 400px"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="re_pwd">
        <el-input
          v-model="formModel.re_pwd"
          type="password"
          style="width: 400px"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onDelChannal">修改密码</el-button>
        <el-button type="danger" @click="reSet">重置</el-button>
      </el-form-item>
    </el-form>
  </page-container>
</template>

<script setup>
import { userPasswordUpdate } from '@/api/article'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
import { ElMessageBox } from 'element-plus'
const formModel = ref({
  old_pwd: '',
  new_pwd: '',
  re_pwd: '',
})
const reSet = () => {
  formModel.value.old_pwd = ''
  formModel.value.new_pwd = ''
  formModel.value.re_pwd = ''
}
const sumbitPwd = async () => {
  await userPasswordUpdate(formModel.value)
  ElMessage.success('修改密码成功')
}
const rules = {
  old_pwd: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码为是6-15为非空字符',
      trigger: 'blur',
    },
  ],
  new_pwd: [
    { required: true, message: '请输入新的密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是6-15为非空字符',
      trigger: 'blur',
    },
  ],
  re_pwd: [
    { required: true, message: '请输再次入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是6-15为非空字符',
      trigger: 'blur',
    },
    {
      validator: (rule, value, callback) => {
        if (value !== formModel.value.new_pwd) {
          callback(new Error('两次输入的内容不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
}
const onDelChannal = async () => {
  try {
    await ElMessageBox.confirm('是否确认重置密码', '温馨提示', {
      type: 'warning',
      confirmButtonText: '确认修改',
      cancelButtonText: '取消',
    })
    // 用户点击确认后，调用提交密码的函数
    sumbitPwd()
  } catch (error) {
    if (error === 'cancel') {
      reSet()
      ElMessage.success('已取消操作')
    }
  }
}
</script>
<style></style>
