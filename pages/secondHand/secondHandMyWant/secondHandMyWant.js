const url = require('../../../config.js')
const sendAjax = require('../../../utils/sendAjax.js')
Page({
  data: {
    currentTab: 0,
    status: 1,
    goodsList: [], //商品列表
    pageNo: 1,
    pageSize: 4,
    isBottom: false //是否到底
  },
  onLoad: function(options) {
    this.getCollectionList();
  },
  //单击导航栏
  clickMenu: function(e) {
    var current = e.currentTarget.dataset.current; //获取当前tab的index
    var status = e.currentTarget.dataset.status;
    this.setData({
      currentTab: current,
      status: status,
      goodsList: [],
      pageNo: 1,
      isBottom: false
    })
    this.getCollectionList();
  },
  //获取收藏的列表
  getCollectionList: function() {
    var that = this;
    var pageNo = this.data.pageNo;
    var pageSize = this.data.pageSize;
    var status = this.data.status;
    let infoOpt = {
      url: '/secondary/collectionList',
      type: 'GET',
      data: {
        status: status,
        pageNo: pageNo,
        pageSize: pageSize
      },
      header: {
        'content-type': 'application/json',
        'authorization': wx.getStorageSync('userinfo').authorization
      },
    }
    let infoCb = {}
    infoCb.success = function(res) {
      var goodsNewList = res.items;
      var goodsList = that.data.goodsList;
      if (goodsNewList.length == 0 && goodsList.length != 0) {
        that.setData({
          isBottom: true
        })
        wx.hideLoading();
      } else {
        for (var i = 0; i < goodsNewList.length; i++) {
          var arr = goodsNewList[i].goodsImg;
          goodsNewList[i]['goodsImg'] = JSON.parse(arr);
          goodsList.push(goodsNewList[i]);
        }
        console.log(goodsList)
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
  //跳转详情
  toDetail: function(e) {
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
  onShow: function() {},
  onHide: function() {},
  onUnload: function() {},
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh();
  },
  onReachBottom: function() {
    var pageNo = this.data.pageNo;
    console.log(this.data.isBottom)
    if (this.data.isBottom == false) {
      this.setData({
        pageNo: pageNo + 1,
      })
      this.getCollectionList();
    }

  },
  onShareAppMessage: function() {}
})