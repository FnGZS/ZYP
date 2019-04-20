const sendAjax = require('../../../utils/sendAjax.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    message:[],


  },

  /**
   * 生命周期函数--监听页面加载
   */
  //图片预览
  openpic: function (e) {
    var img = e.currentTarget.dataset.img;
    var pic = this.data.message.foundPic;
    wx.previewImage({
      current: img, //当前图片地址
      urls: pic, //所有要预览的图片的地址集合 数组形式
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  callphone:function(){
    var that=this;
    wx.showModal({
      title: '联系方式',
      content: that.data.message.contact,
      cancelText:'取消',
      confirmText:'复制',
      success(res) {
        if (res.confirm) {
          wx.setClipboardData({
            data: that.data.message.contact,
            success(res) {
              wx.getClipboardData({
                success(res) {
                  console.log(res.data) // data
                }
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }

    })
    // wx.makePhoneCall({
    //   phoneNumber: that.data.message.contact
    // })
  },
  getdetail: function (detail){
    console.log(detail)

    var that=this
    let infoOpt = {
      url: '/lost/lostDetails/' + detail,

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
      console.log(data);
      data.details.foundPic = JSON.parse(data.details.foundPic)
      data.details.personal = JSON.parse(data.details.personal)
       that.setData({
         message: data.details,
       })
       console.log(that.data.message)

    }

    sendAjax(infoOpt, infoCb, () => {

    });
  },
  onLoad: function (options) {
    console.log(options)
    this.getdetail(options.detail)
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
  onShareAppMessage: function (options) {
    console.log(options)
//     　　var that = this;
//     　　// 设置菜单中的转发按钮触发转发事件时的转发内容
//     　　var shareObj = {
//       　　　　title: "转发的标题",        // 默认是小程序的名称(可以写slogan等)
//       　　        // 默认是当前页面，必须是以‘/’开头的完整路径
//       　　　　imgUrl: '',     //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
//       　　　　success: function (res) {
//         　　　　　　// 转发成功之后的回调
//         　　　　　　if (res.errMsg == 'shareAppMessage:ok') {
//         　　　　　　}
//       　　　　},
//       　　　　fail: function () {
//         　　　　　　// 转发失败之后的回调
//         　　　　　　if (res.errMsg == 'shareAppMessage:fail cancel') {
//           　　　　　　　　// 用户取消转发
//         　　　　　　} else if (res.errMsg == 'shareAppMessage:fail') {
//           　　　　　　　　// 转发失败，其中 detail message 为详细失败信息
//         　　　　　　}
//       　　　　},
//       　　　　complete: fucntion(){
//         　　　　　　// 转发结束之后的回调（转发成不成功都会执行）
//       　　　　}
//   　　},
//   　　// 来自页面内的按钮的转发
//   　　if(options.from == 'button'){
//   　　　　var eData = options.target.dataset;
//   　　　　console.log(eData.name);     // shareBtn
//   　　　　// 此处可以修改 shareObj 中的内容
//   　　　　shareObj.path = '/pages/btnname/btnname?btn_name=' + eData.name;
// 　　}
// 　　// 返回shareObj
// 　　return shareObj;
}
})