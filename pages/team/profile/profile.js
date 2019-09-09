// pages/profile/profile.js
var url = "https://www.sxscott.com/association"
import Toast from '../../../dist/toast/toast'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    message: [],
    name: '',
    /* 社团名 */
    school: '',
    address: '',
    phone: '',
    sQQ: '',
    sWX: '',
    member: '',
    follow: '',
    activity: '',
    fabulous: '',
    picture: '',
    cost: '',
    introduce: '',
    article: [99999, 10000],
    count: 0,
    page: 1,
    cc:[],
    pic:'https://www.gadstru.cn/association/picture/jpg/2.jpg'
  },
  previewImage: function (e) {
    let that = this
    let sum = e.currentTarget.dataset.liulan
    var src = e.currentTarget.dataset.src;
    var imgList = e.currentTarget.dataset.list;
    var id = e.currentTarget.dataset.id
    let index=e.currentTarget.dataset.force
    wx.previewImage({
      current: src,
      urls: imgList,
    })
    sum++;
    wx.request({
      url: url + '/wx/setCount',
      data: {
        id: id,
        dianzan: 0,
        liulan: sum
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: "POST",
      success(res) {
        console.log(res)
      }

    })
    let upList = that.data.message
    console.log(upList)
    console.log(index)
    upList[index].liulan = sum
    that.setData({
      message: upList
    })
  },

  /**
   * 跳转到报名界面
   */
  toSubmit:function(){
    let that=this
    let name = that.data.name
    let flag=1
    let cc=that.data.cc
    console.log(cc)
    console.log(cc)
    for(var i in cc){
      console.log(cc[i])
      if(cc[i]==name){
        flag = 0
        break;
       
      }
      
    }
  if(flag==1){
    wx.reLaunch({
      url: '../../../pages/team/body/body?name='+name+'',
    })
    }else{
      Toast('已报名，请耐心等待审核结果');
    }
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
   let cc= wx.getStorageSync('code')
    console.log(options.name)
    that.setData({
      name: options.name,
      cc:cc
    })

    wx.request({
      url: url + '/wx/getTalk',
      data: {
        name: that.data.name,
        page: ""
      },
      method: "POST",
      success(res) {
        console.log(res.data)
        that.setData({
          school: res.data.school,
          address: res.data.address,
          phone: res.data.phone,
          sQQ: res.data.sqq,
          sWX: res.data.swx,
          member: res.data.member,
          follow: res.data.follow,
          activity: res.data.activity,
          fabulous: res.data.fabulous,
          picture: res.data.picture,
          cost: res.data.cost,
          introduce: res.data.introduce,
          pic:res.data.picture
          
        })

      }


    })
 /* 显示 消息 */
    let arr = wx.getStorageSync("article")
    that.setData({
      article: arr
    })

   
    wx.request({
      url: url + '/wx/getAction',
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
        for (var i in res.data.url) {
          res.data.url[i].bodyUrl = JSON.parse(res.data.url[i].bodyUrl)
        }
        that.setData({
          message: res.data.url

        })
      }
    })
    that.setData({
      buttonClicked: false
    })

  },

  /* 点赞 */
  btnClick: function (e) {
    console.log(e)
    let id = e.currentTarget.dataset.id
    console.log(id)
    let that = this
    let arr = that.data.article
    let sum = e.currentTarget.dataset.dianzan
    let flag = 1;
    let index=e.currentTarget.dataset.index
    //let arr = wx.getStorageSync('article')
    console.log(arr)
    for (var i in arr) {
      if (arr[i] == id) {
        wx.showToast({
          title: "取消点赞",
          icon: 'success',
          duration: 1000,
          image: '/images/dianzan2.png'
        })
        arr.splice(i, 1);
        sum--;
        flag = 0

        break;
      }
    }
    if (flag == 1) {
      wx.showToast({
        title: "点赞成功",
        icon: 'success',
        duration: 1000,
        image: '/images/dianzan1.png'
      })
      arr.push(id)
      sum++
    }
    wx.setStorageSync('article', arr)

    wx.request({
      url: url + '/wx/setCount',
      data: {
        id: id,
        dianzan: sum,
        liulan: 0
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: "POST",
      success(res) {
        console.log(res)
      }

    })
    that.setData({
      article: arr
    })

    let update1 = that.data.message
    update1[index].dianzan = sum
    that.setData({
      message: update1
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
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})