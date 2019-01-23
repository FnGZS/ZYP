//多张图片上传
function uploadimg(data) {
  var that = this;
  var i = data.i ? data.i : 0; //当前上传的哪张图片
  var success = data.success ? data.success : 0; //上传成功的个数
  var fail = data.fail ? data.fail : 0; //上传失败的个数
  var pics = data.pics ? data.pics : [];
  wx.uploadFile({
    header: {
      'content-type': 'application/json',
      'authorization': wx.getStorageSync('userinfo').authorization
    },
    url: data.url,
    filePath: data.path[i],
    name: 'file', //这里根据自己的实际情况改
    formData: data.formData, //这里是上传图片时一起上传的数据
    success: (resp) => {
      console.log(JSON.parse(resp.data))
      success++; //图片上传成功，图片上传成功的变量+1
      pics.push(JSON.parse(resp.data).urlList[0]);

    },
    fail: (res) => {
      fail++; //图片上传失败，图片上传失败的变量+1
      console.log('fail:' + i + "fail:" + fail);
    },
    complete: () => {
      i++; //这个图片执行完上传后，开始上传下一张
      if (i == data.path.length) { //当图片传完时，停止调用          
        console.log('成功：' + success + " 失败：" + fail);
        return pics;
      } else { //若图片还没有传完，则继续调用函数
        data.i = i;
        data.success = success;
        data.fail = fail;
        data.pics = pics;
        that.uploadimg(data);
      }
    }
  });
}
module.exports = {
  uploadimg: uploadimg,
}