import request from '@/utils/request'
// 获取文章分类
export const artGetChannelsService = () => {
  return request.get('/my/cate/list')
}
// 添加文章分类
export const artAddChannelService = data => {
  return request.post('/my/cate/add', data)
}

// 编辑文章分类
export const artEditChannelService = data => {
  return request.put('/my/cate/info', data)
}
//删除文章分类
export const artDelChannelService = id => {
  return request.delete('/my/cate/del', {
    params: {
      id,
    },
  })
}

////////////

// 文章相关
export const artGetListService = params => {
  return request.get('/my/article/list', {
    params,
  })
}

//发布文章,data要formData格式
export const artPublishService = data => {
  return request.post('/my/article/add', data)
}

//获取文章详情
export const artGetDetailService = id => {
  return request.get('/my/article/info', {
    params: {
      id,
    },
  })
}

//更新文章详情
export const artUpdateDetailService = data => {
  return request.put('/my/article/info', data)
}

// 点击按钮删除文章
export const artDeleteDetailService = id => {
  return request.delete('/my/article/info', {
    params: {
      id,
    },
  })
}

// 更新用户数据
export const updateUserData = data => {
  return request.put('/my/userinfo', data)
}

// 更新头像
export const userAvatarUpdate = data => {
  return request.patch('/my/update/avatar', data)
}

// 更新密码
export const userPasswordUpdate = data => {
  return request.patch('/my/updatepwd', data)
}
