<template>
  <!-- 设置抽屉 -->
  <el-drawer v-model="visibileDrawer" title="添加文章" size="40%">
    <el-form style="margin-left: 30px">
      <el-form-item label="文章标题">
        <el-input
          placeholder="请输入标题"
          style="width: 100%"
          v-model="formModel.title"
        ></el-input>
      </el-form-item>
      <el-form-item label="文章分类">
        <ChannelSelect
          style="width: 100%"
          v-model="formModel.cate_id"
        ></ChannelSelect>
      </el-form-item>
      <el-form-item label="文章封面">
        <!-- 在这里要关闭element-plus的自动上传actions，默认是post上传，但是会很吃服务器，所以我们不要，只要写出一个自动展示预览就行
         语法：URL.createObjectURL(。。。)里面放文件对象，基于文件的地址创建预览效果 -->
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
      <el-form-item label="文章内容">
        <div class="editor">
          <quill-editor
            ref="editorRef"
            theme="snow"
            v-model:content="formModel.content"
            content-type="html"
          ></quill-editor>
        </div>
      </el-form-item>
      <el-form-item style="margin-left: 70px">
        <el-button type="primary" @click="onPublish('已发布')">发布</el-button>
        <el-button type="warning" @click="onPublish('草稿')">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script setup>
import { ref } from 'vue'
import ChannelSelect from './ChannelSelect.vue'
import { Plus } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import {
  artGetDetailService,
  artPublishService,
  artUpdateDetailService,
} from '@/api/article'
import { ElMessage } from 'element-plus'
import { baseURL } from '@/utils/request'
async function urlToFile(url, filename) {
  const response = await fetch(url)
  const blob = await response.blob() // 将响应转换为 Blob
  const file = new File([blob], filename, { type: blob.type }) // 创建 File 对象
  return file
}
const imgUrl = ref('')

const defaultForm = {
  title: '',
  cate_id: '',
  cover_img: '',
  content: '',
  state: '',
}
const editorRef = ref()
// 设置默认数据，方便编辑清空内容
const formModel = ref({
  ...defaultForm,
})
const onSelectFile = uploadFile => {
  imgUrl.value = URL.createObjectURL(uploadFile.raw)
  // 预览图片
  // 将图片对象存入表单对象用于提交
  formModel.value.cover_img = uploadFile.raw
}
const visibileDrawer = ref(false)
const open = async row => {
  visibileDrawer.value = true
  if (row.id) {
    // 有数据，要是编辑，但是数据不完全，要发请求回显。
    const res = await artGetDetailService(row.id)
    formModel.value = res.data.data
    imgUrl.value = baseURL + formModel.value.cover_img
    // 但是要注意的是，要提交修改的时候，图片地址要的是file对象，所以我们要再提交之前转存一下。

    const file = await urlToFile(imgUrl.value, formModel.value.cover_img)
    formModel.value.cover_img = file
  } else {
    formModel.value = { ...defaultForm }
    // 基于默认数据重置表单数据，添加操作
    imgUrl.value = ''
    if (editorRef.value) {
      editorRef.value.setHTML('')
    }
  }
}
const emit = defineEmits(['success'])
const onPublish = async state => {
  formModel.value.state = state
  // 将状态存入

  // 档期那接口需要
  const fd = new FormData()
  for (let key in formModel.value) {
    if (formModel.value[key] !== undefined) {
      fd.append(key, formModel.value[key])
    }
  }
  if (formModel.value.id) {
    await artUpdateDetailService(fd)
    ElMessage.success('编辑成功')
    visibileDrawer.value = false
    emit('success', 'edit')
  } else {
    await artPublishService(fd)
    ElMessage.success('添加成功')
    visibileDrawer.value = false
    emit('success', 'add')
  }
}

// 提交（要通知父组件，重新渲染

defineExpose({ open })
</script>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
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
      width: 178px;
      height: 178px;
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
