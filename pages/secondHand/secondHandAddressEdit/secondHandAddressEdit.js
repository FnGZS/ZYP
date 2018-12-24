const url = require('../../../config.js')
const sendAjax = require('../../../utils/sendAjax.js')
Page({
  data: {
    id:null,
    userId: null,
    name: '',
    phone: '',
    postion: '',
    isDefault: false
  },

  onLoad: function (options) {
    var userId = wx.getStorageSync('userId');
    var detail = JSON.parse(options.detail);
    console.log(detail)
    if(detail.isDefault == 1){
      var isDefault = true;
    }else{
      var isDefault = false;
    }
    this.setData({
      id:detail.id,
      userId: userId,
      name: detail.name,
      phone: detail.telephone,
      postion: detail.address,
      isDefault:isDefault
    })
  },
  save: function () {
    var id = this.data.id;
    var userId = this.data.userId;
    var name = this.data.name;
    var phone = this.data.phone;
    var postion = this.data.postion;
    var isDefault = this.data.isDefault;
    if (name == '' || name == null) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none',
        duration: 1000
      })
    }else if(name.length > 10){
      wx.showToast({
        title: '请输正确的姓名',
        icon: 'none',
        duration: 1000
      })
    }else if (phone == '' || phone == null) {
      wx.showToast({
        title: '请输入手机号码',
        icon: 'none',
        duration: 1000
      })
    } else if (phone.length != 11) {
      wx.showToast({
        title: '请输入11位的手机号码',
        icon: 'none',
        duration: 1000
      })
    } else if (postion == '' || postion == null) {
      wx.showToast({
        title: '请输入详细地址',
        icon: 'none',
        duration: 1000
      })
    }else{
      //修改地址
      var that = this;
      if (isDefault) {
        isDefault = 1;
      } else {
        isDefault = 0;
      }
      var data = {
        'id': id,
        'userId': userId,
        'name': name,
        'telephone': phone,
        'address': postion,
        'isDefault': isDefault
      }
      let infoOpt = {
        url: '/secondary/userAddress/update',
        type: 'PUT',
        data: JSON.stringify(data),
        header: {
          'content-type': 'application/json',
        },
      }
      let infoCb = {}
      infoCb.success = function (res) {
        console.log(res);
        if (res.code == 200) {
          wx.showModal({
            title: '提示',
            content: '修改成功',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.navigateBack({})
              }
            }
          })

        }
      }
      infoCb.beforeSend = () => { }
      sendAjax(infoOpt, infoCb, () => { });
    } 
  },
  delete:function(){
    var that = this;
    var id = this.data.id;
    wx.showModal({
      title: '提示',
      content: '确认删除该地址？',
      success(res) {
        if (res.confirm) {
          let infoOpt = {
            url: '/secondary/userAddress/delete/' + id,
            type: 'DELETE',
            data: {},
            header: {
              'content-type': 'application/json',
            },
          }
          let infoCb = {}
          infoCb.success = function (res) {
            if(res.code == 200){
              wx.showModal({
                title: '提示',
                content: '删除成功',
                showCancel: false,
                success(res) {
                  if (res.confirm) {
                    wx.navigateBack({})
                  }
                }
              })
            }

          }
          infoCb.beforeSend = () => { }
          sendAjax(infoOpt, infoCb, () => { });
        } else if (res.cancel) {
          
        }
      }
    })
    
  },
  input_name: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  input_phone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  input_postion: function (e) {
    this.setData({
      postion: e.detail.value
    })
  },
  changeIsDefault: function (e) {
    var isDefault = this.data.isDefault;
    this.setData({
      isDefault: !isDefault
    })
    console.log(this.data.isDefault)
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