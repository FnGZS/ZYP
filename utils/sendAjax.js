const url = require('../config.js')

function sendAjax(options, callback, outTimeAuthCbOrNeedAuth) {

  // 登录信息过期处理类型
  // const OTCB = outTimeAuthCbOrNeedAuth || function() {
  //   getCurrentPages().pop().onLoad(getCurrentPages().pop().options)
  // }
  const _sets = options
  // console.log(_sets.url)
  if (typeof _sets.type === 'undefined') {
    _sets.type = 'POST'
  }
  if (typeof _sets.data === 'undefined') {
    _sets.data = {}
  }
console.log(_sets.data)
  // 如果不是明确不需要登录权限 而且 没有 G_authorization 的缓存信息 
  // if (outTimeAuthCbOrNeedAuth !== false && !wx.getStorageSync('authorization')) {
  // console.log(1111);
  //   // getApp().uploadUserInfo(OTCB)
  //   return
  // }

  // 纠正method大写
  _sets.type = _sets.type.toUpperCase();

  const bcallback = callback.beforeSend || function(data) {
    wx.showToast({
      title: '正在加载...',
      icon: 'loading',
      duration: 10000
    })
  };
  const scallback = callback.success || function(data) {};
  const ccallback = callback.complete || function(data) {
    wx.hideToast()
  };

  bcallback()

  wx.request({
    url: url.host + _sets.url,
    method: _sets.type,
    data: _sets.data,
    header: {
      'content-type': 'application/json',
      'authorization': outTimeAuthCbOrNeedAuth !== false ? wx.getStorageSync('userinfo').authorization : ''
    },
    success(res) {
      console.log(_sets.data)
      if (res.data.code == 200) {
     
        scallback(res.data)
      } else {

        if (res.data.code == 401) {

          // getApp().uploadUserInfo(OTCB)
        } else {
          if (res.data.code == 400) {
            wx.showModal({
              title: '提示',
              content: res.data.message || '处理失败',
              showCancel: false
            });
          }
        }
      }
    },
    fail() {
      wx.showModal({
        title: '提示',
        content: '服务器连接失败',
        showCancel: false
      });
    },
    complete() {
      ccallback()
    }
  })
}

module.exports = sendAjax