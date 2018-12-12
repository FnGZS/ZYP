// pages/LostFound/LostFound.js
const sendAjax = require('../../utils/sendAjax.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    //测试数据
    hearwidth: 0,
    //内容高度
    contheigth:0,
    winHeight:0,
   //初始的頁面:
    initialpageNo:0,
    initialpageSize:5,
    hear: [{ id: 0, name: '寻主' }, { id: 1, name: '寻物' }],
    message: [],
    message_s:[],
    isPopping: false,//是否已经弹出
    animPlus: {},//旋转动画
    animCollect: {},//item位移,透明度
    animTranspond: {},//item位移,透明度
    animInput: {},//item位移,透明度
  },
  setheight:function(){
    var that=this;
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 180;
        calc = calc * (that.data.initialpageNo + 1)
        that.setData({
          winHeight: calc 
        });
      }
    });

  },
  //滑动切换
  swiperTab: function (e) {
    var _this = this;
    console.log(e);
    _this.setData({
      currentTab: e.detail.current
    });

  },
  //点击切换
  clickTab: function (e) {
    var _this = this;
    // console.log(e);
    // console.log(_this.data.newhigth);
    if (_this.data.currentTab === e.target.dataset.current) {

      return false;
    } else {

      _this.setData({
        currentTab: e.target.dataset.current,
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  getlosttype:function(){
  var that=this;
    let infoOpt = {
      url: '/lost/lostMessage',
      type: 'GET',
      data: { 
        pageNo:that.data.initialpageNo,
        pageSize:that.data.initialpageSize
      },
      header: {
        'content-type': 'application/json',
        //  'authorization': wx.getStorageSync("authorization"),
      },
    }
    let infoCb = {}
    infoCb.success = function (data) {
      console.log(data.lostTypeList);
      that.setData({
        hear: data.lostTypeList
      })
      that.getLostList(that.data.hear)
  
    }
  
    sendAjax(infoOpt, infoCb, () => {
    
    });
  },
getLostList:function(e){
  var Elength=e.length;
  var that=this;
  var message_s=that.data.message
  console.log(e[0])
  for(var i=0;i<Elength;i++){
  let infoOpt = {
    url: '/lost/getLostList/?messageId='+e[i].typeId,
    type: 'GET',
    data: {
      pageNo: that.data.initialpageNo,
      pageSize: that.data.initialpageSize
    },
    header: {
      'content-type': 'application/json',
      //  'authorization': wx.getStorageSync("authorization"),
    },
  }
  let infoCb = {}
  infoCb.success = function (data) {
      message_s .push(data) 
        that.setData({
          message: message_s
        })
        console.log(that.data.message);
  }

  sendAjax(infoOpt, infoCb, () => {

  });
  }
},
  onLoad: function (options) {
    //顶部样式控制
    var that = this;
    that.getlosttype();
    var length = 100 / this.data.hear.length
    that.setData({
      hearwidth: length
    })
    that.setheight();
    //内容高度控制
    // var arr = that.data.message

    // console.log(arr)
    //  var length = that.data.message[that.data.currentTab].items.length
    // console.log(length);
    // that.setData({
    //   contheigth: length*200
    // })
    // console.log(this.data.message);

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
    wx.stopPullDownRefresh();
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

  },
  plus: function () {
    if (this.data.isPopping) {
      //缩回动画
      this.popp();
      this.setData({
        isPopping: false
      })
    } else if (!this.data.isPopping) {
      //弹出动画
      this.takeback();
      this.setData({
        isPopping: true
      })
    }
  },
  input: function () {
    console.log("input")
  },
  transpond: function () {
    console.log("transpond")
  },
  collect: function () {
    wx.navigateTo({
      url: 'release/release'
    });
  },
  //弹出动画
  popp: function () {
    //plus顺时针旋转
    var animationPlus = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationcollect = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationTranspond = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationInput = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    animationPlus.rotateZ(360).step();
    animationcollect.translate(0, -60).rotateZ(360).opacity(1).step();
    animationTranspond.translate(-300, 0).rotateZ(360).opacity(1).step();
    animationInput.translate(0, -110).rotateZ(360).opacity(1).step();
    this.setData({
      animPlus: animationPlus.export(),
      animCollect: animationcollect.export(),
      animTranspond: animationTranspond.export(),
      animInput: animationInput.export(),
    })
  },
  //收回动画
  takeback: function () {
    //plus逆时针旋转
    var animationPlus = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationcollect = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationTranspond = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationInput = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    animationPlus.rotateZ(0).step();
    animationcollect.translate(0, 0).rotateZ(0).opacity(0).step();
    animationTranspond.translate(0, 0).rotateZ(0).opacity(0).step();
    animationInput.translate(0, 0).rotateZ(0).opacity(0).step();
    this.setData({
      animPlus: animationPlus.export(),
      animCollect: animationcollect.export(),
      animTranspond: animationTranspond.export(),
      animInput: animationInput.export(),
    })
  },
})