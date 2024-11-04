<script setup>
import { artDelChannelService, artGetChannelsService } from '@/api/article'
import { ref } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import ChannalEdit from './component/ChannalEdit.vue'
import { ElMessage } from 'element-plus'
import { ElMessageBox } from 'element-plus'
const dialog = ref()
const loading = ref(false)
const channelList = ref([])
const getChannelList = async () => {
  loading.value = true
  const res = await artGetChannelsService()
  channelList.value = res.data.data
  loading.value = false
}
const onAddChannal = () => {
  dialog.value.open({})
}

getChannelList()
const onSuccess = () => {
  getChannelList()
}
const onEditChannal = row => {
  dialog.value.open(row)
}

const onDelChannal = async row => {
  try {
    await ElMessageBox.confirm('你确认要删掉我嘛', '求求你了啦', {
      type: 'warning',
      confirmButtonText: '确认删除',
      cancelButtonText: '取消',
    })
    await artDelChannelService(row.id)
    getChannelList()
    ElMessage.success('删除成功!')
  } catch (error) {
    if (error === 'cancel') {
      ElMessage.success('已取消操作')
    }
  }
}
</script>

<template>
  <page-container title="文章分类">
    <template #extra>
      <el-button @click="onAddChannal">添加分类</el-button>
    </template>
    <el-table :data="channelList" style="width: 100%" v-loading="loading">
      <el-table-column label="序号" width="100" type="index"></el-table-column>
      <el-table-column label="分类名称" prop="cate_name"></el-table-column>
      <el-table-column label="分类别名" prop="cate_alias"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row, $index }">
          <el-button
            :icon="Edit"
            circle
            type="primary"
            plain
            @click="onEditChannal(row, $index)"
          ></el-button>
          <el-button
            :icon="Delete"
            circle
            type="warning"
            plain
            @click="onDelChannal(row, $index)"
          ></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据"></el-empty>
      </template>
    </el-table>
    <ChannalEdit ref="dialog" @success="onSuccess"></ChannalEdit>
  </page-container>
</template>

<style scoped></style>
