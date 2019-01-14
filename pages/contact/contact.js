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
    currentTypeid: 1, //当前的分类的id,
    currentTypeName: '南区食堂三楼', //当前的分类名字
    menuList: [],
    scrollList: [],
    contactObj: {},
    scrollTop: -65,
    scrollTopstart: 0,
    contactArr: [],
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
  onLoad: function (options) {
    let that = this;
  },
  onShow: function () {
    var that = this;
    var i = 0;

    this.getContactType();
    this.getContactData();
  },
  onReady: function () {
    var that = this;

    wx.getSystemInfo({
      success: function (res) {
        console.log(res.windowWidth)
        console.log(res.windowHeight)
        // that.setData({
        //   phoneHeight: 750 / wx.getSystemInfoSync().windowWidth * wx.getSystemInfoSync().windowHeight - 141
        // })
      }
    })
    setTimeout(function () {
      // 获取系统信息
      console.log(wx.getSystemInfoSync().windowWidth)
      console.log(wx.getSystemInfoSync().windowHeight)
      that.setData({
        phoneHeight: 750 / wx.getSystemInfoSync().windowWidth * wx.getSystemInfoSync().windowHeight - 141
      })
      console.log(that.data.phoneHeight)
    }, 1000)
    console.log(that.data.phoneHeight)

  },
  //单击导航栏
  clickMenu: function (e) {
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
      contactArr: []
    })
    console.log(this.data.currentTypeid)
    setTimeout(function () {
      that.setData({
        open: open
      })
    }, 300)
    this.getContactData();
  },
  //获取通讯录类型
  getContactType: function () {
    var that = this;
    let infoOpt = {
      url: '/contacts/getContactsType',
      type: 'GET',
      data: {},
      header: {
        'content-type': 'application/json',
      },
    }
    let infoCb = {}
    infoCb.success = function (res) {
      that.setData({
        menuList: res.contactsTypeList
      })
    }
    infoCb.beforeSend = () => { }
    sendAjax(infoOpt, infoCb, () => { });
  },
  //获取数据
  getContactData() {
    var that = this;
    var id = this.data.currentTypeid;
    let infoOpt = {
      url: '/contacts/getContactsTypeList/' + id,
      type: 'GET',
      data: {},
      header: {
        'content-type': 'application/json',
      },
    }
    let infoCb = {}
    infoCb.success = function (res) {
      console.log(res);
      var contactList = res.list;
      for (var i = 0; i < contactList.length; i++) {
        contactList[i]['ishidden'] = false;
      }
      console.log(contactList)
      that.setData({
        contactArr: contactList
      })
      that.handleSortdata();
      wx.hideLoading();

    }
    infoCb.beforeSend = () => {
      wx.showLoading({
        title: '加载中'
      })
    }
    sendAjax(infoOpt, infoCb, () => { });
  },
  // 触摸开始事件 
  touchStart: function (e) {
    touchDotX = e.touches[0].pageX; // 获取触摸时的原点
    touchDotY = e.touches[0].pageY;
  },
  // 触摸结束事件 
  touchEnd: function (e) {
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
        setTimeout(function () {
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
   * 下拉刷新
   */
  onPullDownRefresh: function () {
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
   * 拿到后台数据
   */
  handleSortdata() {
    let contactArr = this.data.contactArr;
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
    this.handleRight();
  },
  //右侧字母距离处理
  handleRight: function () {
    var that = this;
    var contactArr = this.data.contactObj;
    for (let key in contactArr) {
      let query = wx.createSelectorQuery()
      query.select(`#view_${key}`).boundingClientRect()
      query.selectViewport().scrollOffset()
      query.exec(function (res) {
        that.setData({
          [`contactObj.${key}.top`]: res[0].top
        })
        contactArr[key].top = res[0].top
      })
    }
    console.log(contactArr)

    console.log(that.data.contactObj)
  },
  /**
   * 链接侧边字母与内容字母
   */
  handleScrollView(e) {
    let that = this
    let key = e.currentTarget.dataset.key
    let top = e.currentTarget.dataset.top
    console.log(key)
    wx.pageScrollTo({
      scrollTop: top - 65
    })

  },

  /**
   * 搜索功能
   */
  bindKeyInput: function (e) {
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
   * 拨打电话
   */
  handleMakeCall: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.mobile
    })
  },

  tap_ch: function (e) {
    console.log(this.data.open)
    var that = this;
    if (this.data.open) {
      var open = !this.data.open;
      this.setData({
        translate: 'transform: translateX(0px)',
      })
      setTimeout(function () {
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
  toContactDetail: function (e) {
    var id = e.currentTarget.dataset.contactid;
    wx.navigateTo({
      url: 'contactDetail/contactDetail?id=' + id + '&isShare=0',
    })
  }
})