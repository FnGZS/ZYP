const url = require('../../../config.js')
const sendAjax = require('../../../utils/sendAjax.js')
const uploadimgs = require('../../../utils/uploadimg.js')
var app = getApp();
Page({
  data: {
    userInfo: null,
    userId: null,
    id:null,
    imgUrls: [],
    arr_img: null,
    title: '',
    content: '',
    addressList: [],
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
    lodingHidden: true,
    canUpdate: 1,
  },
  onLoad: function (options) {
    var id = options.id;
    console.log(id)
    var userInfo = wx.getStorageSync('userinfo');
    var userId = wx.getStorageSync('userinfo').userId;
    this.setData({
      userInfo: userInfo,
      userId: userId,
      id:id
    })
    // this.getAddressList();
    this.getGoodsType();
    this.getTraydingWay();
    this.getDetail();
  },
  //获取商品详情
  getDetail: function () {
    var that = this;
    let infoOpt = {
      url: '/secondary/goods/' + this.data.id,
      type: 'GET',
      data: {},
      header: {
        'content-type': 'application/json',
      },
    }
    let infoCb = {}
    infoCb.success = function (res) { 
      wx.hideLoading();
      var goodsDetail = res.list[0];
      var arr = goodsDetail.goodsImg;
      var typeArray = that.data.typeArray;
      var traydingWay = that.data.traydingWay;
      console.log(goodsDetail);
      
      goodsDetail['goodsImg'] = JSON.parse(arr);
      for (var i = 0; i < typeArray.length ; i ++){
        if (goodsDetail.goodsType == typeArray[i].field){
          var typeIndex = i;
          break;
        }
      }
      for (var j = 0; j < traydingWay.length ; j ++){
        if (goodsDetail.tradingWay == traydingWay[j].field) {
          var traydingWayId = j + 1;
          break;
        }
      }
      that.setData({
        imgUrls: goodsDetail.goodsImg,
        title: goodsDetail.goodsTitle,
        content: goodsDetail.goodsContent,
        address: goodsDetail.postion,
        price: goodsDetail.price,
        oldPrice: goodsDetail.oldPrice,
        typeIndex: typeIndex,
        phone: goodsDetail.telephone,
        traydingWayId: traydingWayId
      })
    }
    infoCb.beforeSend = () => {
    }
    sendAjax(infoOpt, infoCb, () => { });
  },
  update: function () {
    var id = this.data.id;
    var userId = this.data.userId;
    var imgUrls = JSON.stringify(this.data.imgUrls);
    var title = this.data.title;
    var content = this.data.content;
    var address = this.data.address;
    var typeId = this.data.typeId;
    var price = parseFloat(this.data.price).toFixed(2) ;
    var oldPrice = parseFloat(this.data.oldPrice).toFixed(2);
    var phone = this.data.phone;
    var traydingWayId = this.data.traydingWayId;
    var that = this;
    console.log(imgUrls)
    let infoOpt = {
      url: '/secondary/goods/update',
      type: 'put',
      data: {
        id:id,
        userId: userId,
        goodsTitle: title,
        goodsContent: content,
        goodsImag: imgUrls,
        postion: address,
        goodsType: typeId,
        goodsWay: 2,
        tradingWay: traydingWayId,
        price: price,
        oldPrice: oldPrice,
        telephone: phone
      },
      header: {
        'content-type': 'application/json',
      },
    }
    let infoCb = {}
    infoCb.success = function (res) {
      console.log(res);
      if (res.code == '200') {
        wx.showModal({
          title: '提示',
          content: '保存成功',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              wx.hideLoading();
              that.setData({
                canUpdate: 1
              })
              wx.navigateBack();
            }
          }
        })
      }
    }
    infoCb.beforeSend = () => {
      wx.showLoading({
        title: '加载中',
      })
    }
    sendAjax(infoOpt, infoCb, () => { });
  },
  updateBtn: function () {
    var that = this;
    var userInfo = this.data.userInfo;
    var userId = this.data.userId;
    var imgUrls = this.data.imgUrls;
    var title = this.data.title;
    var content = this.data.content;
    var address = this.data.address;
    var typeId = this.data.typeId;
    var price = this.data.price;
    var oldPrice = this.data.oldPrice;
    var phone = this.data.phone;
    var traydingWayId = this.data.traydingWayId;
    that.setData({
      canUpdate: 2
    })
    if (userInfo.isbound != 1) {
      wx.showModal({
        title: '提示',
        content: '请先绑定学号',
        showCancel: false
      })
      that.setData({
        canUpdate: 1
      })
    } else if (imgUrls.length == 0) {
      wx.showToast({
        title: '请先添加图片',
        icon: 'none'
      })
      that.setData({
        canUpdate: 1
      })
    } else if (title == '') {
      wx.showToast({
        title: '请输入标题',
        icon: 'none'
      })
      that.setData({
        canUpdate: 1
      })
    } else if (content == '') {
      wx.showToast({
        title: '请输入内容',
        icon: 'none'
      })
      that.setData({
        canUpdate: 1
      })
    } else if (address == null || address == '') {
      wx.showToast({
        title: '请先添加地址',
        icon: 'none'
      })
      that.setData({
        canUpdate: 1
      })
    } else if (price == null || oldPrice == null || parseFloat(price) > parseFloat(oldPrice)) {
      wx.showToast({
        title: '请输入正确的价格',
        icon: 'none'
      })
      that.setData({
        canUpdate: 1
      })
    } else if (phone == null || phone == '') {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
      that.setData({
        canUpdate: 1
      })
    } else {
      this.update();
    }
  },
  //跳转新增地址
  addAddress: function () {
    wx.navigateTo({
      url: '../secondHandAddressSelect/secondHandAddressSelect',
    })
  },
  //跳转选择地址
  selectAddress: function () {
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
  getGoodsType: function () {
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
    infoCb.success = function (res) {
      console.log(res);
      var typeArray = [];
      for (var i = 2; i < res.list.length; i++) {
        typeArray.push(res.list[i]);
      }
      that.setData({
        typeArray: typeArray
      })
    }
    infoCb.beforeSend = () => { }
    sendAjax(infoOpt, infoCb, () => { });
  },
  //输入的标题
  input_title: function (e) {
    var title = e.detail.value;
    this.setData({
      title: title
    })
  },
  //输入的内容
  input_content: function (e) {
    var content = e.detail.value;
    this.setData({
      content: content
    })
  },
  //输入的价格
  input_price: function (e) {
    var v1 = e.detail.value;
    // var v2 = parseFloat(v1).toFixed(2)
    this.setData({
      price: v1
    })
  },
  //输入的原价
  input_oldPrice: function (e) {
    var v1 = e.detail.value;
    // var v2 = parseFloat(v1).toFixed(2)
    this.setData({
      oldPrice: v1
    })
  },
  //输入的手机
  input_phone: function (e) {
    var phone = e.detail.value;
    this.setData({
      phone: phone
    })
  },
  //获取交易方式
  getTraydingWay: function () {
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
    infoCb.success = function (res) {
      console.log(res);
      that.setData({
        traydingWay: res.list
      })
    }
    infoCb.beforeSend = () => { }
    sendAjax(infoOpt, infoCb, () => { });
  },
  //改变交易方式
  changeTraydingWay: function (e) {
    var traydingWayId = e.currentTarget.dataset.traydingwayid;
    this.setData({
      traydingWayId: traydingWayId
    })
    console.log(this.data.traydingWayId)
  },
  onReady: function () { },
  onShow: function () {
  },
  onHide: function () { },
  onUnload: function () { },
  onPullDownRefresh: function () { },
  onReachBottom: function () { },
  onShareAppMessage: function () { }
})