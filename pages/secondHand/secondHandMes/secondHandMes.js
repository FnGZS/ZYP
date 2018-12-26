const url = require('../../../config.js')
const sendAjax = require('../../../utils/sendAjax.js')
Page({
  data: {
    userId:null,
    startXSys: 0, //开始坐标
    startYSys: 0,
    startXUser: 0, //开始坐标
    startYUser: 0,
    systemMes:[],
    userMes: [],
    pageNo: 1,
    pageSize: 10,
    lodingHidden: true,
    isBottom: false //是否到底
  },
  onLoad: function (options) {
    var userId = wx.getStorageSync('userId');
    this.setData({
      userId:userId
    })
    this.getSystemMes();
    this.getUserMes();
  },
  //获取系统消息
  getSystemMes:function(){
    var that = this;
    var userId = this.data.userId;
    let infoOpt = {
      url: '/secondary/violationMessage/' + userId,
      type: 'GET',
      data: {},
      header: {
        'content-type': 'application/json',
      },
    }
    let infoCb = {}
    infoCb.success = function (res) {
      console.log(res);
      that.setData({
        systemMes:res.list
      })
    }
    infoCb.beforeSend = () => {
      that.setData({
        lodingHidden:false
      })
     }
    sendAjax(infoOpt, infoCb, () => { });
  },
  //获取用户消息
  getUserMes:function(){
    var that = this;
    var userId = this.data.userId;
    var pageNo = this.data.pageNo;
    var pageSize = this.data.pageSize;
    let infoOpt = {
      url: '/secondary/commentMessage',
      type: 'GET',
      data: {
        userId:userId,
        pageNo: pageNo,
        pageSize: pageSize
      },
      header: {
        'content-type': 'application/json',
      },
    }
    let infoCb = {}
    infoCb.success = function (res) {
      console.log(res);
      var userNewMes = res.list;
      var userMes = that.data.userMes;

      if (userNewMes.length == 0 && userMes.length != 0) {
        that.setData({
          lodingHidden: true,
          isBottom: true
        })
      } else {
        for (var i = 0; i < userNewMes.length; i++) {
          userNewMes[i]['isTouchMove'] = false;
          userMes.push(userNewMes[i]);
        }
        // console.log(goodsList)
        that.setData({
          userMes: userMes,
          lodingHidden: true
        })
      }
    }
    infoCb.beforeSend = () => { 
      that.setData({
        lodingHidden:false
      })
    }
    sendAjax(infoOpt, infoCb, () => { });
  },
  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    // console.log(e)
    this.data.systemMes.forEach(function (v, i) {
      if (v.isTouchMove) //只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startXSys: e.changedTouches[0].clientX,
      startYSys: e.changedTouches[0].clientY,
      systemMes: this.data.systemMes
    })
  },
  touchstart1: function (e) {
    this.data.userMes.forEach(function (v, i) {
      if (v.isTouchMove) 
        v.isTouchMove = false;
    })
    this.setData({
      startXUser: e.changedTouches[0].clientX,
      startYUser: e.changedTouches[0].clientY,
      userMes: this.data.userMes
    })
  },
  //滑动事件处理
  touchmove: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index, //当前索引
      startXSys = that.data.startXSys, //开始X坐标
      startYSys = that.data.startYSys, //开始Y坐标
      touchMoveX = e.changedTouches[0].clientX, //滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY, //滑动变化坐标
      //获取滑动角度
      angle = that.angle({
        X: startXSys,
        Y: startYSys
      }, {
          X: touchMoveX,
          Y: touchMoveY
        });
    that.data.systemMes.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startXSys) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      systemMes: that.data.systemMes
    })
  },
  touchmove1: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index, //当前索引
      startXUser = that.data.startXUser, //开始X坐标
      startYUser = that.data.startYUser, //开始Y坐标
      touchMoveX = e.changedTouches[0].clientX, //滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY, //滑动变化坐标
      //获取滑动角度
      angle = that.angle({
        X: startXUser,
        Y: startYUser
      }, {
          X: touchMoveX,
          Y: touchMoveY
        });
    that.data.userMes.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startXUser) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      userMes: that.data.userMes
    })
  },
  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  //删除事件
  del: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    // var goodsId = e.currentTarget.dataset.goodsid;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗',
      confirmColor: "#56a4ff",
      success(res) {
        if (res.confirm) {
          var systemMes = that.data.systemMes;
          systemMes.splice(index, 1); //删除
          that.setData({
            systemMes: systemMes
          })
          // console.log(goodsId)
        }
      }
    });
  },
  //删除事件
  del1: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    // var goodsId = e.currentTarget.dataset.goodsid;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗',
      confirmColor: "#56a4ff",
      success(res) {
        if (res.confirm) {
          var userMes = that.data.userMes;
          userMes.splice(index, 1); //删除
          that.setData({
            userMes: userMes
          })
          // console.log(goodsId)
        }
      }
    });
  },
  onReady: function () {
  },
  onShow: function () {
  },
  onHide: function () {
  },
  onUnload: function () {
  },
  onPullDownRefresh: function () {
  },
  onReachBottom: function () {
    var pageNo = this.data.pageNo;
    if (this.data.isBottom == false) {
      this.setData({
        pageNo: pageNo + 1
      })
      this.getUserMes();
    }
  },
  onShareAppMessage: function () {
  }
})