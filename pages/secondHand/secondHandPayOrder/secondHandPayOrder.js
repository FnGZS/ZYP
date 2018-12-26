const url = require('../../../config.js')
const sendAjax = require('../../../utils/sendAjax.js')
Page({
  data: {
    userId: null,
    goodsDetail: [{
      'pic': 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1781889091,1773255097&fm=26&gp=0.jpg',
      'name': '黑蛇键盘的窘境围殴覅欧文覅加尔文费解诶org将诶肉我偶尔发任务分解',
      'price': 558.88,
      'label': '范围分为非',
      'number': 1,
    }],
    addressList: [],
    isNeedAddress: null,
    addressId: '',
    address: '',
    addressName: '',
    addressPhone: '',
    isSelect:0,
    lodingHidden: true
  },
  onLoad: function (options) {
    var detail = JSON.parse(options.detail);
    var userId = wx.getStorageSync('userId');
    this.setData({
      userId: userId,
      goodsDetail: detail
    })
    this.getAddressList();
  },
  //获取用户的地址
  getAddressList: function () {
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
    infoCb.success = function (res) {
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
      } else if (currPage.data.isSelect == 1){
          that.setData({ //将携带的参数赋值
            addressId: currPage.data.addressId,
            address: currPage.data.address,
            addressName: currPage.data.addressName,
            addressPhone: currPage.data.addressPhone,
            isNeedAddress: 0,
            lodingHidden: true,
            isSelect:0
          });
      } else{
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
    sendAjax(infoOpt, infoCb, () => { });
  },
  addAddress: function () {
    wx.navigateTo({
      url: '../secondHandAddressSelect/secondHandAddressSelect',
    })
  },
  selectAddress: function () {
    wx.navigateTo({
      url: '../secondHandAddressSelect/secondHandAddressSelect',
    })
  },
  onReady: function () { },
  onShow: function () {
    
      this.getAddressList();
  },
  onHide: function () { },
  onUnload: function () { },
  onPullDownRefresh: function () { },
  onReachBottom: function () { },
  onShareAppMessage: function () { }
})