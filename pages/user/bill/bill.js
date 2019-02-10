var url = require('../../../config.js')
const sendAjax = require('../../../utils/sendAjax.js')
Page({
  data: {
    balance:'',
    billList:[],
    pageSize:15,
    pageNo:1
  },
  onLoad: function (options) {
    this.getBalance();
    this.getBillList();
  },
  //获取用户的账户余额
  getBalance: function () {
    var that = this;
    let infoOpt = {
      url: '/secondary/order/getSecondaryCapital',
      type: 'GET',
      data: {},
      header: {
        'content-type': 'application/json',
      },
    }
    let infoCb = {}
    infoCb.success = function (res) {
      var balance = res.list.remainder.toFixed(2);
      that.setData({
        balance: balance,
      })
    }
    infoCb.beforeSend = () => { }
    sendAjax(infoOpt, infoCb, () => { });
  },
  //获取账单列表
  getBillList:function(){
    var that = this;
    var pageSize = this.data.pageSize;
    var pageNo = this.data.pageNo;
    let infoOpt = {
      url: '/pay/bill',
      type: 'GET',
      data: {
        pageSize: pageSize,
        pageNo: pageNo
      },
      header: {
        'content-type': 'application/json',
      },
    }
    let infoCb = {}
    infoCb.success = function (res) {
      var arr = res.list;
      var billList = that.data.billList;
      if (arr.length == 0 && billList.length != 0) {
        wx.hideLoading();
        setTimeout(function () {
          wx.showToast({
            title: '没有更多的账单了',
            icon: 'none',
            duration: 1000
          })
        }, 100)
      } else {
        for (var i = 0; i < arr.length; i++) {
          billList.push(arr[i]);
        }
        that.setData({
          billList: billList
        })
        wx.hideLoading();
      }
    }
    infoCb.beforeSend = () => { }
    sendAjax(infoOpt, infoCb, () => { });
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
  //下拉刷新
  onReachBottom: function () {
    var pageNo = this.data.pageNo;
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      pageNo: pageNo + 1,
    })
    this.getBillList();
  },
  onShareAppMessage: function () {
  }
})