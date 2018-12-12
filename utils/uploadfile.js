const url = require('../config.js')
var Promise = require('promise');
function upload_picture_fun(options, callback, outTimeAuthCbOrNeedAuth) {
  let promise = new Promise(function (resolve, reject) {
    console.log(options)
    // 登录信息过期处理类型
    // const OTCB = outTimeAuthCbOrNeedAuth || function() {
    //   getCurrentPages().pop().onLoad(getCurrentPages().pop().options)
    // }
    const _sets = options
    // console.log(_sets.url)
    if (typeof _sets.data === 'undefined') {
      _sets.data = {}
    }

    // 如果不是明确不需要登录权限 而且 没有 G_authorization 的缓存信息 
    // if (outTimeAuthCbOrNeedAuth !== false && !wx.getStorageSync('authorization')) {
    // console.log(1111);
    //   // getApp().uploadUserInfo(OTCB)
    //   return
    // }

    // 纠正method大写
    // _sets.type = _sets.type.toUpperCase();



    wx.uploadFile({
      url: _sets.url,
      // method: _sets.type,
      // data: _sets.data,
      filePath: _sets.list, //上传的文件本地地址    
      name: 'file',
      formData: _sets.data,
      header: {
        'content-type': 'application/json',
        'authorization': 'ciRW3cOmi1JYY8niXxG7xxx3+b5no4/N5k3gZFChkEzIR+Cbv2rpqh2M8q7RuwTx'
      },
      success(res) {
        console.log(res);
        var resd = JSON.parse(res.data);
        console.log(resd)
        if (resd.code == 200) {

          resolve(resd.urlList[0])
        } else {

          if (resd.code == 401) {

            // getApp().uploadUserInfo(OTCB)
          } else {
            if (resd.code == 400) {
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
        reject('服务器连接失败')
        // wx.showModal({
        //   title: '提示',
        //   content: '服务器连接失败',
        //   showCancel: false
        // });
      },
      complete() {

      }
    })
  });
  return promise;
}

module.exports = {
  upload_picture_fun: upload_picture_fun,
}  