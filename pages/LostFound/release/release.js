// pages/LostFound/release/release.js
const sendAjax = require('../../../utils/sendAjax.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:null,
    picurl:[],
    cnt:0,
      // / images / addpic.png
    show: false,
    text:'请填写物品说明' ,
    explainclass:0,
    lostTypeList:[],
    currentTab:0,
    typename:'请选择分类',
  },
  imagesshow:function(){
    var that=this
    var picurl = that.data.picurl
  if(picurl.length>=4){
     that.setData({
       show:true
     })
    //  console.log(1111);
  }else {
    console.log(picurl.length);
    that.setData({
      show: false
    })
  }
  },
  addpicture:function(){
    var that=this
    var cnt=that.data.picurl.length
    var picurl = that.data.picurl
    var index = that.data.picurl.length;

    if(cnt!=4)
    {
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success(res) {
          var tempFilePaths = res.tempFilePaths
          console.log(tempFilePaths)
          for (var i = 0; i < tempFilePaths.length; i++) {
            picurl.splice(index, 0, tempFilePaths[i])
          }
          // console.log(picurl)
          that.setData({ picurl: picurl })
          console.log(picurl)
        }
      })
      }
   that.imagesshow();
  },
  removepicture:function(e){
    var that=this
    var picurl = that.data.picurl
    console.log(e)
    var index = e.currentTarget.dataset.index
    picurl.splice(index,1)
    that.setData({ picurl:picurl})
    that.imagesshow();
  },
  chingepicture:function(e){
    var that = this
    var picurl = that.data.picurl
    var index = e.currentTarget.dataset.index
    console.log(that);
    // console.log(index);
    // picurl.splice(index, 1)
    // that.setData({ picurl: picurl })
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        var tempFilePaths = res.tempFilePaths
        picurl.splice(index, 1, tempFilePaths )

        that.setData({ picurl: picurl })
      }
    })
 
    that.imagesshow();
  },
  getmap:function(){
    var that=this

    // console.log('111')
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        wx.chooseLocation({
          success: function (res) { 
            console.log(res)
            that.setData({
              address:res.name
            });
           },
        })
      }
    })
  },
  toExplain:function(){
    var that=this;
  
    if (that.data.text =='请填写物品说明')
    {
      wx.navigateTo({
        url: 'explain/explain'
      });
    }else {
      wx.navigateTo({
        url: 'explain/explain?_text=' + that.data.text
      });
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  getlostType:function(){
    var that = this;
    let infoOpt = {
      url: '/lost/lostType',
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
      that.setData({
        lostTypeList:data.lostTypeList
      })
      console.log(that.data.lostTypeList)
    }

    sendAjax(infoOpt, infoCb, () => {

    });
  },
  onLoad: function (options) {
    var that=this
    that.getlostType();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //点击切换
  clickTab: function (e) {
    var _this = this;
    // console.log(_this.data.currentTab);
    // console.log(e.target.dataset.id);
    // // console.log(_this.data.newhigth);
    if (_this.data.currentTab === e.target.dataset.id) {

      return false;
    } else {
  // console.log(123)
      _this.setData({
        currentTab: e.target.dataset.id,
        typename: e.target.dataset.typename
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    let that = this;

    let pages = getCurrentPages();

    let currPage = pages[pages.length - 1];
      
    if (currPage.data.mydata == null || currPage.data.mydata ==undefined)
    {
 
    }
    else {
      that.setData({
        text: currPage.data.mydata.text,
        explainclass: currPage.data.mydata.isshow
      })
    }
    console.log(currPage)

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