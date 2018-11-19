// pages/user/binding/binding.js
var url = require('../../../config.js')
const sendAjax = require('../../../utils/sendAjax.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    watchID: '',
    watchPassWord: '',
    watchPhone:'',
    isshow:0,
    text: '获取验证码', //按钮文字
    currentTime: 61, //倒计时
    disabled: false, //按钮是否禁用

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(wx.getStorageSync("authorization"));
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  watchID: function(event) {
    // console.log(event.detail.value);
    let that = this;
    that.setData({
      watchID: event.detail.value,
    })
  },
  watchPassWord: function(event) {
    let that = this;
    that.setData({
      watchPassWord: event.detail.value,
    })
  },
  watchPhone: function (event){
    let that = this;
    that.setData({
      watchPhone: event.detail.value,
    })
  },
  //获取验证码
  getCode:function(){
    var that = this;
    console.log(that.data.watchPhone);
  
    let infoOpt = {
      url: '/user/sms',
      type: 'POST',
      data: {
        phone: that.data.watchPhone
      },
      header: {
        'content-type': 'application/json',
      
      },


    }
    let infoCb = {}
    infoCb.success = function (data) {
        console.log(data);
    }

    sendAjax(infoOpt, infoCb, () => {
      // that.onLoad()
      // wx.setStorageSync('G_needUploadIndex', true)
    });
  },
  Submission: function() {
    var that = this;
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
    infoCb.success = function(data) {
      if (data.code == 200) {
        // wx.setStorageSync('isbound', 1);
        // wx.setStorageSync('authorization', data.asToken);
        wx.showModal({
          title: '提示',
          content: data.message || '处理失败',
          showCancel: false,
          
        });
        // console.log(data.result);
        if (data.result) {
          wx.setStorageSync('isbound',1);
          wx.setStorageSync('authorization', data.asToken);
          that.setData({
            isshow: 0
          })
            wx.navigateBack({
              delta: 1
            })  
        }
      }
    }
  
    sendAjax(infoOpt, infoCb, () => {
      // that.onLoad()
      // wx.setStorageSync('G_needUploadIndex', true)
    });

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
      var that=this;
    // console.log(wx.getStorageSync('isbound'));
      that.setData({
        isshow: wx.getStorageSync('isbound')
      })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})