const url = require('../../../config.js')
const sendAjax = require('../../../utils/sendAjax.js')
const templeMsg = require('../../../utils/templeMsg.js')
Page({
  data: {
    orderId:null,
    isBuyer:null,
    orderDetail:{},
    canPay: 1,
    payText: '去付款',
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
    that.setData({
      canPay: 2
    })
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
          wx.hideLoading();
          if (res.message == '宝贝已经被人抢走了') {
            wx.showModal({
              title: '提示',
              content: '宝贝已经被人抢走了',
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  that.setData({
                    payText: '去付款',
                    canPay: 1
                  })
                } 
              }
            })
            
          }
          else {
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
         
        }
        infoCb.beforeSend = () => {
          wx.showLoading({
            title: '加载中',
          })
          that.setData({
            payText: '付款中…'
          })
         }
        sendAjax(infoOpt, infoCb, () => { });
      }
    })
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
                  "value": buyAddress
                },
                "keyword6": {
                  "value": res.message
                }
              };
              templeMsg.templeMsg(userId, template_id, page, data);

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
    var sellerId = e.currentTarget.dataset.sellerid;
    var orderId = e.currentTarget.dataset.orderid;
    var goodsName = e.currentTarget.dataset.goodsname;
    var orderPrice = e.currentTarget.dataset.orderprice;
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
            if (res.code == '200') {

              var template_id = 'YaajHJis-CXmlRQVzcbwhkay95BbEm29jsIvbY-ENu4';
              var page = '/pages/secondHand/secondHandOrderSold/secondHandOrderSold';
              var data = {
                "keyword1": {
                  "value": goodsName
                },
                "keyword2": {
                  "value": orderId
                },
                "keyword3": {
                  "value": orderPrice
                },
                "keyword4": {
                  "value": res.message
                }
              };
              templeMsg.templeMsg(sellerId, template_id, page, data);

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
  //跳转商品详情
  toGoodsDetail:function(e){
    var goodsid = e.currentTarget.dataset.goodsid;
    wx.navigateTo({
      url: '../secondHandDetail/secondHandDetail?id=' + goodsid,
    })
  },
  //联系卖家
  contact:function(e){
    var phone = e.currentTarget.dataset.phone;
    console.log(phone)
    wx.makePhoneCall({
      phoneNumber: phone 
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