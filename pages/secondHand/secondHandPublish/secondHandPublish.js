const url = require('../../../config.js')
const sendAjax = require('../../../utils/sendAjax.js')
const uploadimgs = require('../../../utils/uploadimg.js')
var app = getApp();
Page({
  data: {
    userInfo:null,
    userId: null,
    imgUrls: [],
    arr_img:null,
    title:'',
    content:'',
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
    var userInfo = wx.getStorageSync('userinfo');
    var userId = wx.getStorageSync('userinfo').userId;
    this.setData({
      userInfo: userInfo,
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
        sizeType: ['compressed'],
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
  uploadimg: function () {//这里触发图片上传的方法
    var pics = this.data.imgUrls;
    var that = this;
    that.uploadimgs({
        url: 'https://www.sxscott.com/crazyBird/upload/avatar',//这里是你图片上传的接口
        path: pics,//这里是选取的图片的地址数组
        formData:{
          picType:'secondHand'
        }
      });
  },
  uploadimgs:function(data){
    var that = this;
    var i = data.i ? data.i : 0; //当前上传的哪张图片
    var success = data.success ? data.success : 0; //上传成功的个数
    var fail = data.fail ? data.fail : 0; //上传失败的个数
    var pics = data.pics ? data.pics : [];
    wx.uploadFile({
      header: {
        'content-type': 'application/json',
        'authorization': wx.getStorageSync('userinfo').authorization
      },
      url: data.url,
      filePath: data.path[i],
      name: 'file', //这里根据自己的实际情况改
      formData: data.formData, //这里是上传图片时一起上传的数据
      success: (resp) => {
        console.log(JSON.parse(resp.data))
        success++; //图片上传成功，图片上传成功的变量+1
        pics.push(JSON.parse(resp.data).urlList[0]);

      },
      fail: (res) => {
        fail++; //图片上传失败，图片上传失败的变量+1
        console.log('fail:' + i + "fail:" + fail);
      },
      complete: () => {
        i++; //这个图片执行完上传后，开始上传下一张
        if (i == data.path.length) { //当图片传完时，停止调用          
          console.log('成功：' + success + " 失败：" + fail);
          that.setData({
            arr_img:pics
          })
          that.publish();
        } else { //若图片还没有传完，则继续调用函数
          data.i = i;
          data.success = success;
          data.fail = fail;
          data.pics = pics;
          that.uploadimgs(data);
        }
      }
    });
  },
  publish: function () {
    var userId = this.data.userId;
    var imgUrls = JSON.stringify(this.data.arr_img);
    var title = this.data.title;
    var content = this.data.content;
    var address = this.data.address;
    var typeId = this.data.typeId;
    var price = this.data.price;
    var oldPrice = this.data.oldPrice;
    var phone = this.data.phone;
    var traydingWayId = this.data.traydingWayId;
    var that = this;
    console.log(111)
    let infoOpt = {
      url: '/secondary/create',
      type: 'POST',
      data: {
        userId: userId,
        goodsTitle:title,
        goodsContent:content,
        goodsImag: imgUrls,
        postion: address,
        goodsType: typeId,
        goodsWay:2,
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
      if (res.message == '发布成功'){
        wx.showModal({
          title: '提示',
          content: '发布成功，请耐心等待审核',
          showCancel: false,
          success(res){
            if(res.confirm){
              wx.navigateBack();
            }
          }
        })
      }
    }
    infoCb.beforeSend = () => { }
    sendAjax(infoOpt, infoCb, () => { });
  },
  publishBtn:function(){
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

    if (userInfo.isbound != 1){
      wx.showModal({
        title: '提示',
        content: '请先绑定学号',
        showCancel:false
      })
    } else if (imgUrls.length == 0){
      wx.showToast({
        title: '请先添加图片',
        icon:'none'
      })
    }else if(title == ''){
      wx.showToast({
        title: '请输入标题',
        icon: 'none'
      })
    } else if (content == '') {
      wx.showToast({
        title: '请输入内容',
        icon: 'none'
      })
    }else if (address == null || address ==''){
      wx.showToast({
        title: '请先添加地址',
        icon: 'none'
      })
    } else if (price == null || oldPrice == null || parseFloat(price) > parseFloat(oldPrice)){
      wx.showToast({
        title: '请输入正确的价格',
        icon: 'none'
      })
    } else if (phone == null || phone == ''){
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
    }else{
      this.uploadimg();
    }
  },
  //移除图片
  removePic: function(e) {
    var that = this;
    var imgUrls = that.data.imgUrls;
    console.log(e);
    var index = e.currentTarget.dataset.index;
    imgUrls.splice(index, 1);
    console.log(imgUrls)
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
        'authorize':wx.getStorageSync('userinfo').authorization
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
  //输入的标题
  input_title:function(e){
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