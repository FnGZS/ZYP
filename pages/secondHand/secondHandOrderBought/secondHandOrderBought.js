const url = require('../../../config.js')
const sendAjax = require('../../../utils/sendAjax.js')
Page({
  data: {
    currentTab: 0,
    status: 1,
  },
  onLoad: function (options) {
  },
  //单击导航栏
  clickMenu: function (e) {
    var current = e.currentTarget.dataset.current; //获取当前tab的index
    var status = e.currentTarget.dataset.status;
    this.setData({
      currentTab: current,
      status: status
    })
  },
  toOrderDetail: function () {
    wx.navigateTo({
      url: '../secondHandOrderDetail/secondHandOrderDetail',
    })
  },
  toPay: function () {
    var that = this;
    wx.login({
      success: resp => {
        let infoOpt = {
          url: '/pay/recharge',
          type: 'POST',
          data: {
            platCode: resp.code,
            fee: 0.01,
            orderId: '12019010922002215352671929855420',
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
                url: '../secondHandPaySuccess/secondHandPaySuccess',
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