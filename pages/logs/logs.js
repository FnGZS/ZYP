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
    console.log(fId)
    var l = 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + getApp().globalData.token;
    var d = {
      "keyword1": {
        "value": "键盘鼠标",
        "color": "#4a4a4a"
      },
      "keyword2": {
        "value": "Effort",
        "color": "#9b9b9b"
      },
      "keyword3": {
        "value": "价格好商量",
        "color": "#9b9b9b"
      },
      "keyword4": {
        "value": "2018.12.26 14.42",
        "color": "#9b9b9b"
      }
    };
    console.log(d)
    wx.request({
      url: l,
      　　　　　//注意不要用value代替data
      data: {
        touser: this.data.openid,
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
    wx.login({
      success: (res) => {
        if (res.code) {
          wx.request({
            url: "https://api.weixin.qq.com/sns/jscode2session",
            data: {
              appid: getApp().globalData.appid,//你的appid
              secret: getApp().globalData.secret,//你的secret
              js_code: res.code,
              grant_type: "authorization_code"
            },
            success: (res) => {
              console.log(res);
              that.setData({
                openid: res.data.openid //存储openid
              })
            }
          })
        }
      }
    })
  }
})