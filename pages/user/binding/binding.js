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
    watchPhone: '',
    isshow: 0,
    time: '获取验证码', //倒计时 
    currentTime: 61, //限制60s
    isClick: 'getCode', //获取验证码按钮，默认允许点击
    watchCode: ''
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
  watchPhone: function(event) {
    let that = this;
    that.setData({
      watchPhone: event.detail.value,
    })
  },
  watchCode: function(event) {
    let that = this;
    that.setData({
      watchCode: event.detail.value,
    })
  },
  //获取验证码
  getCode: function() {
    var that = this;
    console.log(that.data.watchPhone);
    /*第一步：验证手机号码*/
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/; // 判断手机号码的正则
    if (that.data.watchPhone.length == 0) {
      wx.showModal({
        title: '提示',
        content: '手机号码不能为空',
        showCancel: false
      })
    } else if (that.data.watchPhone.length < 11) {
      wx.showModal({
        title: '提示',
        content: '手机号码长度有误！',
        showCancel: false
      })
    } else if (!myreg.test(that.data.watchPhone)) {
      wx.showModal({
        title: '提示',
        content: '错误的手机号码！',
        showCancel: false
      })
    } else {
      /*第二步：设置计时器*/
      // 先禁止获取验证码按钮的点击
      that.setData({
        isClick: 'getK',
      })
      // 60s倒计时 setInterval功能用于循环，常常用于播放动画，或者时间显示
      var currentTime = that.data.currentTime;
      var interval = setInterval(function() {
        currentTime--; //减
        that.setData({
          time: currentTime + '秒后重试'
        })
        console.log(123123123);
        if (currentTime <= 0) {
          clearInterval(interval)
          that.setData({
            time: '获取验证码',
            currentTime: 61,
            isClick: 'getCode'
          })
        }
      }, 1000);
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
      infoCb.success = function(data) {
        console.log(data);
      }

      sendAjax(infoOpt, infoCb, () => {
        // that.onLoad()
        // wx.setStorageSync('G_needUploadIndex', true)
      });
    }
  },
  getK: function() {
    return;
  },
  Submission: function() {
    var that = this;
    console.log(that.data.watchCode);
    let infoOpt = {
      url: '/user/binding',
      type: 'POST',
      data: {
        schoolNum: that.data.watchID,
        password: that.data.watchPassWord,
        phone: that.data.watchPhone,
        code: that.data.watchCode
      },
      header: {
        'content-type': 'application/json',
        'authorization': wx.getStorageSync("authorization"),
      },


    }
    let infoCb = {}
    infoCb.success = function(data) {
      console.log(data);
      if (data.code == 200) {
        // wx.setStorageSync('isbound', 1);

        wx.showModal({
          title: '提示',
          content: data.message || '处理失败',
          showCancel: false,

        });
        // console.log(data.result);
        if (data.result) {
          wx.setStorageSync('isbound', 1);
          wx.setStorageSync('watchPhone', that.data.watchPhone);
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
    var that = this;
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