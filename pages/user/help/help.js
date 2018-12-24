
var url = require('../../../config.js')
const sendAjax = require('../../../utils/sendAjax.js')

Page({
  data: {
    list: [],
    openList:[]
  },
  onReady:function(){
    var that = this
    let infoOpt = {
      url: '/help/gethelp',
      type: 'GET',
      data: {
      },
      header: {
        'content-type': 'application/json',
        // 'authorization': wx.getStorageSync("authorization"),
      },
    }
    let infoCb = {}
    infoCb.success = function (res) {
      
      that.setData({
        list: res.items
      })
      var arr = that.data.openList
      for (let i = 0, len = res.items.length; i < len; i++) {
        arr.push({"open":false})
      }
      that.setData({
        openList: arr
      })
      // console.log(that.data.openList)
    }
    infoCb.beforeSend = () => { }
    infoCb.complete = () => {

    }
    sendAjax(infoOpt, infoCb, () => {
    });

  },
  /**
   * 收缩核心代码
   */
  kindToggle(e) {
    
    var index = e.currentTarget.dataset.openlist;
    let openList = this.data.openList;
    openList[index].open = !openList[index].open;
    this.setData({
      openList
    })
  }
})