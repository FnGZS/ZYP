// pages/Livebroadcast/Live/Live.js
var socketOpen = false;
var frameBuffer_Data, session, SocketTask;
var url = 'ws://www.sxscott.com/crazyBird/echo';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isverticalhidden: true,
    ishorizontalhidden:false,
    // orientation:'vertical',
    scrollTop:0,
    window:0,


    // user_input_text: '',//用户输入文字
    // inputValue: '',
    // returnValue: '',
    // addImg: false,
    // //格式示例数据，可为空
    // allContentList: [],
    // num: 0
  },
 
  onLoad: function (options) {
    // this.bottom();
  },

 
  onShow: function () {
    // if (!socketOpen) {
    //   this.webSocket()
    // }
  },
  webSocket: function () {
    // // 创建Socket
    // SocketTask = wx.connectSocket({
    //   url: url,
    //   data: 'data',
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   method: 'post',
    //   success: function (res) {
    //     console.log('WebSocket连接创建', res)
    //   },
    //   fail: function (err) {
    //     wx.showToast({
    //       title: '网络异常！',
    //     })
    //     console.log(err)
    //   },
    // })
    // SocketTask.onError(onError => {
    //   console.log('监听 WebSocket 错误。错误信息', onError)
    //   socketOpen = false
    // })
  },
  // 提交文字
  // submitTo: function (e) {
  //   let that = this;
  //   var data = {
  //     body: that.data.inputValue,
  //   }

  //   if (socketOpen) {
  //     // 如果打开了socket就发送数据给服务器
  //     sendSocketMessage(data)
  //     this.data.allContentList.push({ is_my: { text: this.data.inputValue } });
  //     this.setData({
  //       allContentList: this.data.allContentList,
  //       inputValue: ''
  //     })

  //     that.bottom()
  //   }
  // },
  
  // bindKeyInput: function (e) {
  //   this.setData({
  //     inputValue: e.detail.value
  //   })
  // },
  //定时函数
  timeout:function(){
    console.log('123');
    var that=this;
    if(window)
    {
      that.setData({
        ishorizontalhidden: true
      })
 
    }
    else {
      that.setData({
        isverticalhidden: true
      })

    }
    setTimeout(function () {
      console.log('asd');
      if (window)
      {
        that.setData({
          ishorizontalhidden: false
        })
      }else {
        that.setData({
          isverticalhidden: false
        })

      }
    }, 5000)

  },
  click:function(){
    this.timeout()
  },
  quan(e){
    console.log(e);
  },
  onReady(res) {
    this.ctx = wx.createLivePlayerContext('player')
    // var that = this;
    // SocketTask.onOpen(res => {
    //   socketOpen = true;
    //   console.log('监听 WebSocket 连接打开事件。', res) 
    // })
    // SocketTask.onClose(onClose => {
    //   console.log('监听 WebSocket 连接关闭事件。', onClose)
    //   socketOpen = false;
    //   this.webSocket()
    // })
    // SocketTask.onError(onError => {
    //   console.log('监听 WebSocket 错误。错误信息', onError)
    //   socketOpen = false
    // })
    // SocketTask.onMessage(onMessage => {
    //   console.log('监听WebSocket接受到服务器的消息事件。服务器返回的消息', onMessage.data)
    //   var onMessage_data = onMessage.data

    //   that.setData({
    //     link_list: onMessage_data
    //   })
    //   console.log(onMessage_data, onMessage_data instanceof Array)
    //   // 是否为数组
    //   if (onMessage_data instanceof Array) {
    //     for (var i = 0; i < onMessage_data.length; i++) {
    //       onMessage_data[i]
    //     }
    //   } else {

    //   }
    //   that.data.allContentList.push({ is_ai: true, onMessage_data: onMessage_data });
    //   that.setData({
    //     allContentList: that.data.allContentList
    //   })
    //   console.log(that.data.allContentList)
    //   that.bottom()

    // })
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
    console.log(that.data.ishorizontalhidden)
    console.log(that.data.isverticalhidden)
    if (that.data.isverticalhidden)
    {
      ctx.requestFullScreen({
        direction: 90,
      })
      that.setData({
        ishorizontalhidden:true,
        isverticalhidden: false,
        window:1,
      })
  
    }
    else {
      console.log(2);
      that.setData({
        ishorizontalhidden: false,
        isverticalhidden: true,
        window:0
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
  // bottom: function () {
  //   var that = this;
  //   this.setData({
  //     scrollTop: 1000000
  //   })
  // },
  
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
 var that=this;
    that.setData({
      ishorizontalhidden: false,
      isverticalhidden: true,
    })
 console.log(123)
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
function sendSocketMessage(msg) {
  var that = this;
  console.log('通过 WebSocket 连接发送数据', JSON.stringify(msg))
  SocketTask.send({
    data: JSON.stringify(msg)
  }, function (res) {
    console.log('已发送', res)
  })
}