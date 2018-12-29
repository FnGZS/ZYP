Page({
  data: {
    imgUrls: [],
    price: null,
  },
  onLoad: function(options) {},
  addPic: function() {
    var that = this
    var num = that.data.imgUrls.length
    var imgUrls = that.data.imgUrls
    var index = that.data.imgUrls.length;
    if (num < 4) {
      var cnt = 4 - num;
      wx.chooseImage({
        count: cnt,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success(res) {
          var tempFilePaths = res.tempFilePaths
          for (var i = tempFilePaths.length - 1; i >= 0; i--) {
            imgUrls.splice(index, 0, tempFilePaths[i])
          }
          that.setData({
            imgUrls: imgUrls
          })
          console.log(imgUrls)
        }
      })
    } else {
      wx.showToast({
        title: '最多上传4张图片噢~',
        icon: 'none'
      })
    }

  },
  removePic: function(e) {
    var that = this;
    var imgUrls = that.data.imgUrls;
    console.log(e);
    var index = e.currentTarget.dataset.index;
    imgUrls.splice(index, 1);
    that.setData({
      imgUrls: imgUrls
    })
  },
  input_price: function(e) {
    var v1 = e.detail.value;
    var v2 = parseFloat(v1).toFixed(2)
    this.setData({
      price: v2
    })
  },
  onReady: function() {},
  onShow: function() {},
  onHide: function() {},
  onUnload: function() {},
  onPullDownRefresh: function() {},
  onReachBottom: function() {},
  onShareAppMessage: function() {}
})