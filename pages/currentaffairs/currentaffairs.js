// pages/currentaffairs/currentaffairs.js
const sendAjax = require('../../utils/sendAjax.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    hotpageNo:0,
    hotpageSize:5,
    hotmeslist:[],
    newpageNo: 0,
    newpageSize: 5,
    newmeslist: [],
    newhigth:0,
    hothigth:0,
    listhigth:0
  },
  //设置最新热门的高度
  sethight:function(){
  
    var _this=this;
    if (_this.data.currentTab == 1) {
      _this.setData({
        listhigth: _this.data.hothigth
      })
    }
    else {
      _this.setData({
        listhigth: _this.data.newhigth
      })
    }
  },
 //获取热门时事
 gethotmes:function(){
   var that = this;
   let infoOpt = {
     url: '/affaris/getAffairsList',
     type: 'GET',
     data: {
       typeId:1,
       pageNo:that.data.hotpageNo,
       pageSize:that.data.hotpageSize,
     },
     header: {
       'content-type': 'application/json',
      //  'authorization': wx.getStorageSync("authorization"),
     },
   }
   let infoCb = {}
   infoCb.success = function (data) {
     console.log(data);
     if (data.items == "") {
       that.setData({
         hothigth: 0
       })
     }
     else {
       that.setData({
         hothigth: data.items.length * 220 + 40,
       })
     }
    //  console.log(data.items.length);
     that.setData({
       hotmeslist:data.items
     })
     that.sethight();
   }


   sendAjax(infoOpt, infoCb, () => {
     
   });
 },
  //获取最新时事
  getnewmes: function () {
    var that = this;
    let infoOpt = {
      url: '/affaris/getAffairsList',
      type: 'GET',
      data: {
        typeId: 2,
        pageNo: that.data.newpageNo,
        pageSize: that.data.newpageSize,
      },
      header: {
        'content-type': 'application/json',
        //  'authorization': wx.getStorageSync("authorization"),
      },
    }
    let infoCb = {}
    infoCb.success = function (data) {
      console.log(data);
      if(data.items== "" )
      {
        that.setData({
          newhigth:0
        })
      }
      else {
        that.setData({
          newhigth:data.items.length*220+40,
        })
      }
      that.setData({
        newmeslist: data.items
      })
      that.sethight();
    }
    sendAjax(infoOpt, infoCb, () => {
    
    });
  },
  //滑动切换
  swiperTab: function (e) {
    var _this=this;
    _this.setData({
      currentTab: e.detail.current
    });
    this.sethight();
  },
  //点击切换
  clickTab: function (e) {
    var _this = this;
    // console.log(e);
    // console.log(_this.data.newhigth);
    if (_this.data.currentTab === e.target.dataset.current) {
   
      return false;
    } else {
      this.sethight();
      _this.setData({
        currentTab: e.target.dataset.current,
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.gethotmes();
    this.getnewmes();

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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