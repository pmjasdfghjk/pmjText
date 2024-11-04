<template>
  <page-container title="更换头像">
    <el-form>
      <el-form-item>
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="onSelectFile"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <input
          type="file"
          ref="fileInput"
          @change="onFileChange"
          style="display: none"
        />
        <el-button type="primary" @click="triggerFileInput">上传照片</el-button>
        <el-button @click="sumbitAvatar">点击提交</el-button>
      </el-form-item>
    </el-form>
  </page-container>
</template>
<script setup>
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { userAvatarUpdate } from '@/api/article'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
const userStore = useUserStore()
const imgUrl = ref('')
const fileInput = ref()

async function blobUrlToBase64(blobUrl) {
  try {
    // 使用 fetch 获取 Blob 对象
    const response = await fetch(blobUrl)
    const blob = await response.blob()

    // 创建一个 FileReader 实例
    const reader = new FileReader()

    // 返回一个 Promise，以便于获取 Base64 数据
    return new Promise((resolve, reject) => {
      reader.onloadend = () => {
        // 读取完成后，获取 Base64 字符串
        const base64String = reader.result
        resolve(base64String)
      }

      reader.onerror = () => {
        reject(new Error('Error converting blob to Base64'))
      }

      // 将 Blob 读取为 Data URL (Base64)
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    console.error('Error fetching blob URL:', error)
  }
}
const triggerFileInput = () => {
  fileInput.value.click() // 触发文件选择对话框
}
const onFileChange = async event => {
  const file = event.target.files[0] // 选择的文件
  if (file) {
    imgUrl.value = URL.createObjectURL(file)
  }
}
const onSelectFile = async uploadFile => {
  imgUrl.value = URL.createObjectURL(uploadFile.raw)
  // 预览图片
  // 将图片对象存入表单对象用于提交
}
const sumbitAvatar = async () => {
  const avatartUpdate = { avatar: '' }
  const res = await blobUrlToBase64(imgUrl.value)
  avatartUpdate.avatar = res
  await userAvatarUpdate(avatartUpdate)
  userStore.getUser()
  ElMessage.success('更换成功！')
}
</script>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 400px;
      height: 400px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 400px;
      height: 400px;
      text-align: center;
    }
  }
}
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
