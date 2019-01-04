// pages/Livebroadcast/Livebroadcast.js
const sendAjax = require('../../utils/sendAjax.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    roomlist:[]
  },
  toLive: function () {
    wx.navigateTo({
      url: 'Live/Live',
    })
  },
  getroomlist: function () {
    var that = this;
    let infoOpt = {
      url: '/live/getPlayUrl',
      type: 'GET',
      data: {

      },
      header: {
        'content-type': 'application/json',
        //  'authorization': wx.getStorageSync("authorization"),
      },
    }
    let infoCb = {}
    infoCb.success = function (data) {
         that.setData({
           roomlist:data.list
         })
         console.log(that.data.roomlist)
    }

    sendAjax(infoOpt, infoCb, () => {

    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getroomlist();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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