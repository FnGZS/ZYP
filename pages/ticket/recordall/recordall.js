
const url = require('../../../config.js')
const sendAjax = require('../../../utils/sendAjax.js')
Page({
    data: {
      joinList:[]
    },
    onLoad(o){
      console.log(o)
      var joinList = JSON.parse(o.joinList)
      this.setData({
        joinList
      })
    },
  gojoinDetail(e){
    console.log(e)
  },
    onShow: function() {
        
    }
});