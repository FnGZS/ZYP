Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgArr: [
      'https://www.gadstru.cn/punchImage/background/background_20190729185656_18270728.jpg'],
      flag:true,
      id:6
  },
  setStr:function(){
    let that = this
    wx.setStorageSync('id', [2]);
    let id=wx.getStorageSync('id');
   // id.push(that.data.id)//向数组中添加
   for(var i in id){
     if(id[i]=='2'){
       id.splice(i, 1)//删除
     }
   }
    wx.setStorageSync("id", id)
    
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