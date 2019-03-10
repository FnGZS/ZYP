var url = require('../../../config.js')
const sendAjax = require('../../../utils/sendAjax.js')
Page({
  data: {
    userId: null,
    balance:null, //用户余额
    tips:'',
    tipsBtnHidden:false,
    status:2,  //1：正常提现，2：错误操作
    focus:'',
    input_num:''
  },
  onLoad: function (options) {
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
              url: '../binding/binding',
            })
          }
        }
      })
    } else {
      var userId = wx.getStorageSync('userinfo').userId;
      this.setData({
        userId: userId
      })
      this.getBalance();
    }
  },
  //获取用户的账户余额
  getBalance:function(){
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
      console.log(res);
      var balance = res.list.remainder.toFixed(2);
      var tips = '当前账户余额' + balance + ',';
      that.setData({
        balance: balance,
        tips: tips,
        tipsBtnHidden: false,
        focus: true
      })
    }
    infoCb.beforeSend = () => { }
    sendAjax(infoOpt, infoCb, () => { });
  },
  //输入的内容
  input_num: function (e) {
    var reg = /^[-\+]?\d+(\.\d+)?$/;
    var val = e.detail.value;
    var balance = this.data.balance;
    this.setData({
      input_num:val
    })
    if(val == ''){
      var tips = '当前账户余额' + balance + ','
      this.setData({
        tips: tips,
        tipsBtnHidden:false,
        status:1
      })
    }else{
      if (reg.test(val)) {   //判断输入的是否为数字
        if (val.indexOf('.') > -1) {
          var num = val.split('.');
          if (num[1].length > 2) {
            var tips = '请保留小数点后两位';
            this.setData({
              status:2
            })
          } else {
            if (parseFloat(val) > parseFloat(balance)){
              var tips = '提现金额超出用户余额';
              this.setData({
                status: 2
              })
            } else if (parseFloat(val) < 1){
              var tips = '提现金额至少超过1元';
              this.setData({
                status: 2
              })
            }else{
              var service = parseFloat(val * 0.03).toFixed(2);
              var tips = '额外扣除￥' + service + '手续费（费率3%）';
              this.setData({
                status: 1
              })
            }   
          }
        } else {
          if (parseFloat(val) > parseFloat(balance)) {
            var tips = '提现金额超出用户余额';
            this.setData({
              status: 2
            })
          } else if (parseFloat(val) < 1) {
            var tips = '提现金额至少超过1元';
            this.setData({
              status: 2
            })
          }else{
            var service = parseFloat(val * 0.03).toFixed(2);
            var tips = '额外扣除￥' + service + '手续费（费率3%）';
            this.setData({
              status: 1
            })
          }
        }
      } else {
        var tips = '请输入正确的金额';
        this.setData({
          status: 2
        })
      }
      this.setData({
        tips: tips,
        tipsBtnHidden: true
      })
    }
  },  
  input_all:function(){
    var balance = this.data.balance;
    var service = parseFloat(balance * 0.03).toFixed(2);
    var tips = '额外扣除￥' + service + '手续费（费率3%）';
    this.setData({
      input_num: balance,
      status: 1,
      tips:tips,
      tipsBtnHidden:true
    })
  },
  cashBtn:function(){
    var userId = this.data.userId;
    var input_num = this.data.input_num;
    console.log(input_num)
    wx.login({
      success: resp => {
        let infoOpt = {
          url: '/secondary/order/cash',
          type: 'POST',
          data: {
            platCode: resp.code,
            userId: userId,
            cash: input_num
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
      }
    })
  },
  onReady: function () {
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