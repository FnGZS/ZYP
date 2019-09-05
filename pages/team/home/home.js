var url = "https://www.sxscott.com/association"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    message: [],
    page: 1,
    name: "",
    swiper: [],
    article: [99999, 10000],
    count: 0,
    pages: 999,
  },
  previewImage: function(e) {
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
      }
    })  
    let upList=that.data.message
    console.log(upList)
    console.log(index)
    upList[index].liulan=sum
    that.setData({
      message:upList
    })
  },

  // 滚动到顶部
  backTop: function () {
    // 控制滚动
    wx.pageScrollTo({
      scrollTop: 0
    })
  },

  tiaozhuan:function(){
    wx.navigateTo({
      url: '/pages/team/team/team',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    wx.setStorage({
      key: "article",
      data: []
    })
    let arr = wx.getStorageSync("article")
    that.setData({
      article: arr
    })




    /*  */
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
      }),
      wx.request({
        url: url + '/user/swiper',
        method: "POST",
        data: {},
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          console.log(res.data)
          that.setData({
            swiper: res.data.urls

          })
        }
      })

    that.setData({

      buttonClicked: false
    })



  },

  /* 点赞 */
  btnClick: function(e) {
    console.log(e)
    let id = e.currentTarget.dataset.id
    console.log(id)
    let that = this
    let index=e.currentTarget.dataset.index
    let arr = that.data.article
    let sum = e.currentTarget.dataset.dianzan
    let flag = 1;
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
      article: arr,

    })
    let update1=that.data.message
    update1[index].dianzan=sum
    that.setData({
      message:update1
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
    // 下拉触底，先判断是否有请求正在进行中
    // 以及检查当前请求页数是不是小于数据总页数，如符合条件，则发送请求
    console.log(1);
    if (this.data.page <= this.data.pages) {
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
      this.data.page = this.data.pages
    }
  },

  fetchArticleList(pageNo) {
    let that = this;

    wx.request({
      url: url + '/wx/getAction',
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
        for (var i in res.data.url) {
          res.data.url[i].bodyUrl = JSON.parse(res.data.url[i].bodyUrl)
        }
        that.setData({
          message: that.data.message.concat(res.data.url), //与旧数组相连接
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }

})