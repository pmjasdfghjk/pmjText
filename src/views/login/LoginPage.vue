<template>
  <el-row class="login-page">
    <el-col :span="12" class="bg"></el-col>
    <!-- 登录页 -->
    <el-col :span="6" :offset="3" class="form" v-if="isRegister">
      <el-form
        ref="form"
        size="large"
        autocomplete="off"
        :model="formModel"
        :rules="rules"
      >
        <el-form-item>
          <h2>登录</h2>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            :prefix-icon="User"
            placeholder="请输入用户名"
            v-model="formModel.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            :prefix-icon="Lock"
            placeholder="请输入密码"
            type="password"
            v-model="formModel.password"
          ></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>记住我</el-checkbox>
            <el-link :underline="false" type="primary">忘记密码?</el-link>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button class="button" type="primary" @click="login"
            >登录</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-link
            type="primary"
            auto-insert-space
            :underline="false"
            @click="isRegister = false"
          >
            注册→
          </el-link>
        </el-form-item>
      </el-form>
    </el-col>

    <!-- 注册页面 -->
    <el-col :span="6" :offset="3" class="form" v-else>
      <el-form
        ref="form"
        size="large"
        autocomplete="off"
        :model="formModel"
        :rules="rules"
      >
        <el-form-item>
          <h2>注册</h2>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            :prefix-icon="User"
            placeholder="请输入用户名"
            v-model="formModel.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            :prefix-icon="Lock"
            placeholder="请输入密码"
            type="password"
            v-model="formModel.password"
          ></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input
            :prefix-icon="Lock"
            placeholder="请再次输入密码"
            type="password"
            v-model="formModel.repassword"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="button" type="primary" @click="register"
            >注册</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-link
            type="primary"
            auto-insert-space
            :underline="false"
            @click="isRegister = true"
          >
            ←返回
          </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'
import { userRegisterService, userLoginService } from '@/api/user.js'
import { ElMessage } from 'element-plus' // 引入 ELMessage
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'
const form = ref()
const isRegister = ref(true)
const formModel = ref({
  username: '',
  password: '',
  repassword: '',
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 5, max: 10, message: '不能太长或者太短', trigger: 'change' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是6-15为非空字符',
      trigger: 'blur',
    },
  ],
  repassword: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是6-15为非空字符',
      trigger: 'blur',
    },
    {
      validator: (rule, value, callback) => {
        if (value !== formModel.value.password) {
          callback(new Error('两次输入的内容不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
}

const register = async () => {
  await form.value.validate()

  await userRegisterService(formModel.value)

  ElMessage.success('注册成功')

  isRegister.value = true
}

watch(isRegister, () => {
  formModel.value = {
    username: '',
    password: '',
    repassword: '',
  }
})

const userStore = useUserStore()
const router = useRouter()
const login = async () => {
  await form.value.validate()
  const res = await userLoginService(formModel.value)
  userStore.setToken(res.data.token)
  ElMessage.success('登陆成功')
  router.push('/')
}
</script>

<style lang="scss">
.login-page {
  height: 100vh;
  background-color: #fff;
  .bg {
    background:
      url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
      url('@/assets/login_bg.jpg') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }
  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;
    .title {
      margin: 0 auto;
    }
    .button {
      width: 100%;
    }
    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
