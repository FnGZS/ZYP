const url = require('../../../config.js')
const sendAjax = require('../../../utils/sendAjax.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:null,
    userId:null,
    avatar:null,
    commentId:null,
    schoolNum:null,
    goodsDetail:[],
    comment:[],
    comment_placeholder: '问问更多细节吧~',
    comment_content: null,
    focus:false,
    isReply:0

  },
  onLoad: function (options) {
    var id = options.id;
    var userId = wx.getStorageSync('userId');
    var avatar = wx.getStorageSync('avatar');
    this.setData({
      id:id,
      userId: userId,
      avatar: avatar
    })
    this.getDetail();
    this.getComment();
  },
  //获取二手详情
  getDetail:function(){
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
      // console.log(res);
      var goodsDetail = res.list[0];
      var arr = goodsDetail.goodsImg;
      goodsDetail['goodsImg'] = JSON.parse(arr);
      that.setData({
        goodsDetail: goodsDetail
      })
    }
    infoCb.beforeSend = () => { }
    sendAjax(infoOpt, infoCb, () => { });
  },
  //获取评论
  getComment:function(){
    var that = this;
    let infoOpt = {
      url: '/secondary/comments',
      type: 'GET',
      data: {
        id:this.data.id,
        pageNo:1,
        pageSize:20
      },
      header: {
        'content-type': 'application/json',
      },
    }
    let infoCb = {}
    infoCb.success = function (res) {
      console.log(res);
      that.setData({
        comment:res.list
      })
    }
    infoCb.beforeSend = () => { }
    sendAjax(infoOpt, infoCb, () => { });
  },
  //获取评论填写的数据
  comment_input: function (e) {
    console.log(e.detail.value)
    this.setData({
      comment_content: e.detail.value
    })
  },
  // 发送评论
  comment_send: function () {
    var that = this;
    var userId = this.data.userId;
    var goodsId = this.data.id;
    var isReply = this.data.isReply;
    var content = this.data.comment_content;
    var commentId = this.data.commentId;
    var schoolNum = this.data.schoolNum;
    if (content != '' && content != null) {
      if (isReply == 1){
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
        infoCb.success = function (res) {
          console.log(res);
          if(res.code == 200){
            console.log('回复成功')
            that.getComment();
          }
        }
        infoCb.beforeSend = () => { }
        sendAjax(infoOpt, infoCb, () => { });
      }else{
        let infoOpt = {
          url: '/secondary/comment',
          type: 'POST',
          data: {
            goodsId: goodsId,
            userId: userId,
            content: content
          },
          header: {
            'content-type': 'application/json',
          },
        }
        let infoCb = {}
        infoCb.success = function (res) {
          console.log(res);
          if (res.code == 200) {
            that.getComment();
          }
        }
        infoCb.beforeSend = () => { }
        sendAjax(infoOpt, infoCb, () => { });
      }
      
      that.setData({
        comment_content: null
      })
    }
    else {
      wx.showToast({
        title: '请输入内容后再评论',
        icon: 'none',
        duration: 2000
      })
    }
    console.log(this.data.comment_content);
  },
  //回复
  reply:function(e){
    var that = this;
    console.log(e)
    var commentId = e.currentTarget.dataset.id;
    var schoolNum = e.currentTarget.dataset.schoolnum;
    var name = e.currentTarget.dataset.name;
    console.log(schoolNum)
    this.setData({
      focus:true,
      comment_placeholder:'回复：' + name,
      commentId: commentId,
      schoolNum: schoolNum,
      isReply:1
    })
    
  },
  //底部导航栏留言
  barComment:function(){
    this.setData({
      focus:true,
      isReply: 0,
      comment_placeholder: '问问更多细节吧~'
    })
  },
  onReady: function () {
    
  },
  onShow: function () {
    
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