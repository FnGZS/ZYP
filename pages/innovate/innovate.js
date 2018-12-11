Page({

  data: {
    phoneHeight:null,
    innovatPics:[
      { id: 1, logo:'https://randomuser.me/api/portraits/women/18.jpg'},
      { id: 2, logo: 'https://randomuser.me/api/portraits/women/2.jpg' },
      { id: 3, logo: 'https://randomuser.me/api/portraits/women/3.jpg' },
      { id: 4, logo: 'https://randomuser.me/api/portraits/women/4.jpg' },
      { id: 5, logo: 'https://randomuser.me/api/portraits/women/5.jpg' },
      { id: 6, logo: 'https://randomuser.me/api/portraits/women/6.jpg' },
      { id: 7, logo: 'https://randomuser.me/api/portraits/women/7.jpg' },
      { id: 8, logo: 'https://randomuser.me/api/portraits/women/8.jpg' },
      { id: 9, logo: 'https://randomuser.me/api/portraits/women/9.jpg' },
      { id: 10, logo: 'https://randomuser.me/api/portraits/women/10.jpg' },
      { id: 11, logo: 'https://randomuser.me/api/portraits/women/11.jpg' },
      { id: 12, logo: 'https://randomuser.me/api/portraits/women/12.jpg' }
    ]
  },
  onLoad: function (options) {
    
  },
  getPhoneInfo: function () {
    this.setData({
      phoneHeight: 750 / wx.getSystemInfoSync().windowWidth * wx.getSystemInfoSync().windowHeight
    })
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