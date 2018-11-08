// pages/user/joinVote/joinVote.js
const sendAjax = require('../../../utils/sendAjax.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    voteRecord:[],
    currentPageNum:1,
   isshow:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.getVoteList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //获取活动列表
  getVoteList: function () {
    var that = this;
    var navId = wx.getStorageSync("userId");
    var pageNum = that.data.currentPageNum;
    let infoOpt = {
      url: '/vote/record',
      type: 'GET',
      data: {
        id: navId,
        // status:0,
        pageNo: pageNum,
        pageSize: 5
      },
      header: {
        'content-type': 'application/json',
      },
    }
    let infoCb = {}
    infoCb.success = function (res) {
      console.log(res);
      if (res.code == 500) { }
      else {
        // console.log(1);
        if (res.code == 400) {
          if (that.data.voteRecord.length != 0) {
            wx.showToast({
              title: '到底咯。',
              icon: 'none',
              duration: 1000
            })
          } else {
          }
        } else {
          var voteRecord = that.data.voteRecord;
          console.log(voteRecord);
          for (var i = 0; i < res.voteRecord.length; i++) {
            voteRecord.push(res.voteRecord[i]);
          }
          that.setData({
            voteRecord: voteRecord,
            isshow:0,
          })
          console.log(voteRecord)
        }
      }
    }
    infoCb.beforeSend = () => { }
    infoCb.complete = () => {

    }
    sendAjax(infoOpt, infoCb, () => {
      // that.onLoad()
      // wx.setStorageSync('G_needUploadIndex', true)
    });
  },
  toVoteDetail: function (e) {
    var islogin = (wx.getStorageSync("isLogin"));
    if (islogin) {
      //  var isbound=wx.getStorageSync('isbound', 1);//判断是否绑定了学号
      //  if(isbound==2)
      //  {
      //    wx.showModal({
      //      title: '提示',
      //      content: '您还未绑定学号',
      //      showCancel: false,
      //      success(res) {
      //        wx.switchTab({
      //          url: '../user/user',
      //        })
      //      }
      //    })
      //  }else if(isbound==1){
      var id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '../../vote/scholarship/scholarship?id=' + id,
      })
    }
    else {
      wx.showModal({
        title: '提示',
        content: '请登录',
        showCancel: false,
        success(res) {
          wx.switchTab({
            url: '../user/user',
          })
        }
      })
    }
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
          var that=this;
          that.setData({
            voteRecord:[],
            currentPageNum: 1,
          })
    that.getVoteList();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that=this;
    var pagenum = that.data.currentPageNum+1
    that.setData({
      currentPageNum:pagenum
    })
    that.getVoteList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})