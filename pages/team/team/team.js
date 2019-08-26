// pages/team/team.js
var url = "https://www.gadstru.cn/association"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    message: [],
    page: 1,
    name: "",
    pages: 1,
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    wx.request({
      url: url + '/wx/getTeam',
      method: "POST",
      data: {
        name: that.data.name,
        page: that.data.page
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        that.setData({
          message: res.data.list,
          pages: res.data.totalPage
        })
      }
    })
    that.setData({
      buttonClicked: false
    })
  },

  onReachBottom: function() {
    // 下拉触底，先判断是否有请求正在进行中
    // 以及检查当前请求页数是不是小于数据总页数，如符合条件，则发送请求
    console.log(1);
    if (this.data.page < this.data.pages) {
      wx.showToast({
        title: '加载中...',
        mask: true,
        icon: 'loading'
      })
      this.fetchArticleList(this.data.page + 1)
      this.data.page = this.data.page + 1
    } else {
      wx.showToast({
        title: '已经加载完了',
        mask: true,
        icon: 'loading'
      })
    }
  },

  fetchArticleList(pageNo) {
    let that = this;

    wx.request({
      url: url + '/wx/getTeam',
      method: "POST",
      data: {
        name: that.data.name,
        page: pageNo
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        that.setData({
          message: that.data.message.concat(res.data.list),
          pages: res.data.totalPage
        })
      }
    })
    that.setData({
      buttonClicked: false
    })
  },
  inputText: function(e) {
    this.setData({
      name: e.detail.value
    })

  },
  /* 鼠标单击，搜索要寻找的社团 */
  btnClick: function() {
    let that = this
    that.data.page = 1
    wx.request({
      url: url + '/wx/getTeam',
      method: "POST",
      data: {
        name: that.data.name,
        page: that.data.page
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        if (Object.keys(res.data.list).length == 0) {/* ES6 新增的方法 Object.keys():

Object.keys() 方法会返回一个由一个给定对象的自身可枚举属性组成的数组。 */
          wx.showToast({
            title: '搜索社团不存在',
            mask: true,
           
          })
        } else {
          that.setData({
            message: res.data.list,
            pages: res.data.totalPage
          })
        }
      }
    })
    that.setData({
      buttonClicked: false
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})