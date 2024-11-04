<template>
  <page-container title="个人详情">
    <el-form :model="user" :rules="rules" ref="user_form">
      <el-form-item
        label="登录名称"
        style="width: 390px; margin-left: 10px"
        prop="username"
      >
        <el-input disabled v-model="user.username"></el-input>
      </el-form-item>
      <el-form-item label="用户昵称" style="width: 400px" prop="nickname">
        <el-input v-model="user.nickname"></el-input>
      </el-form-item>
      <el-form-item label="用户邮箱" style="width: 400px" prop="email">
        <el-input v-model="user.email"></el-input>
      </el-form-item>
      <el-form-item style="margin-left: 70px">
        <el-button type="primary" @click="submit">提交修改</el-button>
      </el-form-item>
    </el-form>
  </page-container>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores'
import { onMounted } from 'vue'
import { updateUserData } from '@/api/article'
import { ElMessage } from 'element-plus'
const userStore = useUserStore()
const user_form = ref()
onMounted(() => {
  userStore.getUser()
})

const user = ref({
  id: 32428,
  username: userStore.user.username,
  nickname: userStore.user.nickname,
  email: userStore.user.email,
  user_pic: '',
})

const rules = {
  username: [],
  nickname: [
    {
      required: true,
      message: '别空着啊',
      trigger: 'blur',
    },
  ],
  email: [
    {
      required: true,
      message: '别空着啊',
      trigger: 'blur',
    },
    {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: '请输入正确的邮箱格式',
      trigger: 'blur',
    },
  ],
}
const submit = async () => {
  await user_form.value.validate()
  const userData = user.value
  await updateUserData(userData)
  await userStore.getUser()
  user.value.email = userStore.user.email
  user.value.nickname = userStore.user.nickname
  user.value.username = userStore.user.username
  ElMessage.success('修改成功！')
}
</script>
