const url = require('../../../config.js')
const sendAjax = require('../../../utils/sendAjax.js')
const templeMsg = require('../../../utils/templeMsg.js')
Page({
  data: {
    currentTab: 0,
    status: '',
    pageNo: 1,
    pageSize: 5,
    orderList: []
  },
  onLoad: function (options) {
    // this.getOrderList();
  },
  //单击导航栏
  clickMenu: function (e) {
    console.log(11)
    var current = e.currentTarget.dataset.current; //获取当前tab的index
    var status = e.currentTarget.dataset.status;
    this.setData({
      currentTab: current,
      status: status,
      orderList: [],
      pageNo: 1
    })
    this.getOrderList();
  },
  toOrderDetail: function (e) {
    var orderId = e.currentTarget.dataset.orderid;
    wx.navigateTo({
      url: '../secondHandOrderDetail/secondHandOrderDetail?orderId=' + orderId + '&isBuyer=0',
    })
  },
  //获取订单列表
  getOrderList: function () {
    var that = this;
    var status = this.data.status;
    var pageNo = this.data.pageNo;
    var pageSize = this.data.pageSize;
    let infoOpt = {
      url: '/secondary/order/vendorOrderList',
      type: 'GET',
      data: {
        orderStatus: status,
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
      var arr = res.tags;
      var orderList = that.data.orderList;
      if (arr.length == 0 && orderList.length != 0) {
        wx.hideLoading();
        setTimeout(function () {
          wx.showToast({
            title: '没有更多的订单了',
            icon: 'none',
            duration: 1000
          })
        }, 100)
      } else {
        for (var i = 0; i < arr.length; i++) {
          arr[i]['goodsImg'] = JSON.parse(arr[i].goodsImg)
          orderList.push(arr[i]);
        }
        that.setData({
          orderList: orderList
        })
        wx.hideLoading();
      }
    }
    infoCb.beforeSend = () => {
      wx.showLoading({
        title: '加载中',
      })
    }
    sendAjax(infoOpt, infoCb, () => { });
  },
  //确认发货
  confirmSend: function (e) {
    var that = this;
    var userId = e.currentTarget.dataset.userid;
    var orderId = e.currentTarget.dataset.orderid;
    var goodsName = e.currentTarget.dataset.goodsname;
    var buyName = e.currentTarget.dataset.buyname;
    var buyPhone = e.currentTarget.dataset.buyphone;
    var buyAddress = e.currentTarget.dataset.buyaddress;
    wx.showModal({
      title: '提示',
      content: '确认发货吗？',
      success(res) {
        if (res.confirm) {
          let infoOpt = {
            url: '/secondary/order/orderDelivery',
            type: 'PUT',
            data: {
              orderId: orderId
            },
            header: {
              'content-type': 'application/json',
            },
          }
          let infoCb = {}
          infoCb.success = function (res) {
            console.log(res);
            if (res.code == '200') {
              //发货模板消息
              var template_id = 'LBburnQiXBFUjsxc2OkbWE8sCIwZosv1L5FGZQaZMfU';
              var page = '/pages/secondHand/secondHandOrderBought/secondHandOrderBought';
              var data = {
                "keyword1": {
                  "value": goodsName
                },
                "keyword2": {
                  "value": orderId
                },
                "keyword3": {
                  "value": buyName
                },
                "keyword4": {
                  "value": buyPhone
                },
                 "keyword5": {
                  "value":buyAddress
                },
                "keyword6": {
                  "value": res.message
                }
              };
              templeMsg.templeMsg(userId,template_id, page, data);

              wx.showModal({
                title: '提示',
                content: '确认发货成功',
                showCancel: false,
                success(res) {
                  if (res.confirm) {
                    that.onPullDownRefresh();
                  }
                }
              })
            }
          }
          infoCb.beforeSend = () => { }
          sendAjax(infoOpt, infoCb, () => { });
        }
      }
    })
    
  },
  //去退款
  toRefund:function(){
    var that = this;
    let infoOpt = {
      url: '/pay/refund',
      type: 'POST',
      data: {
        type:1,
        orderId: '12019010921063193152671929833352',
        totalFee:0.01,
        refundFee: 0.01
      },
      header: {
        'content-type': 'application/json',
      },
    }
    let infoCb = {}
    infoCb.success = function (res) {
      console.log(res);
      
    }
    infoCb.beforeSend = () => { }
    sendAjax(infoOpt, infoCb, () => { });
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
  onReady: function () {
  },
  onShow: function () {
    this.setData({
      orderList: [],
      pageNo: 1,
    })
    this.getOrderList();
  },
  onHide: function () {
  },
  onUnload: function () {
  },
  onPullDownRefresh: function () {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      pageNo: 1,
      orderList: []
    })
    this.getOrderList();
    wx.stopPullDownRefresh();
  },
  onReachBottom: function () {
    var pageNo = this.data.pageNo;
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      pageNo: pageNo + 1,
    })
    this.getOrderList();
  },
  onShareAppMessage: function () {
  }
})