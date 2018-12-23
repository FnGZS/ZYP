var app = getApp();

Page({
    data: {
      length1:0,
      length2:0,
      length3:0
    },
    onPullDownRefresh: function() {},
    onLoad: function() {
        
    },
    onShow: function() {
       
    },
    formSubmit: function() {
      var length1 = this.data.length1
      var length2 = this.data.length2
      var length3= this.data.length3

      if (length1 == 0 && length2 == 0 && length3==0){
        wx.showToast({
          title: '请填写相关信息，谢谢！',
          icon: 'none',
          duration: 1000
        })
      } else if (length1 != 0 && length2 == 0 && length3 == 0){
        wx.showToast({
          title: '请填写微信号和公司名称，谢谢！',
          icon: 'none',
          duration: 2000
        })
      } else if (length1 != 0 && length2 != 0 && length3 == 0) {
        wx.showToast({
          title: '请填写公司名称，谢谢！',
          icon: 'none',
          duration: 2000
        })
      } else if (length1 != 0 && length2 != 0 && length3 != 0) {
        wx.showToast({
          title: '感谢您的提交，谢谢！',
          icon: 'success',
          duration: 2000
        })
        var timer = setTimeout(function () {
          wx.navigateBack()
        }

          , 2000)
      } else if (length1 == 0 && length2 != 0 && length3 == 0) {
        wx.showToast({
          title: '请填写手机号和公司名称，谢谢！',
          icon: 'none',
          duration: 2000
        })
      } else if (length1 == 0 && length2 != 0 && length3 != 0) {
        wx.showToast({
          title: '请填写手机号，谢谢！',
          icon: 'none',
          duration: 2000
        })
      } else if (length1 == 0 && length2 == 0 && length3 != 0) {
        wx.showToast({
          title: '请填写手机号和微信名称，谢谢！',
          icon: 'none',
          duration: 2000
        })
      }
        
        
        
    },
    bindKeyInput1: function(t) {
      console.log(t)
        this.setData({
            phone: t.detail.value,
            length1: t.detail.value.length
        });
    },
    bindKeyInput2: function(t) {
        this.setData({
            wx: t.detail.value,
            length2: t.detail.value.length
        });
    },
    bindKeyInput3: function(t) {
        this.setData({
            sname: t.detail.value,
            length3: t.detail.value.length
        });
    }
});