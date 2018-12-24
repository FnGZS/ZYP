// pages/index/index.js
var app = getApp()
var url = require('../../config.js')
var URL = getApp().globalData.PHPURL;
var IMGURL = getApp().globalData.IMGURL;
const sendAjax = require('../../utils/sendAjax.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hhidden: 0,
    //轮播用的
    imgUrlsloca: [
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    circular: true,
    cloudsShow: false,
    //投票用的
    clubs: [], //原始数据
    animations: [],
    touchDot: '',
    done: false,
    time: 0,
    container: [], //记录当前5个位置为哪5个item，理解为5个容器
    curPos: 2, //记录当前显示位置是第几个容器（从0开始）
    zindex: [0, 10, 100, 10, 0], //与container中的对应
    curIndex: 1,//从显示位置的item在clubs中的index
    postions: [0, 1, 2, 3, 4],//container中5个容器所在位置
    opacities: [0, 0.8, 1, 0.8, 0],
    move: 0,
    Gradual: '',
    Gradualcon: '',
    GradualNum: 0,
    // //底部导航栏
    // footSrc2: '../../images/首页.png',
    // footSrc3: '../../images/投票.png',
    // footSrc4: '../../images/时事.png',
    // footSrc5: '../../images/我的.png'
    newpageNo: 1,
    newpageSize: 2,
    isBottomnew: 0,
    newmeslist: [],
  },
  //是否授权
  getauthSetting: function () {
    wx.getSetting({
      success: res => {
        // console.log(res.authSetting['scope.userInfo'])
        if (res.authSetting['scope.userInfo']) {
        }else {
          console.log(res)
          wx.navigateTo({
            url: '/pages/start/start',
          })
        }
      }
    })
  },
  getPhoneNumber: function (e) {
    console.log(e);
    var that = this;
    console.log(wx.getStorageSync("sessionKey"))
    var sessionkey = wx.getStorageSync("sessionKey");
    let infoOpt = {
      url: '/user/deciphering',
      type: 'GET',
      data: {
        encrypdata: e.detail.encryptedData,
        ivdata: e.detail.iv,
        sessionkey: sessionkey
      },
      header: {
        'content-type': 'application/json',
      },
    }
    let infoCb = {}
    infoCb.success = function (res) {
      console.log(res)
      // wx.showModal({
      //   title: '提示',
      //   showCancel: false,
      //   content: '66666',
      //   success: function (res) {
      //     that.setData({
      //       cloudsShow: false
      //     })
      //   }
      // })
    }
    infoCb.beforeSend = () => { }
    sendAjax(infoOpt, infoCb, () => { });
    // if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
    // wx.showModal({
    //   title: '提示',
    //   showCancel: false,
    //   content: '未授权',
    //   success: function (res) { 
    //     that.setData({
    //       cloudsShow:false
    //     })
    //   }
    // })
    // } else {
    //   wx.showModal({
    //     title: '提示',
    //     showCancel: false,
    //     content: '同意授权',
    //     success: function (res) {
    //       that.setData({
    //         cloudsShow: false
    //       })
    //      }
    //   })
    // }
  },
  // Navigation: function (event) {
  //   var that = this;
  //   app.Navigation(event, that);
  // },
  hhidden: function () {
    var that = this;
    wx.request({
      url: 'https://www.sxscott.com/crazyBird/vote/test',
      data: {
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        that.setData({
          hhidden: res.data.type
        })
      }
    })
  },
  //轮播图
  setImgBroadcast: function () {
    // console.log(222);
    var that = this;
    let infoOpt = {
      url: '/affaris/broad',
      type: 'GET',
      data: {

      },
      header: {
        'content-type': 'application/json',
        // 'authorization': wx.getStorageSync("authorization"),
      },


    }
    let infoCb = {}
    infoCb.success = function (data) {
      console.log(data.tags);
      that.setData({
        imgUrlsloca: data.tags
      })
    }

    sendAjax(infoOpt, infoCb, () => {
      // that.onLoad()
      // wx.setStorageSync('G_needUploadIndex', true)
    });

  },
  //获取时事
  getnewmes: function () {
    var that = this;
    let infoOpt = {
      url: '/affaris/getAffairsList',
      type: 'GET',
      data: {
        typeId: 2,
        pageNo: that.data.newpageNo,
        pageSize: that.data.newpageSize,
      },
      header: {
        'content-type': 'application/json',
        //  'authorization': wx.getStorageSync("authorization"),
      },
    }
    let infoCb = {}
    infoCb.success = function (data) {
      // console.log(data)
      if (data.message != null) {
        that.setData({
          isBottomnew: 1,
        })

      } else {
        var returnArr = that.data.newmeslist;
        for (var i = 0; i < data.items.length; i++) {
          returnArr.push(data.items[i]);
        }
        that.setData({
          newmeslist: returnArr
        })
        that.setData({
          isBottomnew: 0,
        })
      }
      // console.log(that.data.newmeslist);
    }
    sendAjax(infoOpt, infoCb, () => {

    });
  },
  //直播跳转
  Livebroadcast:function(e){
    wx.navigateTo({
      url: '../Livebroadcast/Livebroadcast'
    });
  },
  //投票跳转
  toVote: function (e) {
    // console.log(123);
    var isLogin = wx.getStorageSync('isLogin');
    if (isLogin == 1) {
      var id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '../vote/scholarship/scholarship?id=' + id
      });
    } else {
      wx.showModal({
        title: '请登录',
        content: '请获取头像昵称',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            wx.switchTab({
              url: '../user/user',
            })
          } else if (res.cancel) {
          }
        }
      })
    }

  },
  //投票轮播
  setvoteBroadcast: function () {
    var that = this;
    var arr = [];
    let infoOpt = {
      url: '/vote/getAction/hot',
      type: 'GET',
      data: {
      },
      header: {
        'content-type': 'application/json',
      },
    }
    let infoCb = {}
    infoCb.success = function (data) {
      // console.log(data);
      that.setData({
        clubs: data.voteList
      })
      // console.log(that.data.clubs);
      //给5个容器赋值clubs0，1，2去到pos
      //pos的0，1，2，3，4为clubs的last，0，1，2，2+1
      //即pos的2（显示）位置是clubs的1位置
      that.setPos(2, 1);

      //初始化到正确的位置
      var animation1 = wx.createAnimation({
        duration: 500,
        timingFunction: "ease",
        delay: 0
      })
      var animation2 = wx.createAnimation({
        duration: 500,
        timingFunction: "ease",
        delay: 0
      })
      var animation3 = wx.createAnimation({
        duration: 500,
        timingFunction: "ease",
        delay: 0
      })
      var animation4 = wx.createAnimation({
        duration: 500,
        timingFunction: "ease",
        delay: 0
      })
      var animation5 = wx.createAnimation({
        duration: 500,
        timingFunction: "ease",
        delay: 0
      })

      that.animation1 = animation1;
      that.animation2 = animation2;
      that.animation3 = animation3;
      that.animation4 = animation4;
      that.animation5 = animation5;

      that.animation1.translateX('0%').opacity(0).scale(0).step();
      that.animation2.translateX('-100%').opacity(0.4).scale(0.8).step();
      that.animation3.translateX('-152%').opacity(1).scale(1).step();
      that.animation4.translateX('-200%').opacity(0.4).scale(0.8).step();
      that.animation5.translateX('-300%').opacity(0).scale(0).step();

      that.setData({
        animation1: animation1.export(),
        animation2: animation2.export(),
        animation3: animation3.export(),
        animation4: animation4.export(),
        animation5: animation5.export()
      })
    }

    sendAjax(infoOpt, infoCb, () => {
      // that.onLoad()
      // wx.setStorageSync('G_needUploadIndex', true)
    });



  },
  vote: function () {
    // console.log('123123');
    var isLogin = wx.getStorageSync('isLogin');
    if (isLogin == 1) {
      wx.navigateTo({
        url: '../vote/index',
      })
    } else {
      wx.showModal({
        title: '请登录',
        content: '请获取头像昵称',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            wx.switchTab({
              url: '../user/user',
            })
          } else if (res.cancel) {
          }
        }
      })
    }
  },
  currentaffairs: function () {
    // console.log('123123');
    wx.switchTab({
      url: '../currentaffairs/currentaffairs',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    // console.log(wx.getStorageSync("isbound"))
    // if (wx.getStorageSync("isbound") == "2") {
    //   that.setData({
    //     cloudsShow:true
    //   })
    // }else{
    //   that.setData({
    //     cloudsShow: false
    //   })
    // }
    that.hhidden();
    // that.Startpage();
    // console.log(111);
    that.getauthSetting();
    that.setImgBroadcast();
    that.setvoteBroadcast();
    that.getnewmes();
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

    var that = this;
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
  //跳转详情页
  detailPage: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../currentaffairs/detailPage/detailPage?id=' + id
    });
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let that = this;
    // that.Startpage();
    that.setData({
      imgUrlsloca: [],
      indicatorDots: true,
      autoplay: true,
      interval: 5000,
      duration: 1000,
      circular: true,
      //投票用的
      clubs: [], //原始数据
      animations: [],
      touchDot: '',
      done: false,
      time: 0,
      container: [], //记录当前5个位置为哪5个item，理解为5个容器
      curPos: 2, //记录当前显示位置是第几个容器（从0开始）
      zindex: [0, 10, 100, 10, 0], //与container中的对应
      curIndex: 1,//从显示位置的item在clubs中的index
      postions: [0, 1, 2, 3, 4],//container中5个容器所在位置
      opacities: [0, 0.8, 1, 0.8, 0],
      move: 0,
      Gradual: '',
      Gradualcon: '',
      GradualNum: 0,
      // //底部导航栏
      // footSrc2: '../../images/首页.png',
      // footSrc3: '../../images/投票.png',
      // footSrc4: '../../images/时事.png',
      // footSrc5: '../../images/我的.png'
      newpageNo: 1,
      newpageSize: 2,
      isBottomnew: 0,
      newmeslist: [],
    })
    that.setImgBroadcast();
    that.setvoteBroadcast();
    that.getnewmes();
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
  //设置位置
  /**
   * pos:显示位置在container中的位置
   * index：显示位置的clubs索引
   */
  setPos: function (pos, index) {
    let container = [];
    let p2 = pos;
    let p1 = this.findPrePos(p2);
    let p0 = this.findPrePos(p1);
    let p3 = this.findNextPos(p2);
    let p4 = this.findNextPos(p3);
    let i2 = index;
    let i1 = this.findPreIndex(i2);
    let i0 = this.findPreIndex(i1);
    let i3 = this.findNextIndex(i2);
    let i4 = this.findNextIndex(i3);
    container[p0] = this.data.clubs[i0];
    container[p1] = this.data.clubs[i1];
    container[p2] = this.data.clubs[i2];
    container[p3] = this.data.clubs[i3];
    container[p4] = this.data.clubs[i4];
    this.setData({
      container
    })
  },
  /**
   * container中的位置
   */
  findNextPos: function (pos) {
    if (pos != 4) {
      return pos + 1;
    }
    return 0;

  },
  findPrePos: function (pos) {
    if (pos != 0) {
      return pos - 1;
    }
    return 4;
  },

  //触摸开始事件
  touchstart: function (e) {
    this.data.touchDot = e.touches[0].pageX;
    var that = this;
    this.data.interval = setInterval(function () {
      that.data.time += 1;
    }, 100);
  },
  //触摸移动事件
  touchmove: function (e) {
    let touchMove = e.touches[0].pageX;
    let touchDot = this.data.touchDot;
    let time = this.data.time;

    //向左滑动
    if (touchMove - touchDot <= -40 && time < 10 && !this.data.done) {
      this.data.done = true;
      this.scrollLeft();
    }
    //向右滑动
    if (touchMove - touchDot >= 40 && time < 10 && !this.data.done) {
      this.data.done = true;
      this.scrollRight();
    }
  },
  //触摸结束事件
  touchend: function (e) {
    clearInterval(this.data.interval);
    this.data.time = 0;
    this.data.done = false;
  },

  //向左滑动事件
  scrollLeft() {
    let container = this.data.container;
    let oldPos = this.data.curPos;
    let newPos = oldPos == 4 ? 0 : oldPos + 1;
    let newIndex = this.findNextIndex(this.data.curIndex);
    //先滑动，再赋值
    var animation1 = wx.createAnimation({
      duration: 500,
      timingFunction: "ease",
      //  delay: 0
    })
    var animation2 = wx.createAnimation({
      duration: 500,
      timingFunction: "ease",
      //  delay: 0
    })
    var animation3 = wx.createAnimation({
      duration: 500,
      timingFunction: "ease",
      //  delay: 0
    })
    var animation4 = wx.createAnimation({
      duration: 500,
      timingFunction: "ease",
      // delay: 0
    })
    var animation5 = wx.createAnimation({
      duration: 500,
      timingFunction: "ease",
      //delay: 0
    })

    this.animation1 = animation1;
    this.animation2 = animation2;
    this.animation3 = animation3;
    this.animation4 = animation4;
    this.animation5 = animation5;

    let distances = [];
    let newPostions = [];
    let newOpacities = [];
    //用新位置找位移量
    for (let i = 0; i < container.length; i++) {
      let newPos = this.findPrePos(this.data.postions[i]);
      let distance = this.findNewDistance(newPos, i);
      distances.push(distance);
      newPostions.push(newPos);
      newOpacities.push(distance[1]);
    }
    this.animation1.translateX(distances[0][0]).opacity(distances[0][1]).scale(distances[0][2]).step();
    this.animation2.translateX(distances[1][0]).opacity(distances[1][1]).scale(distances[1][2]).step();
    this.animation3.translateX(distances[2][0]).opacity(distances[2][1]).scale(distances[2][2]).step();
    this.animation4.translateX(distances[3][0]).opacity(distances[3][1]).scale(distances[3][2]).step();
    this.animation5.translateX(distances[4][0]).opacity(distances[4][1]).scale(distances[4][2]).step();

    this.setData({
      opacities: newOpacities,
      postions: newPostions,
      animation1: animation1.export(),
      animation2: animation2.export(),
      animation3: animation3.export(),
      animation4: animation4.export(),
      animation5: animation5.export()
    })
    //赋值

    this.setPos(newPos, newIndex)
    this.setNewZindex(newPos)
    this.setData({
      curPos: newPos,
      curIndex: newIndex,
    })
  },
  //向右滑动事件
  scrollRight() {
    let container = this.data.container;
    let oldPos = this.data.curPos;
    let newPos = oldPos == 0 ? 4 : oldPos - 1;
    let newIndex = this.findPreIndex(this.data.curIndex);
    //先滑动，再赋值
    var animation1 = wx.createAnimation({
      duration: 500,
      timingFunction: "ease",
      delay: 0
    })
    var animation2 = wx.createAnimation({
      duration: 500,
      timingFunction: "ease",
      delay: 0
    })
    var animation3 = wx.createAnimation({
      duration: 500,
      timingFunction: "ease",
      delay: 0
    })
    var animation4 = wx.createAnimation({
      duration: 500,
      timingFunction: "ease",
      delay: 0
    })
    var animation5 = wx.createAnimation({
      duration: 500,
      timingFunction: "ease",
      delay: 0
    })

    this.animation1 = animation1;
    this.animation2 = animation2;
    this.animation3 = animation3;
    this.animation4 = animation4;
    this.animation5 = animation5;

    let distances = [];
    let newPostions = [];
    let newOpacities = [];
    //用新位置找位移量
    for (let i = 0; i < container.length; i++) {
      let newPos = this.findNextPos(this.data.postions[i]);
      let distance = this.findNewDistance(newPos, i);
      distances.push(distance);
      newPostions.push(newPos);
      newOpacities.push(distance[1]);
    }
    this.animation1.translateX(distances[0][0]).opacity(distances[0][1]).scale(distances[0][2]).step();
    this.animation2.translateX(distances[1][0]).opacity(distances[1][1]).scale(distances[1][2]).step();
    this.animation3.translateX(distances[2][0]).opacity(distances[2][1]).scale(distances[2][2]).step();
    this.animation4.translateX(distances[3][0]).opacity(distances[3][1]).scale(distances[3][2]).step();
    this.animation5.translateX(distances[4][0]).opacity(distances[4][1]).scale(distances[4][2]).step();

    this.setData({
      opacities: newOpacities,
      postions: newPostions,
      animation1: animation1.export(),
      animation2: animation2.export(),
      animation3: animation3.export(),
      animation4: animation4.export(),
      animation5: animation5.export()
    })
    //赋值

    this.setPos(newPos, newIndex)
    this.setNewZindex(newPos)
    this.setData({
      curPos: newPos,
      curIndex: newIndex,
    })
  },
  /**
   * newPos:新的他要到的的位置
   */
  findNewDistance(newPos, index) {
    let newDistances = [];
    switch (newPos) {
      case 0:
        newDistances = [0 - 100 * index + '%', 0, 0];
        break;
      case 1:
        newDistances = [0 - 100 * index + '%', 0.4, 0.8];
        break;
      case 2:
        newDistances = [48 - 100 * index + '%', 1, 1];
        break;
      case 3:
        newDistances = [100 - 100 * index + '%', 0.4, 0.8];
        break;
      case 4:
        newDistances = [100 - 100 * index + '%', 0, 0];
        break;
    }
    return newDistances;
  },
  setNewZindex(newPos) {
    let zindexes = [];
    zindexes[newPos] = 100;
    let nextPos = this.findNextPos(newPos);
    zindexes[nextPos] = 10;
    let nnextPos = this.findNextPos(nextPos);
    zindexes[nnextPos] = 0;
    let prePos = this.findPrePos(newPos);
    zindexes[prePos] = 10;
    let pprePos = this.findPrePos(prePos);
    zindexes[pprePos] = 0;
    this.setData({
      zindex: zindexes
    })
  },
  findNextIndex(index) {
    if (index != this.data.clubs.length - 1) {
      return index + 1;
    }
    return 0;
  },
  findPreIndex(index) {
    if (index != 0) {
      return index - 1;
    }
    return this.data.clubs.length - 1;
  },
  //跳转创新创业
  toInnovate: function () {
    wx.navigateTo({
      url: '../innovate/innovate',
    })
  },
  //跳转校园二手
  toSecondHand: function () {
    wx.navigateTo({
      url: '../secondHand/secondHand',
    })
  },
  //暂未开发
  noDevelop: function () {
    wx.showToast({
      title: '暂未开放，敬请期待ha~',
      icon: 'none',
      duration: 1000
    })
  },
  LostFound: function () {
    wx.navigateTo({
      url: '../LostFound/LostFound'
    });
  },
  toCalendar: function () {
    wx.navigateTo({
      url: '../calendar/calendar',
    })
  }
})