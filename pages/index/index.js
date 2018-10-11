// pages/index/index.js
var app = getApp()
var URL = getApp().globalData.PHPURL;
var IMGURL = getApp().globalData.IMGURL;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //轮播用的
    imgUrls: [],
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
    move:0,
    Gradual:'',
    Gradualcon: '',
    GradualNum:0,
    // //底部导航栏
    // footSrc2: '../../images/首页.png',
    // footSrc3: '../../images/投票.png',
    // footSrc4: '../../images/时事.png',
    // footSrc5: '../../images/我的.png'
  },
  // Navigation: function (event) {
  //   var that = this;
  //   app.Navigation(event, that);
  // },
//轮播图
  setImgBroadcast:function(){
    let that=this;
    console.log()
    wx.request({
      url: URL + '/Sowingmap/img_play',
      data: {
      },
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var imgUrls = JSON.parse(res.data.img)
        var arr = [];
        for (var i = 0; i < imgUrls.length; i++) {
          arr[i] = IMGURL + '/' + 'sowing_map' + '/' + imgUrls[i];
        }
        that.setData({
          imgUrls: arr
        })
      
      },

    })
  },
  //启动页动画效果
  // Startpage:function(){
  //   var GradualNum =wx.getStorageSync('GradualNum');
  //   if (GradualNum){
  //       var animation1 = wx.createAnimation({
  //         // 动画持续时间，单位ms，默认值 400
  //         duration: 9000,
  //         // timingFunction: 'ease ',
  //         // 延迟多长时间开始
  //         delay: 0,
  //       })
  //     var animation2 = wx.createAnimation({
  //       // 动画持续时间，单位ms，默认值 400
  //       duration: 6000,
  //       // timingFunction: 'ease ',
     
  //       // 延迟多长时间开始
  //        delay: 0,
  //     })
  //       this.animation1 = animation1;
  //     this.animation2 = animation2;
  //       // console.log('1143');
  //       this.animation1.opacity(1).step({ duration: 4000 }).opacity(.0).step({  duration: 3000 });
  //     this.animation2.opacity(.0).step({ duration: 3000 }).opacity(1).step({ duration: 3000 });
  //     this.setData({
  //       //输出动画
  //       Gradual: animation1.export(),
  //       Gradualcon: animation2.export(),
  //     })
  //     // const that = this
  //     // that.setData({
  //     //   Gradualcon: that.animation2.export()
  //     // })
   
  //   }
  //   wx.setStorageSync('GradualNum', 0)
  // },

  //投票轮播
  setvoteBroadcast:function(){
    var data = [{ //原始数据，可为动态
      image: '../../images/poster2.png',
      name: '投票进行中'
    },
    {
      image: '../../images/poster.png',
      name: '特等奖学金'
    },
    {
      image: '../../images/poster3.png',
      name: '全新投票系统'
    }
    ]

    this.setData({
      clubs: data
    })
    //给5个容器赋值clubs0，1，2去到pos
    //pos的0，1，2，3，4为clubs的last，0，1，2，2+1
    //即pos的2（显示）位置是clubs的1位置
    this.setPos(2, 1);

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

    this.animation1 = animation1;
    this.animation2 = animation2;
    this.animation3 = animation3;
    this.animation4 = animation4;
    this.animation5 = animation5;

    this.animation1.translateX('0%').opacity(0).scale(0).step();
    this.animation2.translateX('-100%').opacity(0.4).scale(0.8).step();
    this.animation3.translateX('-152%').opacity(1).scale(1).step();
    this.animation4.translateX('-200%').opacity(0.4).scale(0.8).step();
    this.animation5.translateX('-300%').opacity(0).scale(0).step();

    this.setData({
      animation1: animation1.export(),
      animation2: animation2.export(),
      animation3: animation3.export(),
      animation4: animation4.export(),
      animation5: animation5.export()
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     let that=this;
    // that.Startpage();
     that.setImgBroadcast();
     that.setvoteBroadcast();
    
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
    
    var that=this;

    // 动画效果组件
 


    var GradualNum = wx.getStorageSync('GradualNum');
    console.log(GradualNum);
    if (GradualNum) {
     that.setData({
       GradualNum: GradualNum
     })
      setTimeout(function () {
        that.setData({
          move: 1
        })
        wx.showTabBar({
          aniamtion: true,
        })
      }, 8000) //延
    }
  },
  //控制动画的时候底部滚动时间不被触发
stopPageScroll(){

  return;
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
  }
})