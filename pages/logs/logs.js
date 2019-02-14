var login = require('../../utils/wxlogin.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: ""

  },
  submit: function (e) {
    wx.showLoading({ //期间为了显示效果可以添加一个过度的弹出框提示“加载中”  
      title: '加载中',
      icon: 'loading',
    });
    var fId = e.detail.formId;
    console.log(typeof(fId))
    var l = 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + '18_W3KdyccHnWi7-S2i3sRpbepxDSyV3zwly-pAW8Gs1dx0OB_cnhNqjuq8ggNLSahgKDpwAbwC8D5aNAqVcLvhygtcI-VjSDdI3TJzFXy1B_dajiBoEyNnMuy_H2JLDQXSJCXJ5HakGLowYMoTAKKgADAMWW';
    var d = {
      "keyword1": {
        "value": "键盘鼠标"
      },
      "keyword2": {
        "value": "Effort"
      },
      "keyword3": {
        "value": "价格好商量"
      },
      "keyword4": {
        "value": "2018.12.26 14.42"
      }
    };
    console.log(wx.getStorageSync('userinfo').openId)
    wx.request({
      url: l,
      　　　　　//注意不要用value代替data
      data: {
        touser: wx.getStorageSync('userinfo').openId,
        template_id: 'eWMALLAPiQY6TlhWpp0BlsvD72xPh-ZN1cUdOL_TkiQ',//申请的模板消息id，  
        page: '/pages/user/index',
        form_id: fId,
        data: d,
        color: '#ccc',
        emphasis_keyword: 'keyword1.DATA'
      },
      method: 'POST',
      success: function (res) {
        wx.hideLoading();
        console.log("发送成功");
        console.log(res);
      },
      fail: function (err) {
        // fail  
        console.log("push err")
        console.log(err);
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    login.wxLogin(0, function (res) {
      wx.setStorageSync("userinfo", res)
      console.log(wx.getStorageSync('userinfo'))

    })

  }
})