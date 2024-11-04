<template>
  <el-select
    style="width: 300px"
    :modelValue="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
  >
    <!-- label是展示给用户看的 -->
    <el-option
      :label="item.cate_name"
      :value="item.id"
      v-for="item in channelList"
      :key="item.id"
    ></el-option>
  </el-select>
</template>
<script setup>
import { artGetChannelsService } from '@/api/article'
import { ref } from 'vue'
const channelList = ref([])
const getChannelList = async () => {
  const res = await artGetChannelsService()
  channelList.value = res.data.data
}
getChannelList()

defineProps({
  modelValue: {
    type: [Number, String],
  },
})

const emit = defineEmits(['update:modelValue'])
</script>
