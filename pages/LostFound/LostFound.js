// pages/LostFound/LostFound.js
const sendAjax = require('../../utils/sendAjax.js')
const sendAjax_API = require('../../utils/sendAjaxAPI.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    //测试数据
    hearwidth: 0,
    //内容高度
    contheigth: 0,
    winHeight: 0,
    //初始的頁面:
    initialpageNo: [],
    initialpageSize: 10,
    hear: [{
      id: 0,
      name: '寻主'
    }, {
      id: 1,
      name: '寻物'
    }],
    message: [],
    message_s: [],
    isPopping: false, //是否已经弹出
    animPlus: {}, //旋转动画
    animCollect: {}, //item位移,透明度
    animTranspond: {}, //item位移,透明度
    animInput: {}, //item位移,透明度
    isShow: false,
    txt: '',
    iconClass: 'icon-cry',
    // scrollTop:[]
  },
  setheight: function() {
    var that = this;
    that.setData({
      winHeight: that.data.message[that.data.currentTab].items.length * 200 + 100
    })

  },
  //滑动切换
  swiperTab: function(e) {
    var _this = this;
    console.log(e);
    _this.setData({
      currentTab: e.detail.current
    });
    _this.setheight()
    // wx.pageScrollTo({
    //   scrollTop: _this.data.scrollTop[e.detail.current]
    // })
  },
  //点击切换
  clickTab: function(e) {
    var _this = this;
    // console.log(_this.data.newhigth);
    if (_this.data.currentTab === e.target.dataset.current) {

      return false;
    } else {

      _this.setData({
        currentTab: e.target.dataset.current,

      })
      _this.setheight()

    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  //初始数据 
  getlosttype: function() {
    var that = this;
    let infoOpt = {
      url: '/lost/lostMessage',
      type: 'GET',
      data: {

      },
      header: {
        'content-type': 'application/json',
        //  'authorization': wx.getStorageSync("authorization"),
      },
    }
    let infoCb = {}
    infoCb.success = function(data) {
      console.log(data.lostTypeList);
      that.setData({
        hear: data.lostTypeList
      })
      that.setData({
        message: []
      })
      var num = 0
      console.log(that.data.fnum, that.data.hear.length - 1)
      that.getLostList(that.data.hear, num, that.data.hear.length - 1)
      var length = 100 / that.data.hear.length
      that.setData({
        hearwidth: length
      })
    }

    sendAjax_API.sendAjax_API(infoOpt, infoCb).then((res) => {

    })
  },


  getLostList: function(e, num, typelength) {
    var Elength = e;
    var that = this;

    console.log(num)
    console.log(that.data.message);
    var message_s = that.data.message
    console.log(message_s)
    var pageNo = that.data.initialpageNo;

    // console.log(e[num].typeId)
    pageNo[num] = 1
    let infoOpt = {
      url: '/lost/getLostList/?messageId=' + num,
      type: 'GET',
      data: {
        pageNo: pageNo[num],
        pageSize: that.data.initialpageSize
      },
      header: {
        'content-type': 'application/json',
        //  'authorization': wx.getStorageSync("authorization"),
      },
    }
    let infoCb = {}
    infoCb.success = function(data) {
      console.log(data);
      data['bottonshow'] = 1
      message_s = data;

      console.log(message_s)
      var message_num = 'message[' + num + ']'
      that.setData({
        [message_num]: message_s,
        initialpageNo: pageNo
      })
      console.log(that.data.message[0])
      // 初始默认高度默认为0items 的高度
      if (that.data.message[0] != undefined)
        that.setData({
          winHeight: that.data.message[0].items.length * 250 + 100
        })

    }
    sendAjax_API.sendAjax_API(infoOpt, infoCb).then((res) => {
      console.log(res);
    })
    if (num < typelength) {
      that.getLostList(e, num + 1, typelength)
    } else {
      return;
    }
  },
  tosearch:function(){
    var that=this;
    // console.log(123)
    wx.navigateTo({
      url: 'search/search'
    })
  },
  getLostListReachBottom: function(currentTab) {
    var that = this;
    //分页需用数组处理 每个分类的分页都要单独出来
    var pageNo = that.data.initialpageNo
    pageNo[currentTab] = pageNo[currentTab] + 1
    var pageSize = that.data.initialpageSize
    var message = that.data.message;
    let infoOpt = {
      url: '/lost/getLostList/?messageId=' + currentTab,
      type: 'GET',
      data: {
        pageNo: pageNo[currentTab],
        pageSize: pageSize
      },
      header: {
        'content-type': 'application/json',
        //  'authorization': wx.getStorageSync("authorization"),
      },
    }
    let infoCb = {}
    infoCb.success = function(data) {
      // message[currentTab].items.concat (data.items);
      var messagelength = message[currentTab].items.length;
      var datalength = data.items.length;
      var cnt = 0;
      for (var i = messagelength; i < datalength + messagelength; i++) {
        message[currentTab].items[i] = data.items[cnt];
        cnt++;
      }
      console.log(message);
      if (data.items == '') {
        app.toastShow(that, "暂无更多", "icon-cry");
        message[currentTab].bottonshow = 0
      } else {
        message[currentTab].bottonshow = 1
        that.setData({
          message: message,
          initialpageNo: pageNo
        })
      }
      that.setData({
        message: message,
      })

      console.log(data)
      //初始默认高度默认为0items 的高度
      that.setData({
        winHeight: that.data.message[currentTab].items.length * 250 + 100
      })
    }

    sendAjax(infoOpt, infoCb, () => {

    });
  },
  onLoad: function(options) {
    //顶部样式控制
    var that = this;
    that.getlosttype();

    // that.setheight();
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
  goTop: function(e) { // 一键回到顶部
    if (wx.pageScrollTo) {
      var arr = [0, 100]
      wx.pageScrollTo({
        scrollTop: arr[1]
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  detailPage: function(e) {
    console.log(e.currentTarget.dataset.conter)
    wx.navigateTo({
      url: 'detail/detail?detail=' + e.currentTarget.dataset.conter
    });
  },
  onShow: function() {
    var that = this
    that.setData({
      winHeight: 0,
      //初始的頁面:
      initialpageNo: [],
      initialpageSize: 10,
      isShow: false,
      txt: '',
      iconClass: 'icon-cry',
      message: [],
    })
    that.getlosttype();

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
  reload:function(){
    var that = this;
    that.setData({
      winHeight: 0,
      //初始的頁面:
      initialpageNo: [],
      initialpageSize: 10,
      isShow: false,
      txt: '',
      iconClass: 'icon-cry',
      message: [],
    })
    that.getlosttype();
  },
  onPullDownRefresh: function() {
    var that = this;
 
    that.reload();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onPageScroll: function(e) {
    // var that=this;
    // var arr=that.data.scrollTop
     
    //  arr[that.data.currentTab]=e.scrollTop;
    // that.setData({
    //   scrollTop:arr
    // })
    // console.log(arr); //{scrollTop:99}
  },
  onReachBottom: function() {
    this.getLostListReachBottom(this.data.currentTab)
    console.log(this.data.message);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  plus: function() {
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
  input: function() {
    console.log("input")
  },
  transpond: function() {
    console.log("transpond")
  },
  collect: function() {
    wx.navigateTo({
      url: 'release/release'
    });
  },
  //弹出动画
  popp: function() {
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
  takeback: function() {
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