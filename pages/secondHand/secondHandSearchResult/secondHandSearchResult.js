const url = require('../../../config.js')
const sendAjax = require('../../../utils/sendAjax.js')
Page({

  data: {
    content:'', //搜索的内容
    goodsList: [], //商品列表
    pageNo: 1,
    pageSize: 5,
    isBottom: false, //是否到底
    lodingHidden: true, //加载是否隐藏
    noThingHidden:true //没有搜索结果是否隐藏
  },
  onLoad: function (options) {
    var that = this;
    this.setData({
      content: options.content
      // content:'黑蛇'
    });
    this.search(); //搜索
  },
  //搜索
  search:function(){
    var that = this;
    var content = this.data.content;
    var pageNo = this.data.pageNo;
    var pageSize = this.data.pageSize;
    let infoOpt = {
      url: '/secondary/search',
      type: 'GET',
      data: {
        keyWord: content,
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
      var goodsList = res.list;
      for (var i = 0; i < goodsList.length; i++) {
        var arr = goodsList[i].goodsImg;
        goodsList[i]['goodsImg'] = JSON.parse(arr);
      }
      that.setData({
        goodsList: goodsList,
        lodingHidden: true
      })
      if(goodsList.length == 0){
        that.setData({
          noThingHidden:false
        })
      }
    }
    infoCb.beforeSend = () => {
      that.setData({
        pageNo: 1,
        goodsList: [],
        lodingHidden: false,
        noThingHidden:true,
        isBottom: false
      })
     }
    sendAjax(infoOpt, infoCb, () => { });
  },
  //上拉加载获取搜索的结果
  bottomSearch:function(){
    var that = this;
    var content = this.data.content;
    var pageNo = this.data.pageNo;
    var pageSize = this.data.pageSize;
    let infoOpt = {
      url: '/secondary/search',
      type: 'GET',
      data: {
        keyWord: content,
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
      var goodsNewList = res.list;
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
        console.log(goodsList)
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
  //搜索的内容
  serach_content: function (e) {
    this.setData({
      content: e.detail.value
    })
  },
  //跳转详情
  toDetail: function (e) {
    console.log(e)
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
  //下拉刷新
  onPullDownRefresh: function () {
    this.setData({
      pageNo: 1,
      goodsList: [],
      lodingHidden: false,
      isBottom: false
    })
    this.search();
    wx.stopPullDownRefresh();
  },
  //上拉加载
  onReachBottom: function () {
    var pageNo = this.data.pageNo;
    console.log(this.data.isBottom)
    if (this.data.isBottom == false) {
      this.setData({
        pageNo: pageNo + 1,
        lodingHidden: false
      })
      this.bottomSearch();
    }
  },
  onShareAppMessage: function () {
    
  }
})