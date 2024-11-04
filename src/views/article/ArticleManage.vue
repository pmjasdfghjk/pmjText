<script setup>
import { artDeleteDetailService, artGetListService } from '@/api/article'
import { Delete } from '@element-plus/icons-vue'
import { Edit } from '@element-plus/icons-vue'
import { ref } from 'vue'
import ChannelSelect from './component/ChannelSelect.vue'
import { formatTime } from '@/utils/format'
import ArticleEdit from './component/ArticleEdit.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
const open = async id => {
  try {
    await ElMessageBox.confirm('确认删除此项目吗？', '温馨提示', {
      type: 'warning',
      confirmButtonText: '确认删除',
      cancelButtonText: '取消',
    })
    await artDeleteDetailService(id)
    await getArticleList()
    ElMessage.success('删除成功')
  } catch (error) {
    if (error === 'cancel') {
      ElMessage.success('已取消操作')
    }
  }
}
const aed = ref()
const loading = ref(false)
const params = ref({
  pagenum: 1,
  pagesize: 5,
  cate_id: '',
  state: '',
})
const total = ref(0)
// 获取文章总条数
const articleList = ref([])
// 获取文章列表
const getArticleList = async () => {
  loading.value = true
  const res = await artGetListService(params.value)
  articleList.value = res.data.data
  total.value = res.data.total
  loading.value = false
}
getArticleList()
// 定义请求对象
// 编辑文章
const onEditArticle = row => {
  aed.value.open(row)
}
const onDeleteArticle = row => {
  open(row.id)
}
// 添加文章
const onAddArticle = () => {
  aed.value.open({})
}

// 处理分页逻辑
const onSizeChange = size => {
  params.value.pagenum = 1
  params.value.pagesize = size
  getArticleList()
}
const onCurrentChange = page => {
  params.value.pagenum = page
  getArticleList()
}
// 搜索就是按照最新的条件去重新检索一下，从第一页开始展示
const onSearch = () => {
  params.value.pagenum = 1
  getArticleList()
}
const onReset = () => {
  params.value.cate_id = ''
  params.value.pagenum = 1
  params.value.state = ''
  getArticleList()
}

// 控制显示隐藏

// 成功接收，重新渲染
const onSuccess = type => {
  if (type === 'add') {
    // 如果是添加，最好渲染最后一页即可
    const lastPage = Math.ceil((total.value + 1) / params.value.pagesize)
    // 计算出最后一页的页码数
    params.value.pagenum = lastPage
    // 设置为最大页码数
    getArticleList()
    // 再重新渲染即可
  } else {
    // 编辑的，直接渲染当前页码即可
    getArticleList()
  }
}
</script>

<template>
  <page-container title="文章管理">
    <template #extra>
      <el-button type="primary" @click="onAddArticle()">添加文章</el-button>
    </template>

    <!-- 表单区域 -->
    <el-form inline>
      <el-form-item label="文章管理">
        <ChannelSelect v-model="params.cate_id"></ChannelSelect>
      </el-form-item>
      <el-form-item label="发布状态">
        <el-select style="width: 300px" v-model="params.state">
          <el-option value="已发布" label="已发布"></el-option>
          <el-option value="草稿" label="草稿·"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格区域 -->
    <el-table :data="articleList" v-loading="loading">
      <el-table-column label="文章标题" prop="title">
        <template #default="{ row }">
          <el-link type="primary" :underline="false">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="cate_name"></el-table-column>
      <el-table-column label="发布时间" prop="pub_date">
        <template #default="{ row }">
          {{ formatTime(row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="state"></el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button
            circle
            plain
            type="primary"
            :icon="Edit"
            @click="onEditArticle(row)"
          ></el-button>
          <el-button
            circle
            plain
            type="danger"
            :icon="Delete"
            @click="onDeleteArticle(row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页区域 -->
    <el-pagination
      v-model:current-page="params.pagenum"
      v-model:page-size="params.pagesize"
      :page-sizes="[2, 3, 5, 10]"
      :background="true"
      layout="jumper,total, sizes, prev, pager, next"
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      style="margin-top: 20px; justify-content: flex-end"
    />
    <ArticleEdit ref="aed" @success="onSuccess"></ArticleEdit>
  </page-container>
</template>
