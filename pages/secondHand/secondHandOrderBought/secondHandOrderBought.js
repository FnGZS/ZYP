const url = require('../../../config.js')
const sendAjax = require('../../../utils/sendAjax.js')
Page({
  data: {
    currentTab: 0,
    status: '',
    pageNo: 1,
    pageSize: 5,
    orderList: []
  },
  onLoad: function(options) {
    // this.getOrderList();
  },
  //单击导航栏
  clickMenu: function(e) {
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
  //跳转订单详情
  toOrderDetail: function(e) {
    var orderId = e.currentTarget.dataset.orderid;
    wx.navigateTo({
      url: '../secondHandOrderDetail/secondHandOrderDetail?orderId=' + orderId + '&isBuyer=1',
    })
  },
  //获取订单列表
  getOrderList: function() {
    var that = this;
    var status = this.data.status;
    var pageNo = this.data.pageNo;
    var pageSize = this.data.pageSize;
    let infoOpt = {
      url: '/secondary/order/orderList',
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
    infoCb.success = function(res) {
      console.log(res);
      var arr = res.tags;
      var orderList = that.data.orderList;
      if (arr.length == 0 && orderList.length != 0) {
        wx.hideLoading();
        setTimeout(function() {
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
    sendAjax(infoOpt, infoCb, () => {});
  },
  //取消订单
  cancelOrder: function (e) {
    var orderId = e.currentTarget.dataset.orderid;
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认取消该订单吗',
      success(res) {
        if (res.confirm) {
          let infoOpt = {
            url: '/secondary/order/orderCancel?id=' + orderId,
            type: 'DELETE',
            data: {
            },
            header: {
              'content-type': 'application/json',
              'authorization': wx.getStorageSync('userinfo').authorization
            },
          }
          let infoCb = {}
          infoCb.success = function (res) {
            console.log(res);
            if (res.message == "取消订单成功"){
              wx.showModal({
                title: '提示',
                content: '取消成功',
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
        } else if (res.cancel) { }
      }
    })
  },
  //去付款
  toPay: function(e) {
    var that = this;
    var price = e.currentTarget.dataset.price;
    var orderId = e.currentTarget.dataset.orderid;
    wx.login({
      success: resp => {
        let infoOpt = {
          url: '/pay/recharge',
          type: 'POST',
          data: {
            platCode: resp.code,
            fee: price,
            orderId: orderId,
            type: 1
          },
          header: {
            'content-type': 'application/json',
          },
        }
        let infoCb = {}
        infoCb.success = function(res) {
          console.log(res);
          wx.requestPayment({
            timeStamp: res.timeStamp,
            nonceStr: res.nonceStr,
            package: res.pkg,
            signType: 'MD5',
            paySign: res.paySign,
            success(res) {
              console.log(res)
              wx.navigateTo({
                url: '../secondHandPaySuccess/secondHandPaySuccess',
              })

            },
            fail(res) {
              console.log(res)
            }
          })
        }
        infoCb.beforeSend = () => {}
        sendAjax(infoOpt, infoCb, () => {});
      }
    })
  },
  //确认收货
  confirmOrder:function(e){
    var that = this;
    var orderId = e.currentTarget.dataset.orderid;
    wx.showModal({
      title: '提示',
      content: '确认收货吗？',
      success(res) {
        if (res.confirm) {
          let infoOpt = {
            url: '/secondary/order/orderAccept',
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
            if (res.message == '收货成功') {
              wx.showModal({
                title: '提示',
                content: '确认收货成功',
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
  onReady: function() {},
  onShow: function() {
    this.setData({
      orderList:[],
      pageNo: 1,
    })
    this.getOrderList();
  },
  onHide: function() {},
  onUnload: function() {},
  onPullDownRefresh: function() {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      pageNo: 1,
      orderList: [],
    })
    this.getOrderList();
    wx.stopPullDownRefresh();
  },
  onReachBottom: function() {
    var pageNo = this.data.pageNo;
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      pageNo: pageNo + 1,
    })
    this.getOrderList();

  },
  onShareAppMessage: function() {}
})