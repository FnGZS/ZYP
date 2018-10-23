// pages/user/binding/binding.js
var url = require('../../../config.js')
const sendAjax = require('../../../utils/sendAjax.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    watchID:'',
    watchPassWord:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(wx.getStorageSync("authorization"));
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  watchID: function (event){
    console.log(event.detail.value);
    let that=this;
    that.setData({
      watchID: event.detail.value,
    })
  },
  watchPassWord: function (event) {
    let that = this;
    that.setData({
      watchPassWord: event.detail.value,
    })
  },
  Submission:function(){
    var that=this;
    let infoOpt = {
      url: '/user/binding',
      type: 'POST',
      data: {
        schoolNum: that.data.watchID,
        password: that.data.watchPassWord,
      },
      header: {
        'content-type': 'application/json',
        'authorization': wx.getStorageSync("authorization"),
      },

      
    }
    let infoCb = {}
    infoCb.success = function (data) {
      console.log(data);
    }
    infoCb.beforeSend = () => {
    }
    infoCb.complete = () => {
      
    }
    sendAjax(infoOpt, infoCb, () => {
      // that.onLoad()
      // wx.setStorageSync('G_needUploadIndex', true)
    });

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