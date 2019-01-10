const url = require('../../config.js')
const sendAjax = require('../../utils/sendAjax.js')
const query = require('../../utils/getInviterFirst.js')
var app = getApp()
var touchDotX = 0; //X按下时坐标
var touchDotY = 0; //y按下时坐标

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0, //当前的分类tab
    currentTypeid: 0, //当前的分类的id,
    currentTypeName: '南区食堂三楼', //当前的分类名字
    menuList: [{
        id: 1,
        typeName: '南区食堂三楼'
      },
      {
        id: 2,
        typeName: '北区食堂三楼'
      },
      {
        id: 3,
        typeName: '创新创业学院'
      },
      {
        id: 4,
        typeName: '校内常用热线'
      }
    ],
    scrollList: [],
    contactObj: {},
    scrollTop: 0,
    scrollTopstart: 0,
    contactArr: [{
      name: '鸡柳薯条奶昂',
      phone: '15857542186',
      ishidden: false
    }, {
      name: '黄焖鸡米饭',
      phone: '18357577100',
      ishidden: false
    }, {
      name: '嵊州年糕炸面',
      phone: '18267597303',
      ishidden: false
    }, {
      name: '6号档口炒饭盖浇饭',
      phone: '17857058385',
      ishidden: false
    }, {
      name: '瓦罐小吃',
      phone: '17816535705',
      ishidden: false
    }, {
      name: '清真兰州拉面',
      phone: '17857054226',
      ishidden: false
    }, {
      name: '煎饼',
      phone: '18868706019',
      ishidden: false
    }, {
      name: '砂锅凉面',
      phone: '13515757606',
      ishidden: false
    }, {
      name: '麻辣烫',
      phone: '15005859077',
      ishidden: false
    }, {
      name: '港式盖浇饭',
      phone: '13429585820',
      ishidden: false
    }, {
      name: '烤肉饭',
      phone: '15167546660',
      ishidden: false
    }],
    inputVal: '',
    // canIUserScroll: true,
    isLoading: false,
    emptySearch: false,
    isLoaded: false,
    phoneHeight: 0,
    open: false,
    windowWidth: wx.getSystemInfoSync().windowWidth,
    translate: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    let that = this
    that.getuserdata(1);
    // 获取系统信息
    this.setData({
      phoneHeight: 750 / wx.getSystemInfoSync().windowWidth * wx.getSystemInfoSync().windowHeight - 141
    })
  },
  //单击导航栏
  clickMenu: function(e) {
    var that = this;
    var current = e.currentTarget.dataset.current //获取当前tab的index
    var typeid = e.currentTarget.dataset.typeid; //获取当前的类型id
    var name = e.currentTarget.dataset.name;
    var open = !this.data.open;
    this.setData({
      currentTypeid: typeid,
      currentTab: current,
      currentTypeName: name,
      translate: 'transform: translateX(0px)',
    })
    setTimeout(function() {
      that.setData({
        open: open
      })
    }, 300)
  },
  // 触摸开始事件 
  touchStart: function(e) {
    touchDotX = e.touches[0].pageX; // 获取触摸时的原点
    touchDotY = e.touches[0].pageY;
  },
  // 触摸结束事件 
  touchEnd: function(e) {
    var that = this;
    var touchMoveX = e.changedTouches[0].pageX;
    var touchMoveY = e.changedTouches[0].pageY;
    var tmX = touchMoveX - touchDotX;
    var tmY = touchMoveY - touchDotY;
    var absX = Math.abs(tmX);
    var absY = Math.abs(tmY);
    if (absX > 2 * absY) {
      if (tmX < -50) { //左滑
        var open = !this.data.open;
        this.setData({
          translate: 'transform: translateX(0px)',

        })
        setTimeout(function() {
          that.setData({
            open: open
          })
        }, 300)
      } else if (tmX > 50) { // 右滑
        var open = !this.data.open;
        this.setData({
          open: open,
          translate: 'transform: translateX(' + this.data.windowWidth * 0.3 + 'px)'
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {


  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh: function() {
    this.setData({
      scrollTop: 0,
      scrollTopstart: 0,
      contactArr: [],
      inputVal: ''
    })
    this.getuserdata(1)
    wx.stopPullDownRefresh();
  },

  /**
   * 通讯录实现
   *
   */
  getuserdata(n) {
    this.handleSortdata();
  },

  /**
   * 拿到后台数据
   */
  handleSortdata() {

    let contactArr = this.data.contactArr;
    console.log(contactArr)
    /**
     * 拿到数据那名字的首字母firstInitials.js
     * 处理为contactObj ={firstInitials{title:firstInitials,list:[item]}}
     */
    let contactObj = {}

    // console.log(contactArr)
    contactArr.forEach(item => {
      //查看拼音首字母大写,调用getInviterFirst.js
      let firstInitials = query(item.name)

      if (!((/[A-Z]/g).test(firstInitials))) {

        firstInitials = '11';
      }
      if (contactObj[firstInitials]) {

        contactObj[firstInitials].list.push(item)
      } else {

        if (firstInitials !== '11') {

          contactObj[firstInitials] = {
            title: firstInitials,
            list: [item]
          }
        } else {

          contactObj['11'] = {
            title: '#',
            list: [item]
          }
        }

      }
    })


    /**
     * 对首字母排序
     */
    let arr = []
    let hiddenCount = 0

    for (let key in contactObj) {
      contactObj[key].ishidden = contactObj[key].list.every(contact => contact.ishidden)
      arr.push(key)

      if (contactObj[key].ishidden) {
        hiddenCount++
      }
    }

    arr = arr.sort()

    this.setData({
      scrollList: arr,
      contactObj: contactObj,
      emptySearch: hiddenCount === arr.length
    })
  },

  /**
   * 滚动条位置
   */
  handleScroll: function(e) {

    this.setData({
      scrollTopstart: e.detail.scrollTop
    })
  },

  /**
   * 链接侧边字母与内容字母
   * 
   */
  handleScrollView(e) {
    let that = this

    let key = e.currentTarget.dataset.key
    console.log(key)

    let query = wx.createSelectorQuery()

    query.select(`#view_${key}`).boundingClientRect()
    query.selectViewport().scrollOffset()

    query.exec(function(res) {
      console.log(res)
      console.log(that.data.scrollTopstart)
      that.setData({
        scrollTop: that.data.scrollTopstart + res[0].top - 65
      })
      console.log(that.data.scrollTop)
    })
  },

  /**
   * 搜索功能
   */
  bindKeyInput: function(e) {

    let contactArr = this.data.contactArr
    console.log(contactArr)
    let inputVal = e.detail.value
    let reg = new RegExp(inputVal, 'i')

    contactArr.forEach(item => {

      item.ishidden = !reg.test(item.name);
    })

    this.setData({
      contactArr,
      inputVal
    })

    this.handleSortdata()
  },

  /**
   * 清空输入
   */
  handlecancelSearch() {

    let contactArr = this.data.contactArr

    contactArr.forEach(item => {

      item.ishidden = false
    })

    this.setData({
      inputVal: '',
    });

    this.handleSortdata();

    return;
  },


  /**
   * 拨打电话
   */
  handleMakeCall: function(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.mobile
    })
  },

  tap_ch: function(e) {
    console.log(this.data.open)
    var that = this;
    if (this.data.open) {
      var open = !this.data.open;
      this.setData({
        translate: 'transform: translateX(0px)',

      })
      setTimeout(function() {
        that.setData({
          open: open
        })
      }, 300)
    } else {
      var open = !this.data.open;
      this.setData({
        open: open,
        translate: 'transform: translateX(' + this.data.windowWidth * 0.3 + 'px)'
      })
    }
  },

})