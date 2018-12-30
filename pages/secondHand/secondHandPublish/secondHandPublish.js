const url = require('../../../config.js')
const sendAjax = require('../../../utils/sendAjax.js')
Page({
  data: {
    userId: null,
    imgUrls: [],
    addressList: [],
    isNeedAddress: null,
    addressId: '',
    address: '',
    isSelect: 0,
    typeArray: [],
    typeIndex: 0,
    typeId: 2,
    price: null,
    oldPrice: null,
    phone: null,
    traydingWay: [],
    traydingWayId: 1,
    lodingHidden: true
  },
  onLoad: function(options) {
    var userId = wx.getStorageSync('userId');
    this.setData({
      userId: userId
    })
    this.getAddressList();
    this.getGoodsType();
    this.getTraydingWay();
  },
  //添加图片
  addPic: function() {
    var that = this
    var num = that.data.imgUrls.length
    var imgUrls = that.data.imgUrls
    var index = that.data.imgUrls.length;
    if (num < 4) {
      var cnt = 4 - num;
      wx.chooseImage({
        count: cnt,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success(res) {
          var tempFilePaths = res.tempFilePaths
          for (var i = tempFilePaths.length - 1; i >= 0; i--) {
            imgUrls.splice(index, 0, tempFilePaths[i])
          }
          that.setData({
            imgUrls: imgUrls
          })
          console.log(imgUrls)
        }
      })
    } else {
      wx.showToast({
        title: '最多上传4张图片噢~',
        icon: 'none'
      })
    }

  },
  //移除图片
  removePic: function(e) {
    var that = this;
    var imgUrls = that.data.imgUrls;
    console.log(e);
    var index = e.currentTarget.dataset.index;
    imgUrls.splice(index, 1);
    that.setData({
      imgUrls: imgUrls
    })
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
          isNeedAddress: 1,
          lodingHidden: true,
          isSelect: 0
        })
      } else if (currPage.data.isSelect == 0 && that.data.addressId == '') {
        that.setData({
          addressId: res.list[0].id,
          address: res.list[0].address,
          isNeedAddress: 0,
          lodingHidden: true,
          isSelect: 0
        })
      } else if (currPage.data.isSelect == 1) {
        that.setData({ //将携带的参数赋值
          addressId: currPage.data.addressId,
          address: currPage.data.address,
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
  //跳转新增地址
  addAddress: function() {
    wx.navigateTo({
      url: '../secondHandAddressSelect/secondHandAddressSelect',
    })
  },
  //跳转选择地址
  selectAddress: function() {
    wx.navigateTo({
      url: '../secondHandAddressSelect/secondHandAddressSelect',
    })
  },
  //绑定选择器改变
  bindPickerChange(e) {
    var typeIndex = e.detail.value;
    var typeId = this.data.typeArray[typeIndex].id;
    this.setData({
      typeIndex: typeIndex,
      typeId: typeId
    })
  },
  //获取商品分类
  getGoodsType: function() {
    var that = this;
    let infoOpt = {
      url: '/secondary/type',
      type: 'GET',
      data: {},
      header: {
        'content-type': 'application/json',
      },
    }
    let infoCb = {}
    infoCb.success = function(res) {
      console.log(res);
      var typeArray = [];
      for (var i = 2; i < res.list.length; i++) {
        typeArray.push(res.list[i]);
      }
      that.setData({
        typeArray: typeArray
      })
    }
    infoCb.beforeSend = () => {}
    sendAjax(infoOpt, infoCb, () => {});
  },
  //输入的价格
  input_price: function(e) {
    var v1 = e.detail.value;
    var v2 = parseFloat(v1).toFixed(2)
    this.setData({
      price: v2
    })
  },
  //输入的原价
  input_oldPrice: function(e) {
    var v1 = e.detail.value;
    var v2 = parseFloat(v1).toFixed(2)
    this.setData({
      oldPrice: v2
    })
  },
  //输入的手机
  input_phone: function(e) {
    var phone = e.detail.value;
    this.setData({
      phone: phone
    })
  },
  //获取交易方式
  getTraydingWay: function() {
    var that = this;
    let infoOpt = {
      url: '/secondary/traydingWay',
      type: 'GET',
      data: {},
      header: {
        'content-type': 'application/json',
      },
    }
    let infoCb = {}
    infoCb.success = function(res) {
      console.log(res);
      that.setData({
        traydingWay: res.list
      })
    }
    infoCb.beforeSend = () => {}
    sendAjax(infoOpt, infoCb, () => {});
  },
  //改变交易方式
  changeTraydingWay: function(e) {
    var traydingWayId = e.currentTarget.dataset.traydingwayid;
    this.setData({
      traydingWayId: traydingWayId
    })
    console.log(this.data.traydingWayId)
  },
  publishBtn: function() {
    var userId = this.data.userId;
    var imgUrls = this.data.imgUrls;
    var address = this.data.address;
    var typeId = this.data.typeId;
    var price = this.data.price;
    var oldPrice = this.data.oldPrice;
    var phone = this.data.phone;
    var traydingWayId = this.data.traydingWayId;
    console.log(userId);
    console.log(imgUrls);
    console.log(address)
    console.log(typeId)
    console.log(price)
    console.log(oldPrice)
    console.log(phone)
    console.log(traydingWayId)
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