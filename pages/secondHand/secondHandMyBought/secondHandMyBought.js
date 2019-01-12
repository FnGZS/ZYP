const url = require('../../../config.js')
const sendAjax = require('../../../utils/sendAjax.js')
Page({
  data: {
    currentTab: 0,
    goodsList: [], //商品列表
    pageNo: 1,
    pageSize: 10,
    lodingHidden: true,
    isBottom: false //是否到底
  },
  onLoad: function (options) {
    this.getPurchaseList();
  },
  getPurchaseList: function () {
    var that = this;
    var pageNo = this.data.pageNo;
    var pageSize = this.data.pageSize;
    let infoOpt = {
      url: '/secondary/purchaseList',
      type: 'GET',
      data: {
        pageNo: pageNo,
        pageSize: pageSize
      },
      header: {
        'content-type': 'application/json',
        'authorization': wx.getStorageSync('userinfo').authorization
      },
    }
    let infoCb = {}
    infoCb.success = function (res) {
      console.log(res);
      var goodsNewList = res.items;
      var goodsList = that.data.goodsList;
      if (goodsNewList.length == 0 && goodsList.length != 0) {
        that.setData({
          lodingHidden: true,
          isBottom: true
        })
      } else {
        for (var i = 0; i < goodsNewList.length; i++) {
          var arr = goodsNewList[i].goodsImg;
          goodsNewList[i]['goodsImg'] = JSON.parse(arr);
          goodsList.push(goodsNewList[i]);
        }
        // console.log(goodsList)
        that.setData({
          goodsList: goodsList,
          lodingHidden: true
        })
      }
    }
    infoCb.beforeSend = () => {
      that.setData({
        lodingHidden: false
      })
    }
    sendAjax(infoOpt, infoCb, () => { });
  },
  //跳转详情
  toDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../secondHandDetail/secondHandDetail?id=' + id,
    })
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
      this.getPurchaseList();
    }
  },
  onShareAppMessage: function () {
  }
})