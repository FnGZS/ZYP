
const sendAjax = require('../../../utils/sendAjax.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userProposal:"",
    userPhone:"",
    userWxid:"",
    btnColor:true,
    trueDisplay:"none",
    falseDisplay:"none"
  },
  userProposal:function(e){
    var that = this
    
    that.setData({
      userProposal : e.detail.value
    })
    var userPne = that.data.userPhone
    console.log(userPne)
    console.log(e.detail.value)
   
      if (e.detail.value == ""){
        
        that.setData({
          btnColor: true
        })
      
      
      } else if (userPne == "") {
        that.setData({
          btnColor: true
        })
        
        }else {
      that.setData({
        btnColor: false
      })
    }
  },
  userPhone: function (e) {
    var that = this
    that.setData({
      userPhone : e.detail.value
    })
    var userPro = that.data.userProposal
    console.log(userPro)
    console.log(e.detail.value)
    if (e.detail.value == "") {

      that.setData({
        btnColor: true
      })


    } else if (userPro == "") {
      that.setData({
        btnColor: true
      })

    } else {
      that.setData({
        btnColor: false
      })
    }
  },
  userWxid: function (e) {
    var that = this
    that.setData({
      userWxid : e.detail.value
    })
    
  },
  tijiao:function(){
    const  that = this;
    var phone = that.data.userPhone
    console.log(phone.length)
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/; 
    if (!myreg.test(phone)){
      that.setData({
        falseDisplay: "block"
      })
      setTimeout(function () {
        that.setData({
          falseDisplay: "none"
        })

      }, 2000);
      clearTimeout();
    }else{
      console.log(that.data)
      let infoOpt = {
        url: '/opinion/creat',
        type: 'POST',
        data: {
          proposal: that.data.userProposal,
          phone: that.data.userPhone,
          wxid: that.data.userWxid
        },
        header: {
          'content-type': 'application/json'
        },
      }
      let infoCb = {}
      infoCb.success = function (data) {
        console.log(data);
        that.setData({
          trueDisplay: "block"
        })
        timer = setTimeout(function () {
          wx.navigateBack()
        }, 1000);

      }
      sendAjax(infoOpt, infoCb, () => {

      });
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