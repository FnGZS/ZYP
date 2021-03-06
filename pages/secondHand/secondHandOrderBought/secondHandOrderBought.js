const url = require('../../../config.js')
const sendAjax = require('../../../utils/sendAjax.js')
const templeMsg = require('../../../utils/templeMsg.js')
Page({
  data: {
    userId:null,
    currentTab: 0,
    status: '',
    pageNo: 1,
    pageSize: 5,
    orderList: [],
    refundOrderId:'',
    hiddenRefund:true,
    input_refund:'',
    canPay: 1,
    payText: '去付款',
  },
  onLoad: function(options) {
    // this.getOrderList();
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
      var userId = wx.getStorageSync('userinfo').userId;
      console.log(userId)
      this.setData({
        orderList: [],
        pageNo: 1,
        userId: userId
      })
      this.getOrderList();
    }
   
  },
  beRobbed:function(e){
    var a = e.currentTarget.dataset.a;
    var b = e.currentTarget.dataset.b;
    console.log(a);
    console.log(b);
  },
  //单击导航栏
  clickMenu: function(e) {
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
    var goodsId = e.currentTarget.dataset.goodsid;
    console.log(goodsId)
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
            type: 1,
            goodsId: goodsId
          },
          header: {
            'content-type': 'application/json',
          },
        }
        let infoCb = {}
        infoCb.success = function(res) {
          console.log(res);
          wx.hideLoading();
          if (res.message =='宝贝已经被人抢走了'){
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
          else{
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
                // wx.hideLoading();
                that.setData({
                  canPay: 1,
                  payText: '去付款'
                })
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
        sendAjax(infoOpt, infoCb, () => {});
      }
    })

  },

  //不能去支付
  toPayno:function(){
  },
  //申请退款输入
  input_refund:function(e){
    var val = e.detail.value;
    this.setData({
      input_refund:val
    })
  },
  //申请退款
  refundOrder:function(e){
    var orderid = e.currentTarget.dataset.orderid;
    this.setData({
      hiddenRefund:false,
      input_refund:'',
      refundOrderId: orderid
    })
  },
  //确认申请退款
  confirmRefund:function(e){
    var that = this;
    var input_refund = this.data.input_refund;
    var refundOrderId = this.data.refundOrderId;
    if(input_refund == ''){
      wx.showToast({
        title: '请输入退款原因',
        icon:'none'
      })
    }else{
      let infoOpt = {
        url: '/secondary/order/orderApply',
        type: 'PUT',
        data: {
          orderId: refundOrderId,
          content: input_refund
        },
        header: {
          'content-type': 'application/json',
        },
      }
      let infoCb = {}
      infoCb.success = function (res) {
        console.log(res);
        if (res.message == '已成功申请，请耐心等待结果！'){
          that.setData({
            hiddenRefund: true
          })
          wx.showModal({
            title: '提示',
            content: '已申请退款，请耐心等待',
            showCancel:false,
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
   
  },
  cancelRefund:function(){
    this.setData({
      hiddenRefund: true
    })
  },
  //确认收货
  confirmOrder:function(e){
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
              templeMsg.templeMsg(sellerId,template_id, page, data);

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