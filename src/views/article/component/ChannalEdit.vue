<template>
  <el-dialog
    v-model="dialogVisible"
    :title="formModel.id ? '编辑分类' : '添加分类'"
    width="30%"
  >
    <el-form :model="formModel" :rules="rules" ref="formRef">
      <el-form-item label="分类名称" prop="cate_name">
        <el-input
          placeholder="请输入分类名称"
          v-model="formModel.cate_name"
        ></el-input>
      </el-form-item>
      <el-form-item label="分类别名" prop="cate_alias">
        <el-input
          placeholder="请输入分类别名"
          v-model="formModel.cate_alias"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onSumbit"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { artAddChannelService, artEditChannelService } from '@/api/article'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
const emit = defineEmits(['success'])
const dialogVisible = ref(false)
const formRef = ref()
const onSumbit = async () => {
  await formRef.value.validate()
  const isEdit = formModel.value.id
  if (isEdit) {
    await artEditChannelService(formModel.value)
    ElMessage.success('编辑成功')
  } else {
    await artAddChannelService(formModel.value)
    ElMessage.success('添加成功')
  }
  dialogVisible.value = false
  emit('success')
}
const open = row => {
  dialogVisible.value = true
  formModel.value = { ...row }
}
const formModel = ref({
  cate_name: '',
  cate_alias: '',
})
defineExpose({ open })
const rules = {
  cate_name: [
    { required: true, message: '请输入分类名称2博一', trigger: 'blur' },
    { pattern: /^\S{1,10}$/, meaasge: '别乱写', trigger: 'blur' },
  ],
  cate_alias: [
    { required: true, message: '请输入分类别名2博一', trigger: 'blur' },
    {
      pattern: /^\S[a-zA-Z0-9]{1,15}$/,
      meaasge: '别乱写,要1-15位的字母或者数字',
      trigger: 'blur',
    },
  ],
}
</script>
