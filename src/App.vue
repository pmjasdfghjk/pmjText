<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from './stores'
const router = useRouter()
const route = useRoute()
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
</script>

<template>
  <div>
    <el-config-provider :locale="zhCn">
      <router-view></router-view>
    </el-config-provider>
  </div>
</template>

<style scoped></style>
