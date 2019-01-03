// pages/play/play.js
const app = getApp()
var utils = require('../../../utils/util');
var websocket = require('../../../utils/websocket.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    playing: false,
    videoContext: {},
    livestyle:'liveplayerstyle',
    fullScreen: false,
    playUrl: "http://5815.liveplay.myqcloud.com/live/5815_89aad37e06ff11e892905cb9018cf0d4_550.flv",
    orientation: "vertical",
    objectFit: "contain",
    muted: false,
    backgroundMuted: false,
    debug: false,
    headerHeight: app.globalData.headerHeight,
    statusBarHeight: app.globalData.statusBarHeight,
    animrotate:'',
    currentTab:0,
    newslist:[],
    message: '', 
    toView:'',
  },
  //点击切换
  clickTab: function (e) {
    var _this = this;
    // console.log(_this.data.newhigth);
    if (_this.data.currentTab === e.target.dataset.current) {

      return false;
    } else {

      _this.setData({
        currentTab: e.target.dataset.current,

      })
  

    }
  },
  //图标旋转
  onRotate:function(){
    var that=this;
    var animationPlus = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    animationPlus.rotateZ(90).step();
    that.setData({
      animrotate: animationPlus.export(),
    })
  },
  onRotateru: function () {
    var that = this;
    var animationPlus = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    animationPlus.rotateZ(0).step();
    that.setData({
      animrotate: animationPlus.export(),
    })
  },
  onScanQR: function () {
    this.stop();
    this.createContext();
    var self = this;
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        console.log(res);
        self.setData({
          playUrl: res.result
        })
      }
    })
  },

  onPlayClick: function () {
    var url = this.data.playUrl;
    if (url.indexOf("rtmp:") == 0) {
    } else if (url.indexOf("https:") == 0 || url.indexOf("http:") == 0) {
      if (url.indexOf(".flv") != -1) {
      }
    } else {
      wx.showToast({
        title: '播放地址不合法，目前仅支持rtmp,flv方式!',
        icon: 'loading',
      })
    }

    this.setData({
      playing: !this.data.playing,
    })

    if (this.data.playing) {
      this.data.videoContext.play();
      console.log("video play()");
      wx.showLoading({
        title: '',
      })
    } else {
      this.data.videoContext.stop();
      console.log("video stop()");
      wx.hideLoading();
    }
  },

  onOrientationClick: function () {
  var that=this;
    console.log(this.data.orientation)
    if (this.data.orientation == "vertical") {
      this.data.orientation = "horizontal";
      // this.data.livestyle = 'liveplayerstyle'
      that.setData({
        livestyle:'fullScreen'
      })
      this.onRotate();
    } else {
      this.data.orientation = "vertical";
      // this.data.livestyle = 'fullScreen'
      that.setData({
        livestyle: 'liveplayerstyle'
      })
      this.onRotateru();
    }
    this.setData({
      orientation: this.data.orientation
    })
  },

  onObjectfitClick: function () {
    if (this.data.objectFit == "fillCrop") {
      this.data.objectFit = "contain";
     
    } else {
      this.data.objectFit = "fillCrop";
      
    }

    this.setData({
      objectFit: this.data.objectFit
    })
  },

  onLogClick: function () {
    this.setData({
      debug: !this.data.debug
    })
    var that = this;
    setTimeout(() => {
      that.setData({
        exterFlag: !that.data.exterFlag
      })
    }, 10)
  },

  onMuteClick: function () {
    this.setData({
      muted: !this.data.muted
    })
  },

  onFullScreenClick: function () {

    if (!this.data.fullScreen) {
      this.data.videoContext.requestFullScreen({
        direction: 0,

      })

    } else {
      this.data.videoContext.exitFullScreen({

      })
    }
  },

  onPlayEvent: function (e) {
    console.log(e.detail.code);
    if (e.detail.code == -2301) {
      this.stop();
      wx.showToast({
        title: '拉流多次失败',
      })
    }
    if (e.detail.code == 2004) {
      wx.hideLoading();
    }
  },

  onFullScreenChange: function (e) {
    this.setData({
      fullScreen: e.detail.fullScreen,
   
    })
    console.log(e);
    wx.showToast({
      title: this.data.fullScreen ? '全屏' : '退出全屏',
    })
  },

  stop: function () {
    this.setData({
      playing: false,
      // playUrl: "rtmp://2157.liveplay.myqcloud.com/live/2157_wx_live_test1",
      orientation: "vertical",
      objectFit: "contain",
      muted: false,
      fullScreen: false,
      backgroundMuted: false,
      debug: false,
      exterFlag: false,
    })
    this.data.videoContext.stop();
    wx.hideLoading();
  },

  createContext: function () {
    this.setData({
      videoContext: wx.createLivePlayerContext("video-livePlayer")
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.openwebsocket();
  },
  //调通接口
  openwebsocket:function(){
    var that=this;
    websocket.connect(this.data.userInfo, function (res) {
      console.log(JSON.parse(res.data))
      var list = []
      list = that.data.newslist
      list.push(JSON.parse(res.data))
      that.setData({
        newslist: list
      })
      console.log(that.data.newslist)
      that.buttom()
    })
  },
  send: function () {
    var that = this
    if (this.data.message.trim() == "") {
      wx.showToast({
        title: '消息不能为空哦~',
        icon: "none",
        duration: 2000
      })
    } else {
      setTimeout(function () {
        that.setData({
          increase: false

        })
        that.buttom()
      }, 500)
      let infoCb = {
          type:0,
          content:that.data.message,
          userinfo: wx.getStorageSync("userinfo"),
          date: utils.formatTime(new Date())
      }
      // console.log(infoCb)
      websocket.send(JSON.stringify(infoCb))
      that.setData({
        message:''
      })
    }
   
  },
  //监听input值的改变
  bindChange(res) {
    this.setData({
      message: res.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.createContext();
    console.log(this.data.videoContext);

    wx.setKeepScreenOn({
      keepScreenOn: true,
    })
  },
  buttom:function(){
     

    this.setData({
      toView: 'toView'
    })

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 保持屏幕常亮
    this.buttom();
    wx.setKeepScreenOn({
      keepScreenOn: true
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
    this.stop();
    wx.closeSocket();
    wx.setKeepScreenOn({
      keepScreenOn: false,
    })
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
    return {
      // title: '直播播放器',
      // path: '/pages/play/play',
      path: '/pages/main/main',
      imageUrl: 'https://mc.qcloudimg.com/static/img/dacf9205fe088ec2fef6f0b781c92510/share.png'
    }
  },
  onBack: function () {
    wx.navigateBack({
      delta: 1
    });
  }
})