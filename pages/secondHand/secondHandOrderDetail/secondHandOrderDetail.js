const url = require('../../../config.js')
const sendAjax = require('../../../utils/sendAjax.js')
Page({
  data: {
    orderId:null,
    isBuyer:null,
    orderDetail:{}
  },
  onLoad: function (options) {
    var orderId = options.orderId;
    var isBuyer = options.isBuyer;
    this.setData({
      orderId: orderId,
      isBuyer: isBuyer
    })
    this.getOrderDetail();
  },
  getOrderDetail:function(){
    var that = this;
    var orderId = this.data.orderId;
    let infoOpt = {
      url: '/secondary/order/orderDetails',
      type: 'GET',
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
      var detail = res;
      detail['goodsImg'] = JSON.parse(detail.goodsImg);
      that.setData({
        orderDetail: detail
      })
    }
    infoCb.beforeSend = () => { }
    sendAjax(infoOpt, infoCb, () => { });
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
            if (res.message == "取消订单成功") {
              wx.showModal({
                title: '提示',
                content: '取消成功',
                showCancel: false,
                success(res) {
                  if (res.confirm) {
                    wx.navigateBack();
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
  toPay: function (e) {
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
        infoCb.success = function (res) {
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
                url: '../secondHandPaySuccess/secondHandPaySuccess' ,
              })

            },
            fail(res) {
              console.log(res)
            }
          })
        }
        infoCb.beforeSend = () => { }
        sendAjax(infoOpt, infoCb, () => { });
      }
    })
  },
  //确认发货
  confirmSend: function (e) {
    var that = this;
    var orderId = e.currentTarget.dataset.orderid;
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
            if (res.message == '发货成功') {
              wx.showModal({
                title: '提示',
                content: '确认发货成功',
                showCancel: false,
                success(res) {
                  if (res.confirm) {
                    wx.navigateBack();
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
  //确认收货
  confirmReceive: function (e) {
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
                    wx.navigateBack();
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
  },
  onShareAppMessage: function () {
  }
})