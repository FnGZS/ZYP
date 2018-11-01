// pages/currentaffairs/currentaffairs.js
const sendAjax = require('../../utils/sendAjax.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    hotpageNo:1,
    hotpageSize:5,
    hotmeslist:[],
    newpageNo: 1,
    newpageSize: 5,
    newmeslist: [],
    newhigth:0,
    hothigth:0,
    listhigth:0,
    isBottom:0,
    isBottomhot:0,
    isBottomnew:0,
  },

  //设置最新热门的高度
  sethight:function(){
    var _this=this;
    if (_this.data.currentTab == 1) {
      _this.setData({
        isBottom: _this.data.isBottomhot,
        listhigth: _this.data.hothigth
      })
    }
    else {
      _this.setData({
        isBottom: _this.data.isBottomnew,
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
     if (data.message!=null)
    {
        that.setData({
          isBottomhot:1,
        })
    }else{
       that.setData({
         isBottomhot: 0,
       })
    }

    var returnArr=that.data.hotmeslist;
    for(var i=0;i<data.items.length;i++)
    {
       returnArr.push(data.items[i]);
    }
   that.setData({
     hotmeslist:returnArr
   })
     if (that.data.hotmeslist == "") {
       that.setData({
         hothigth: 0
       })
     }
     else {
       that.setData({
         hothigth: that.data.hotmeslist.length * 220 + 40,
       })
     }
    //  console.log(data.items.length);

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
      console.log(data.message)
      if (data.message != null) {
        that.setData({
          isBottomnew: 1,
        })
      } else {
        that.setData({
          isBottomnew: 0,
        })
      }
      var returnArr = that.data.newmeslist;
      for (var i = 0; i < data.items.length; i++) {
        returnArr.push(data.items[i]);
      }
      that.setData({
        newmeslist: returnArr
      })
      if (that.data.newmeslist== "" )
      {
        that.setData({
          newhigth:0
        })
      }
      else {
        that.setData({
          newhigth: that.data.newmeslist.length*220+40,
        })
      }
   
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
    this.gethotmes();
    this.getnewmes();
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
 
     this.setData({
       currentTab: this.data.currentTab,
       hotpageNo: 1,
       hotpageSize: 5,
       hotmeslist: [],
       newpageNo: 1,
       newpageSize: 5,
       newmeslist: [],
       newhigth: 0,
       hothigth: 0,
       listhigth: 0,
       isBottom: 0,
       isBottomhot: 0,
       isBottomnew: 0,
     })
    this.gethotmes();
    this.getnewmes();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.currentTab == 1) {
      var pageNo = this.data.hotpageNo;
      pageNo++;
      this.setData({
        hotpageNo: pageNo,
      })
      this.gethotmes();
    }
    if (this.data.currentTab == 0) {
      var pageNo = this.data.newpageNo;
      pageNo++;
      this.setData({
        newpageNo: pageNo,
      })
      this.getnewmes();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})