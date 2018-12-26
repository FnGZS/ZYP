// pages/Livebroadcast/Live/Live.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isverticalhidden: true,
    ishorizontalhidden:false,
    // orientation:'vertical',
  },
 
  onLoad: function (options) {

  },

 
  onShow: function () {

  },
  onReady(res) {
    // this.ctx = wx.createLivePlayerContext('player')
  },
  statechange(e) {
    console.log('live-player code:', e.detail.code)
  },
  error(e) {
    console.error('live-player error:', e.detail.errMsg)
  },
  bindPlay() {
    this.ctx.play({
      success: res => {
        console.log('play success')
      },
      fail: res => {
        console.log('play fail')
      }
    })
  },
  quanping:function(){
 
   var ctx = wx.createLivePlayerContext('player')
   var that=this;
   console.log(123)
    if (that.data.isverticalhidden)
    {
      console.log(1)
      that.setData({
        ishorizontalhidden:true,
        isverticalhidden: false,
      })
      ctx.requestFullScreen({
        direction: 90,
      })
    }
    else {
      console.log(2);
      that.setData({
        ishorizontalhidden: false,
        isverticalhidden: true,
      })
      ctx.exitFullScreen({

      })
    }
  },
  bindPause() {
    this.ctx.pause({
      success: res => {
        console.log('pause success')
      },
      fail: res => {
        console.log('pause fail')
      }
    })
  },
  bindStop() {
    this.ctx.stop({
      success: res => {
        console.log('stop success')
      },
      fail: res => {
        console.log('stop fail')
      }
    })
  },
  bindResume() {
    this.ctx.resume({
      success: res => {
        console.log('resume success')
      },
      fail: res => {
        console.log('resume fail')
      }
    })
  },
  bindMute() {
    this.ctx.mute({
      success: res => {
        console.log('mute success')
      },
      fail: res => {
        console.log('mute fail')
      }
    })
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