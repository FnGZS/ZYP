// pages/user/user.js
var url = require('../../config.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isboundUser:'绑定学号',
    platUserInfoMap:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
 
  },
  getUserInfo: function (e) {
    var that=this;
    console.log(e);

    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    }) 
},
 //绑定页面
  binding:function(){
    // console.log('12321313');
      wx.navigateTo({
        url: 'binding/binding'
      })

  },
  joinVote: function () {
    // console.log('12321313');
    wx.navigateTo({
      url: 'joinVote/joinVote'
    })

  },
  ideaBack: function () {
    // console.log('12321313');
    wx.navigateTo({
      url: 'ideaBack/ideaBack'
    })

  },
  help: function () {
    // console.log('12321313');
    wx.navigateTo({
      url: 'help/help'
    })

  },
  aboutUs: function () {
    // console.log('12321313');
    wx.navigateTo({
      url: 'aboutUs/aboutUs'
    })

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    if (wx.getStorageSync('isbound') == 1 ) {
      this.setData({
        isboundUser: '已绑定学号'
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})