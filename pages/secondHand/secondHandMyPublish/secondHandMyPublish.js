const url = require('../../../config.js')
const sendAjax = require('../../../utils/sendAjax.js')

Page({
  data: {
    currentTab:0,
    startX: 0, //开始坐标
    startY: 0,
    status:1,
    goodsList: [], //商品列表
    pageNo: 1,
    pageSize: 10,
    isBottom: false //是否到底
  },
  onLoad: function(options) {

  },
  onShow: function () { 
    if (wx.getStorageSync('userinfo').isbound != 1) {
      wx.showModal({
        title: '提示',
        content: '请先绑定学号后再进行操作',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../../user/binding/binding',
            })
          }
        }
      })
    }else{
      this.getPublishList();
    }
  },
  //单击导航栏
  clickMenu: function (e) {
    var current = e.currentTarget.dataset.current; //获取当前tab的index
    var status = e.currentTarget.dataset.status;
    this.setData({
      currentTab: current,
      status: status,
      goodsList: [],
      pageNo: 1,
      isBottom: false
    })
    this.getPublishList();
  },
  //获取发布的商品
  getPublishList: function() {
    var that = this;
    var status = this.data.status;
    var pageNo = this.data.pageNo;
    var pageSize = this.data.pageSize;
    var userId = wx.getStorageSync('userinfo').userId;
    let infoOpt = {
      url: '/secondary/user',
      type: 'GET',
      data: {
        id: userId,
        status: status,
        pageNo: pageNo,
        pageSize: pageSize
      },
      header: {
        'content-type': 'application/json',
      },
    }
    let infoCb = {}
    infoCb.success = function(res) {
      // console.log(res);
      var goodsNewList = res.list;
      var goodsList = that.data.goodsList;
      if (goodsNewList.length == 0 && goodsList.length != 0) {
        that.setData({
          isBottom:true
        })
        wx.hideLoading();
      } else {
        for (var i = 0; i < goodsNewList.length; i++) {
          var arr = goodsNewList[i].goodsImg;
          goodsNewList[i]['goodsImg'] = JSON.parse(arr);
          goodsNewList[i]['isTouchMove'] = false;
          goodsList.push(goodsNewList[i]);
        }
        // console.log(goodsList)
        that.setData({
          goodsList: goodsList,
        })
        wx.hideLoading();
      }
    }
    infoCb.beforeSend = () => {
      wx.showLoading({
        title: '加载中',
      })
    }
    sendAjax(infoOpt, infoCb, () => {});
  },

  //手指触摸动作开始 记录起点X坐标
  touchstart: function(e) {
    //开始触摸时 重置所有删除
    // console.log(e)
    this.data.goodsList.forEach(function(v, i) {
      if (v.isTouchMove) //只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      goodsList: this.data.goodsList
    })
  },
  //滑动事件处理
  touchmove: function(e) {
    var that = this,
      index = e.currentTarget.dataset.index, //当前索引
      startX = that.data.startX, //开始X坐标
      startY = that.data.startY, //开始Y坐标
      touchMoveX = e.changedTouches[0].clientX, //滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY, //滑动变化坐标
      //获取滑动角度
      angle = that.angle({
        X: startX,
        Y: startY
      }, {
        X: touchMoveX,
        Y: touchMoveY
      });
    that.data.goodsList.forEach(function(v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      goodsList: that.data.goodsList
    })
  },
  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function(start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  //删除事件
  del: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var goodsId = e.currentTarget.dataset.goodsid;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗',
      confirmColor: "#56a4ff",
      success(res) {
        if (res.confirm) {
          var goodsList = that.data.goodsList;
          goodsList.splice(index, 1); //删除
          that.setData({
            goodsList: goodsList
          }) 
          // console.log(goodsId)
          let infoOpt = {
            url: '/secondary/goods/delete/' + goodsId,
            type: 'PUT',
            data: {},
            header: {
              'content-type': 'application/json',
            },
          }
          let infoCb = {}
          infoCb.success = function (res) {
            // console.log(res);
            if(res.code == 200){
              wx.showModal({
                title: '提示',
                content: '删除成功',
                showCancel:false
              })
            }
          }
          infoCb.beforeSend = () => { }
          sendAjax(infoOpt, infoCb, () => { });
        }
      }
    });
  },
  //跳转详情
  toDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../secondHandDetail/secondHandDetail?id=' + id,
    })
  },
  //收集formId
  getFormId: function (e) {
    var formId = e.detail.formId;
    var userId = wx.getStorageSync('userinfo').userId;
    var openId = wx.getStorageSync('userinfo').openId;
    if (formId != 'the formId is a mock one') {
      var that = this;
      let infoOpt = {
        url: '/user/insertForm',
        type: 'POST',
        data: {
          userId: userId,
          openId: openId,
          formId: formId
        },
        header: {
          'content-type': 'application/json',
        },
      }
      let infoCb = {}
      infoCb.success = function (res) {
      }
      infoCb.beforeSend = () => { }
      sendAjax(infoOpt, infoCb, () => { });
    }
  },
  onReady: function() {},

  onHide: function() {},
  onUnload: function() {},
  onPullDownRefresh: function() {},
  onReachBottom: function() {
    var pageNo = this.data.pageNo;
    if (this.data.isBottom == false) {
      this.setData({
        pageNo: pageNo + 1
      })
      this.getPublishList();
    }
  },
  onShareAppMessage: function() {}
})