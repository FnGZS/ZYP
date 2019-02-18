const url = require('../../../config.js')
const sendAjax = require('../../../utils/sendAjax.js')
const templeMsg = require('../../../utils/templeMsg.js')
const login = require('../../../utils/wxlogin.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null, //商品的id，
    userId: null, //用户的id
    avatar: null, //用户的头像
    commentId: null, //评论的id
    schoolNum: null, //评论的学号
    goodsDetail: [], //商品的详情
    comment: [], //评论的所有列表
    comment_placeholder: '问问更多细节吧~', //评论框的文字
    comment_content: null, //评论的内容
    commentsNum: 0, //评论的总共数量
    focus: false, //是否聚焦到input框
    isReply: 0, //是否事回复
    isCollection: 0, //是否收藏了当前的商品
    collectionNum: 0, //当前商品收藏的人数
    pageNo: 1,
    pageSize: 10,

  },
  onLoad: function(options) {
    var id = options.id;
    // var id = 1;

    this.setData({
      id: id,
    })

  },
  onShow: function() {
    var that = this;
    login.wxLogin(0, function(res) {
      console.log(res);
      that.setData({
        userInfo: res,
      })
    })
    var userId = wx.getStorageSync('userinfo').userId;
    var avatar = wx.getStorageSync('userinfo').avatar;
    that.setData({
      userId: userId,
      avatar: avatar
    })
    that.getDetail(); //获取商品的详情
    that.getIsCollection(); //获取是否收藏
    that.getCollectionNum(); //获取收藏的人数
    that.getComment(); //获取评论列表
  },
  //获取二手详情
  getDetail: function() {
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
    infoCb.success = function(res) {
      // console.log(res);
      var goodsDetail = res.list[0];
      var arr = goodsDetail.goodsImg;
      goodsDetail['goodsImg'] = JSON.parse(arr);
      that.setData({
        goodsDetail: goodsDetail,
        schoolNum: goodsDetail.userId
      })
    }
    infoCb.beforeSend = () => {
      wx.showLoading({
        title: '加载中',
      })
    }
    sendAjax(infoOpt, infoCb, () => {});
  },
  //获取是否收藏该商品
  getIsCollection() {
    var that = this;
    var goodsId = this.data.id;
    let infoOpt = {
      url: '/secondary/isCollection',
      type: 'GET',
      data: {
        goodsId: goodsId
      },
      header: {
        'content-type': 'application/json',
        'authorization': wx.getStorageSync('userinfo').authorization
      },
    }
    let infoCb = {}
    infoCb.success = function(res) {
      console.log(res);
      if (res.message == '未想要') {
        that.setData({
          isCollection: 0
        })
      } else {
        that.setData({
          isCollection: 1
        })
      }
    }
    infoCb.beforeSend = () => {}
    sendAjax(infoOpt, infoCb, () => {});
  },
  //获取有多少人收藏了该商品
  getCollectionNum: function() {
    var that = this;
    var goodsId = this.data.id;
    let infoOpt = {
      url: '/secondary/quantity',
      type: 'GET',
      data: {
        goodsId: goodsId
      },
      header: {
        'content-type': 'application/json',
      },
    }
    let infoCb = {}
    infoCb.success = function(res) {
      console.log(res);
      var num = res.quantity;
      that.setData({
        collectionNum: num
      })
    }
    infoCb.beforeSend = () => {}
    sendAjax(infoOpt, infoCb, () => {});
  },
  //收藏
  barCollection: function() {
    var that = this;
    var goodsId = this.data.id;
    var isCollection = this.data.isCollection;
    let infoOpt = {
      url: '/secondary/collection',
      type: 'POST',
      data: {
        goodsId: goodsId
      },
      header: {
        'content-type': 'application/json',
        'authorization': wx.getStorageSync('userinfo').authorization
      },
    }
    let infoCb = {}
    infoCb.success = function(res) {
      console.log(res);
      that.setData({
        isCollection: !isCollection
      })
      that.getCollectionNum();
    }
    infoCb.beforeSend = () => {}
    sendAjax(infoOpt, infoCb, () => {});
  },
  //获取评论
  getComment: function() {
    var that = this;
    var pageSize = this.data.pageSize;
    var userId = this.data.userId;
    let infoOpt = {
      url: '/secondary/comments',
      type: 'GET',
      data: {
        id: this.data.id,
        userId: userId,
        pageNo: 1,
        pageSize: pageSize,
      },
      header: {
        'content-type': 'application/json',
      },
    }
    let infoCb = {}
    infoCb.success = function(res) {
      console.log(res);
      that.setData({
        comment: res.list,
        commentsNum: res.commentsNum,
        pageNo: 1,

      })
      wx.hideLoading();
    }
    infoCb.beforeSend = () => {}
    sendAjax(infoOpt, infoCb, () => {});
  },
  //上拉刷新加载评论
  getBottomComment: function() {
    var that = this;
    var pageNo = this.data.pageNo;
    var pageSize = this.data.pageSize;
    var userId = this.data.userId;
    let infoOpt = {
      url: '/secondary/comments',
      type: 'GET',
      data: {
        id: this.data.id,
        userId: userId,
        pageNo: pageNo,
        pageSize: pageSize
      },
      header: {
        'content-type': 'application/json',
      },
    }
    let infoCb = {}
    infoCb.success = function(res) {
      console.log(res);
      var commentNewList = res.list;
      var comment = that.data.comment;
      if (commentNewList.length == 0 && comment.length != 0) {
        wx.hideLoading();
        setTimeout(function() {
          wx.showToast({
            title: '没有更多的留言了',
            icon: 'none',
            duration: 1000
          })
        }, 100)
      } else {
        for (var i = 0; i < commentNewList.length; i++) {
          comment.push(commentNewList[i]);
        }
        console.log(comment)
        that.setData({
          comment: comment,
        })
        wx.hideLoading();
      }
    }
    infoCb.beforeSend = () => {}
    sendAjax(infoOpt, infoCb, () => {});
  },
  //获取评论填写的数据
  comment_input: function(e) {
    // console.log(e.detail.value)
    this.setData({
      comment_content: e.detail.value
    })
  },
  // 发送评论
  comment_send: function() {
    var that = this;
    var userId = this.data.userId;
    var goodsId = this.data.id;
    var isReply = this.data.isReply;
    var content = this.data.comment_content;
    var commentId = this.data.commentId;
    var schoolNum = this.data.schoolNum;
    var replyedId = this.data.goodsDetail.userId; //商品商家的ID
    if (content != '' && content != null) {
      if (isReply == 1) {
        let infoOpt = {
          url: '/secondary/reply',
          type: 'POST',
          data: {
            id: commentId,
            goodsId: goodsId,
            userId: userId,
            content: content,
            replyedId: schoolNum
          },
          header: {
            'content-type': 'application/json',
          },
        }
        let infoCb = {}
        infoCb.success = function(res) {
          console.log(res);
          if (res.code == 200) {
            that.getComment();
            //模板消息回复
            var id = that.data.id;
            var title = that.data.goodsDetail.goodsTitle;
            var name = wx.getStorageSync('userinfo').userName;
            var template_id = 'eWMALLAPiQY6TlhWpp0BlsvD72xPh-ZN1cUdOL_TkiQ';
            var page = '/pages/secondHand/secondHandMes/secondHandMes';
            var data = {
              "keyword1": {
                "value": title
              },
              "keyword2": {
                "value": name
              },
              "keyword3": {
                "value": content
              },
              "keyword4": {
                "value": "2018.12.26 14.42"
              }
            };
            templeMsg.templeMsg(schoolNum, template_id, page, data);

            setTimeout(function() {
              wx.showToast({
                title: '回复成功',
                icon: 'none',
              })
            }, 500)
          }
        }
        infoCb.beforeSend = () => {}
        sendAjax(infoOpt, infoCb, () => {});
      } else {
        let infoOpt = {
          url: '/secondary/comment',
          type: 'POST',
          data: {
            goodsId: goodsId,
            userId: userId,
            content: content,
            replyedId: replyedId
          },
          header: {
            'content-type': 'application/json',
          },
        }
        let infoCb = {}
        infoCb.success = function(res) {
          console.log(schoolNum);
          if (res.code == 200) {
            that.getComment();

            //模板消息回复
            var id = that.data.id;
            var title = that.data.goodsDetail.goodsTitle;
            var name = wx.getStorageSync('userinfo').userName;
            console.log(123456)
            var template_id = 'eWMALLAPiQY6TlhWpp0BlsvD72xPh-ZN1cUdOL_TkiQ';
            var page = '/pages/secondHand/secondHandMes/secondHandMes';
            var data = {
              "keyword1": {
                "value": title
              },
              "keyword2": {
                "value": name
              },
              "keyword3": {
                "value": content
              },
              "keyword4": {
                "value": res.message
              }
            };
            templeMsg.templeMsg(schoolNum, template_id, page, data);

            setTimeout(function() {
              wx.showToast({
                title: '留言成功',
                icon: 'none',
              })
            }, 500)

          }
        }
        infoCb.beforeSend = () => {}
        sendAjax(infoOpt, infoCb, () => {});
      }

      that.setData({
        comment_content: null
      })
    } else {
      wx.showToast({
        title: '请输入内容后再评论',
        icon: 'none',
        duration: 2000
      })
    }
    console.log(this.data.comment_content);
  },
  //回复
  reply: function(e) {
    var that = this;
    console.log(e)
    var commentId = e.currentTarget.dataset.id;
    var schoolNum = e.currentTarget.dataset.schoolnum;
    var name = e.currentTarget.dataset.name;
    console.log(schoolNum)
    this.setData({
      focus: true,
      comment_placeholder: '回复：' + name,
      commentId: commentId,
      schoolNum: schoolNum,
      isReply: 1
    })
  },
  //图片预览
  imgYu: function(e) {
    var img = e.currentTarget.dataset.img;
    var pic = this.data.goodsDetail.goodsImg;
    wx.previewImage({
      current: img, //当前图片地址
      urls: pic, //所有要预览的图片的地址集合 数组形式
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  //底部导航栏留言
  barComment: function() {
    this.setData({
      focus: true,
      isReply: 0,
      comment_placeholder: '问问更多细节吧~'
    })
  },
  //跳转立即结算
  toPayOrder: function() {
    var isbound = wx.getStorageSync('userinfo').isbound;
    if (isbound != 1) {
      wx.showModal({
        title: '提示',
        content: '请先绑定学号之后再进行发布操作',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../../user/binding/binding',
            })
          }
        }
      })
    }else{
      var detail = JSON.stringify(this.data.goodsDetail);
      wx.navigateTo({
        url: '../secondHandPayOrder/secondHandPayOrder?detail=' + detail,
      })
    }
  },
  onReady: function() {

  },

  onHide: function() {

  },
  onUnload: function() {

  },
  //下拉刷新
  onPullDownRefresh: function() {
    this.setData({
      pageNo: 1,
      comment: [],
    })
    wx.showLoading({
      title: '加载中',
    })
    this.getDetail();
    this.getIsCollection();
    this.getCollectionNum();
    this.getComment();
    wx.stopPullDownRefresh();
  },
  //上拉加载
  onReachBottom: function() {
    var pageNo = this.data.pageNo;
    var pageSize = this.data.pageSize;
    if (this.data.comment.length >= pageSize) {
      this.setData({
        pageNo: pageNo + 1,
        lodingHidden: false
      })
      this.getBottomComment();
    }
  },
  onShareAppMessage: function() {
    var id = this.data.id;
    var name = this.data.goodsDetail.goodsTitle;
    return {
      title: '推荐给您 ' + name,
      path: 'pages/secondHand/secondHandDetail/secondHandDetail?id=' + id,
    };
  }
})