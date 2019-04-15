const url = require('../../../config.js')
const sendAjax = require('../../../utils/sendAjax.js')
const templeMsg = require('../../../utils/templeMsg.js')
Page({
  data: {
    userId: null,
    goodsDetail: [{
      'pic': '',
      'name': '',
      'price': 0,
      'label': '',
      'number': 1,
    }],
    addressList: [],
    isNeedAddress: null,
    addressId: '',
    address: '',
    addressName: '',
    addressPhone: '',
    isSelect: 0,
    canPay:1,
    payText:'支付',
    lodingHidden: true
  },
  onLoad: function(options) {
    var detail = JSON.parse(options.detail);
    console.log(detail)
    var userId = wx.getStorageSync('userinfo').userId;
    this.setData({
      userId: userId,
      goodsDetail: detail
    })
    this.getAddressList();
  },
  //获取用户的地址
  getAddressList: function() {
    var userId = this.data.userId;
    var that = this;
    let infoOpt = {
      url: '/secondary/userAddress/' + userId,
      type: 'GET',
      data: {},
      header: {
        'content-type': 'application/json',
      },
    }
    let infoCb = {}
    infoCb.success = function(res) {
      let pages = getCurrentPages();
      let currPage = pages[pages.length - 1];
      if (res.list.length == 0) {
        that.setData({
          addressId: '',
          address: '',
          addressName: '',
          addressPhone: '',
          isNeedAddress: 1,
          lodingHidden: true,
          isSelect: 0
        })
      } else if (currPage.data.isSelect == 0 && that.data.addressId == '') {
        that.setData({
          addressId: res.list[0].id,
          address: res.list[0].address,
          addressName: res.list[0].name,
          addressPhone: res.list[0].telephone,
          isNeedAddress: 0,
          lodingHidden: true,
          isSelect: 0
        })
      } else if (currPage.data.isSelect == 1) {
        that.setData({ //将携带的参数赋值
          addressId: currPage.data.addressId,
          address: currPage.data.address,
          addressName: currPage.data.addressName,
          addressPhone: currPage.data.addressPhone,
          isNeedAddress: 0,
          lodingHidden: true,
          isSelect: 0
        });
      } else {
        that.setData({
          isNeedAddress: 0,
          lodingHidden: true,
          isSelect: 0
        });
      }
    }
    infoCb.beforeSend = () => {
      that.setData({
        lodingHidden: false
      })
    }
    sendAjax(infoOpt, infoCb, () => {});
  },
  addAddress: function() {
    wx.navigateTo({
      url: '../secondHandAddressSelect/secondHandAddressSelect',
    })
  },
  selectAddress: function() {
    wx.navigateTo({
      url: '../secondHandAddressSelect/secondHandAddressSelect',
    })
  },
  //支付
  payBtn: function(e) {

    var that = this;
    var goodsName = e.currentTarget.dataset.goodsname;
    var goodsPrice = e.currentTarget.dataset.goodsprice;
    var userId = e.currentTarget.dataset.userid;
    that.setData({
      canPay:2
    })
    console.log(that.data.goodsDetail)
    wx.login({
      success: resp => {
        var that = this;
        let infoOpt = {
          url: '/secondary/order/create',
          type: 'POST',
          data: {
            platCode: resp.code,
            goodsId: that.data.goodsDetail.id,
            price: that.data.goodsDetail.price,
            fee: that.data.goodsDetail.price,
            consignee: that.data.addressName,
            receivePhone: that.data.addressPhone,
            receiveAddress: that.data.address,
          },
          header: {
            'content-type': 'application/json',
          },
        }
        let infoCb = {}
        infoCb.success = function(res) {
          console.log(res);
          wx.hideLoading();
          wx.requestPayment({
            timeStamp: res.orderInfo.timeStamp,
            nonceStr: res.orderInfo.nonceStr,
            package: res.orderInfo.pkg,
            signType: 'MD5',
            paySign: res.orderInfo.paySign,
            success(res) {
              console.log(res)
              var template_id = 'V1SlWA-7qIlDkFEo60ERr1HJRQ4brEvSDBm8FPvpk4A';
              var page = '/pages/secondHand/secondHandOrderSold/secondHandOrderSold';
              var data = {
                "keyword1": {
                  "value": goodsName
                },
                "keyword2": {
                  "value": goodsPrice
                },
                "keyword3": {
                  "value": '已支付'
                },
                "keyword4": {
                  "value": '微信支付'
                }
              };
              templeMsg.templeMsg(userId, template_id, page, data);
              
              wx.navigateTo({
                url: '../secondHandPaySuccess/secondHandPaySuccess',
              })

            },
            fail(res) {
              console.log(res)
              that.setData({
                canPay:1,
                payText: '支付'
              })
              wx.hideLoading();
            }
          })
        }
        infoCb.beforeSend = () => {
          wx.showLoading({
            title: '加载中',
          })
          that.setData({
            payText:'支付中…'
          })
        }
        sendAjax(infoOpt, infoCb, () => {});
      }
    })
  },
  onReady: function() {},
  onShow: function() {

    this.getAddressList();
  },
  onHide: function() {},
  onUnload: function() {},
  onPullDownRefresh: function() {},
  onReachBottom: function() {},
  onShareAppMessage: function() {}
})