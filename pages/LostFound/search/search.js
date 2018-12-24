// pages/LostFound/search/search.js
const sendAjax = require('../../../utils/sendAjax.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
     items:[],
     content:''
  },
  tosearch: function (e) {
    var that=this;
    console.log(e);
    that.setData({
      content: e.detail.value
    })
   that.getsearchlist();
  },
  getsearchlist:function(){
    var that=this;
    if(that.data.content){
        let infoOpt = {
          url: '/lost/getLostList',
          type: 'GET',
          data: {
            key:that.data.content
          },
          header: {
            'content-type': 'application/json',
            //  'authorization': wx.getStorageSync("authorization"),
          },
        }
        let infoCb = {}
        infoCb.success = function (data) {
          console.log(data);
          that.setData({
            items: data.items
          })
        }
        sendAjax(infoOpt, infoCb, () => {

        });
    }
  },
  detailPage: function (e) {
    console.log(e.currentTarget.dataset.conter)
    wx.navigateTo({
      url: '../detail/detail?detail=' + e.currentTarget.dataset.conter
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  cancel:function(){
    wx.navigateBack({
      delta: 1 
    })
  },
  onLoad: function (options) {
    // this.getsearchlist();
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