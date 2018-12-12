// pages/LostFound/release/explain/explain.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text:'',
    isshow:1,
    _text:''
  },
  bindTextAreaBlur: function (e) {
    console.log(e.detail.value)
    var that=this;
    that.setData({
      text:e.detail.value
    })
  
  },
  formSubmit: function (e) {
    var that = this;
    console.log(e);
    // this.setData({
    //   ceshis: this.data.ceshi,
    //   ceshidd: e.detail.value.input
    // })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    if (options._text!=undefined)
    {
      console.log(123);
      that.setData({
        _text: options._text,
        text: options._text
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
 
  },
comp:function(){
  var that=this
  // that.bindTextAreaBlur();
  console.log(that.data.text);
  var pages = getCurrentPages();
  var currPage = pages[pages.length - 1];   //当前页面
  var prevPage = pages[pages.length - 2]; 
  prevPage.setData({
    mydata: { 
      text: that.data.text,
      isshow:that.data.isshow
     }
  })
  wx.navigateBack(); 
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