// pages/LostFound/release/release.js
const sendAjax = require('../../../utils/sendAjax.js')
const url = require('../../../config.js')
const upload = require('../../../utils/uploadfile.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: null,
    picurl: [],
    cnt: 0,
    // / images / addpic.png
    show: false,
    text: '',
    explainclass: 0,
    lostTypeList: [],
    currentTab: 1,
    typename: '请选择分类',
    lostcurrentTab: 0,
    lostTab: [{ id: 0, name: '#寻物启事#' }, { id: 1, name: '#失物招领#' }],
    goodsname: null,
    phone: null, 
    arr_img: [],
    isShow: false,
    txt: '',
    iconClass: 'icon-cry'
  },
  //页面其他内容上传
  getphone: function (e) {
    var that = this;
    that.setData({
      phone: e.detail.value
    })
  },

  pushlost: function () {

    var that = this;
    if (that.data.goodsname) {
      if (that.data.address) {
        if (that.data.phone) {
          let infoOpt = {
            url: '/lost/lostInput',
            type: 'POST',
            data: {
              title: that.data.goodsname,
              foundPic: JSON.stringify(that.data.arr_img),
              content: that.data.text,
              typeId: that.data.currentTab,
              messageId: that.data.lostcurrentTab,
              address: that.data.address,
              contact: that.data.phone
            },
            header: {
              'content-type': 'application/json',
              'authorization': wx.getStorageSync("authorization"),
            },
          }
          let infoCb = {}
          infoCb.success = function (data) {

          }

          sendAjax(infoOpt, infoCb, () => {

          });
        }
        else {
          app.toastShow(that, "請輸入聯係方式", "icon-cry");
        }
      } else {
        app.toastShow(that, "請輸入丟失地點", "icon-cry");
      }

    } else {
      app.toastShow(that, "请输入物品名称", "icon-cry");
    }

  },
  goodsname: function (e) {
    var that = this;
    that.setData({
      goodsname: e.detail.value
    })
  },
  getaddress: function (e) {
    var that = this;
    that.setData({
      address: e.detail.value
    })
  },
  imagesshow: function () {
    var that = this
    var picurl = that.data.picurl
    if (picurl.length >= 4) {
      that.setData({
        show: true
      })
      //  console.log(1111);
    } else {
      console.log(picurl.length);
      that.setData({
        show: false
      })
    }
  },

  //点击上传事件
  //头非常大 先自己封装了上传图片uploadfile.js之后用promise.js来进行异步保证在所有图片上传成功后进行接下来的操作
  uploadimage: function () {
    var page = this
    var upload_picture_list = page.data.picurl
    console.log(upload_picture_list)
    var arr_img = []
    console.log(upload_picture_list.length);
    if (upload_picture_list.length > 0) {
      wx.showToast({
        title: '正在上传图片',
        icon: 'loading',
        duration: 100000
      })
      for (var j in upload_picture_list) {

        let infoOpt = {
          url: url.uploadFile,
          list: upload_picture_list[j],
          data: {
            'picType': 'article'
          },
          header: {
            'content-type': 'application/json',
          },
        }
        //异步
        upload.upload_picture_fun(infoOpt).then((res) => {
          arr_img.push(res)
          if (arr_img.length == upload_picture_list.length) {

            wx.showToast({
              title: '上传成功',
              icon: 'success',
              duration: 1000
            })
            page.setData({
              arr_img: arr_img
            })
            page.pushlost()
          }

        })
      }
      console.log(arr_img)
    }
    else {
      page.pushlost()
    }
    // console.log(arr_img)
  },
  addpicture: function () {
    var that = this
    var cnt = that.data.picurl.length
    var picurl = that.data.picurl
    var index = that.data.picurl.length;
    if (cnt != 4) {
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success(res) {
          var tempFilePaths = res.tempFilePaths
          console.log(tempFilePaths)
          for (var i = 0; i < tempFilePaths.length; i++) {
            picurl.splice(index, 0, tempFilePaths[i])

          }
          // console.log(picurl)
          that.setData({ picurl: picurl })
          console.log(picurl)
        }
      })
    }
    that.imagesshow();
  },
  removepicture: function (e) {
    var that = this
    var picurl = that.data.picurl
    console.log(e)
    var index = e.currentTarget.dataset.index
    picurl.splice(index, 1)
    that.setData({ picurl: picurl })
    that.imagesshow();
  },
  chingepicture: function (e) {
    var that = this
    var picurl = that.data.picurl
    var index = e.currentTarget.dataset.index
    console.log(that);
    // console.log(index);
    // picurl.splice(index, 1)
    // that.setData({ picurl: picurl })
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        console.log(res);
        var tempFilePaths = res.tempFilePaths
        for (var i = 0; i < tempFilePaths.length; i++) {
          picurl.splice(index, 1, tempFilePaths[i])
        }
        that.setData({ picurl: picurl })
        // console.log(that.data.picurl)
      }
    })

    that.imagesshow();
  },
  getmap: function () {
    var that = this
    // console.log('111')
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        wx.chooseLocation({
          success: function (res) {
            console.log(res)
            that.setData({
              address: res.name
            });
          },
        })
      }
    })
  },
  toExplain: function () {
    var that = this;

    if (that.data.text == '请填写物品说明') {
      wx.navigateTo({
        url: 'explain/explain'
      });
    } else {
      wx.navigateTo({
        url: 'explain/explain?_text=' + that.data.text
      });
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  getlostType: function () {
    var that = this;
    let infoOpt = {
      url: '/lost/lostType',
      type: 'GET',
      data: {
      },
      header: {
        'content-type': 'application/json',
        //  'authorization': wx.getStorageSync("authorization"),
      },
    }
    let infoCb = {}
    infoCb.success = function (data) {
      that.setData({
        lostTypeList: data.lostTypeList,
        currentTab: data.lostTypeList.length
      })
      console.log(that.data.lostTypeList)
    }

    sendAjax(infoOpt, infoCb, () => {

    });
  },
  onLoad: function (options) {
    var that = this
    that.getlostType();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  clicklostTab: function (e) {
    var _this = this;
    // console.log(_this.data.currentTab);
    // console.log(e.target.dataset.id);
    // // console.log(_this.data.newhigth);
    if (_this.data.lostcurrentTab === e.target.dataset.id) {

      return false;
    } else {
      // console.log(123)
      _this.setData({
        lostcurrentTab: e.target.dataset.id,
      })
    }
  },
  //点击切换
  clickTab: function (e) {
    var _this = this;
    // console.log(_this.data.currentTab);
    // console.log(e.target.dataset.id);
    // // console.log(_this.data.newhigth);
    if (_this.data.currentTab === e.target.dataset.id) {

      return false;
    } else {
      // console.log(123)
      _this.setData({
        currentTab: e.target.dataset.id,
        typename: e.target.dataset.typename
      })
    }
  },

  //发布
  Release: function () {
    this.uploadimage()

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    let that = this;

    let pages = getCurrentPages();

    let currPage = pages[pages.length - 1];

    if (currPage.data.mydata == null || currPage.data.mydata == undefined) {

    }
    else {
      that.setData({
        text: currPage.data.mydata.text,
        explainclass: currPage.data.mydata.isshow
      })
    }
    console.log(currPage)

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})