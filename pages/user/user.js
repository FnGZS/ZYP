// pages/user/user.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    GradualNum: 0,
    footSrc2: '../../images/首页.png',
    footSrc3: '../../images/投票.png',
    footSrc4: '../../images/时事.png',
    footSrc5: '../../images/我的.png'
  },
  Navigation: function (event) {
    var that = this;
    app.Navigation(event, that);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setStorageSync('GradualNum', 0);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    var GradualNum = wx.getStorageSync('GradualNum');
    console.log(GradualNum);
    if (GradualNum) {
      that.setData({
        GradualNum: GradualNum
      })
    }
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