const url = require('../../../config.js')
const sendAjax = require('../../../utils/sendAjax.js')
Page({
  data: {
    URL: url.host,
    id: null,  //活动ID
    studentId: wx.getStorageSync("userinfo").userId,  //用户ID
    currentNavId: 0, //当前导航栏ID
    lodingHidden: '',
    voteTimeAll: '',
    voteTimeDay: '',
    voteTimeHour: '',
    voteTimeMin: '',
    voteTimeSec: '',
    voteDetail: null, //投票详情
    status: 0, //投票状态
    voteStatusColor: '', //投票状态背景色
    voteStatusText: '', //投票状态文字
    voteBtnColor: '',
    voteBtnText: '',
    voteBtnClick: 0, //投票按钮是否可按
    navpic: null, //导航栏图片
    userList: null, //用户列表
    voteSum: null, //投票总数
    visitNum: null, //访问次数
    userRank: null, //用户排名
    search_content: null, //搜索内容
    userHidden: [], //用户是否隐藏
    user_choose: [], //用户是否选择
    startTime: null, //投票开始时间
    endTime: null, //投票结束时间
    rule_limt: null, //投票限制
    rule_intro: null, //投票介绍
    voteMax: null,
    voteMin: null,
    phoneHeight: '',
    isshow: 0,
    watchID: '',
    watchPassWord: '',
    time: '获取验证码', //倒计时 
    currentTime: 61,//限制60s
    isClick: 'getCode',//获取验证码按钮，默认允许点击
    watchCode: '',
    watchPhone: '',
  },
  getPhoneInfo: function () {
    this.setData({
      phoneHeight: 750 / wx.getSystemInfoSync().windowWidth * wx.getSystemInfoSync().windowHeight
    })
  },
  onLoad: function (options) {
    this.getPhoneInfo();
    var that = this;
       

    // console.log(options)
    this.setData({

      id: options.id
      // id:1
    })
    this.getVoteDetail(); //获取投票详情
    // console.log(that.data.id)
    this.getVoteRank(); //获取投票排行

    // wx.request({
    //   url: this.data.URL + `/vote/getAction/detail/${this.data.id}`,
    //   data: {},
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   success(res) {
    //     var voteDetail = res.data;
    //     that.setData({
    //       voteTimeAll: voteDetail.timeDiff
    //     }) 
    //   },
    //   complete: function (res){
    //     countdown(that)
    //   }
    // })

  },
  //获取投票详情
  getVoteDetail: function () {
    var that = this;
    let infoOpt = {
      url: '/vote/getAction/detail/' + this.data.id,
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
      var voteDetail = res;
      console.log(res);
      var diffTime = parseInt(voteDetail.timeDiff / 1000)
      that.setData({
        navpic: voteDetail.actionImage,
        status: voteDetail.status,
        userList: voteDetail.voteDetailList,
        startTime: voteDetail.startTime,
        endTime: voteDetail.endTime,
        rule_limt: voteDetail.voteRuler,
        rule_intro: voteDetail.actionIntro,
        voteSum: voteDetail.voteSum,
        visitNum: voteDetail.visitNum,
        voteTimeAll: diffTime,
        voteMin: voteDetail.voteMin,
        voteMax: voteDetail.voteMax,
      })
      console.log(voteDetail)
      if (voteDetail.status != 2) {
        countdown(that);
      }
      that.initChoose(); //初始化选中
      that.checkStatus(); //检测当前活动状态
    }
    sendAjax(infoOpt, infoCb, () => {

    });
  },
  //检测投票状态
  checkStatus: function () {
    var that = this;
    var status = that.data.status;
    if (status == 0) { //投票未开始
      that.setData({
        voteStatusColor: 'grey',
        voteStatusText: '投票未开始',
        voteBtnColor: 'grey',
        voteBtnText: '投票未开始',
        lodingHidden: 'hidden'
      })
      // countdown(this);
    } else if (status == 1) { //投票进行中
      that.checkVote(status);
      that.setData({
        voteStatusColor: 'linear-gradient(to right, #FF4341, #FC5841)',
        voteStatusText: '投票进行中',
        lodingHidden: 'hidden'
      })
      // countdown(this);
    } else if (status == 2) {
      that.checkVote(status);
      that.setData({
        voteStatusColor: '#FF4341',
        voteStatusText: '投票已结束',
        lodingHidden: 'hidden'
      })
    }
  },
  // 检测是否投过票
  checkVote: function (voteStatus) {
    // console.log(voteStatus)
    var that = this;
    var studentId = wx.getStorageSync("userinfo").userId;
    let infoOpt = {
      url: '/vote/check',
      type: 'POST',
      data: {
        actionId: that.data.id,
        studentId: studentId
      },
      header: {
        'content-type': 'application/json',
        // 'authorization': wx.getStorageSync("authorization"),
      },
    }
    let infoCb = {}
    infoCb.success = function (res) {
      // console.log(res);
      if (res.status == 0) {
        if (voteStatus == 1) {
          that.setData({
            voteBtnColor: 'linear-gradient(to right, #FF4341, #FC5841)',
            voteBtnText: '投票',
            voteBtnClick: 1
          })
        } else if (voteStatus == 2) {
          that.setData({
            voteBtnColor: '#FF4341',
            voteBtnText: '投票已结束',
            voteBtnClick: 0
          })
        }

      } else {
        // console.log(res.data.detail);
        var detail = res.detail;
        var isVote = detail.split(',');
        var user_choose = that.data.user_choose;
        for (var i = 0; i < isVote.length; i++) {
          user_choose[isVote[i] - 1] = true;
        }
        // console.log(user_choose);
        that.setData({
          voteBtnColor: 'grey',
          voteBtnText: '已投票',
          user_choose: user_choose,
          voteBtnClick: 0,
          lodingHidden: 'hidden'
        })
      }
    }
    sendAjax(infoOpt, infoCb, () => {
      // that.onLoad()
      // wx.setStorageSync('G_needUploadIndex', true)
    });
  },
  // 搜索内容
  search_content: function (e) {
    var search_content = e.detail.value;
    this.setData({
      search_content: search_content
    })
  },
  // 搜索
  search: function () {
    var that = this;
    var search_content = this.data.search_content;
    var userHidden = this.data.userHidden;
    if (search_content == null || search_content == '') {
      for (var i = 0; i < userHidden.length; i++) {
        userHidden[i] = '';
      }
      this.setData({
        userHidden: userHidden
      })
    } else {
      if (isNaN(search_content)) { //不是数字
        let infoOpt = {
          url: '/vote/search',
          type: 'POST',
          data: {
            actionId: that.data.id,
            peopleName: search_content
          },
          header: {
            'content-type': 'application/json',
            // 'authorization': wx.getStorageSync("authorization"),
          },
        }
        let infoCb = {}
        infoCb.success = function (res) {
          var userList = res.voteDetailList;
          var j = 0;
          for (var i = 0; i < userHidden.length; i++) {
            if (userList.length > j) {
              if (i == userList[j].serialId - 1) {
                userHidden[i] = '';
                j++;
              } else {
                userHidden[i] = 'hidden';
              }
            } else {
              userHidden[i] = 'hidden';
            }
          }
          that.setData({
            userHidden: userHidden
          })
        }
        sendAjax(infoOpt, infoCb, () => {
          // that.onLoad()
          // wx.setStorageSync('G_needUploadIndex', true)
        });
      } else { //是数字
        for (var i = 0; i < userHidden.length; i++) {
          if (i == search_content - 1) {
            userHidden[i] = '';
          } else {
            userHidden[i] = 'hidden';
          }
        }
        this.setData({
          userHidden: userHidden
        })
      }
    }
  },
  //获取当前投票排行
  getVoteRank: function () {
    var that = this;

 
    let infoOpt = {
      url: `/vote/getAction/detail/rank/` + this.data.id,
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
        userRank: res.voteDetailList
      })
    }
    sendAjax(infoOpt, infoCb, () => {
      // that.onLoad()
      // wx.setStorageSync('G_needUploadIndex', true)
    });
  },
  //初始化选中状态
  initChoose: function () {

    var that=this;
   
    var userList = that.data.userList;
    // console.log(userList);
    var user_choose = [];
    var userHidden = [];
    for (var i = 0; i < userList.length; i++) {
      user_choose.push(false);
      userHidden.push('');
    }
    that.setData({
      user_choose: user_choose,
      userHidden: userHidden
    })
  },
  // 勾选选手
  userChoose: function (e) {
    var num = e.currentTarget.dataset.num;
    var user_choose = this.data.user_choose;
    user_choose[num] = !user_choose[num];
    this.setData({
      user_choose: user_choose
    })
  },
  //关闭弹窗
  Close: function () {
    var that = this;
    that.setData({
      isshow: 0
    })
  },
  watchID: function (event) {
    // console.log(event.detail.value);
    let that = this;
    that.setData({
      watchID: event.detail.value,
    })
  },
  watchPassWord: function (event) {
    let that = this;
    that.setData({
      watchPassWord: event.detail.value,
    })
  },
  watchPhone: function (event) {
    let that = this;
    that.setData({
      watchPhone: event.detail.value,
    })
  },
  watchCode: function (event) {
    let that = this;
    that.setData({
      watchCode: event.detail.value,
    })
  },
  //获取验证码
  getCode: function () {
    var that = this;
    console.log(that.data.watchPhone);
    /*第一步：验证手机号码*/
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;// 判断手机号码的正则
    if (that.data.watchPhone.length == 0) {
      wx.showModal({
        title: '提示',
        content: '手机号码不能为空',
        showCancel: false
      })
    }
    else if (that.data.watchPhone.length < 11) {
      wx.showModal({
        title: '提示',
        content: '手机号码长度有误！',
        showCancel: false
      })
    } else if (!myreg.test(that.data.watchPhone)) {
      wx.showModal({
        title: '提示',
        content: '错误的手机号码！',
        showCancel: false
      })
    }
    else {
      /*第二步：设置计时器*/
      // 先禁止获取验证码按钮的点击
      that.setData({
        isClick: 'getK',
      })
      // 60s倒计时 setInterval功能用于循环，常常用于播放动画，或者时间显示
      var currentTime = that.data.currentTime;
      var interval = setInterval(function () {
        currentTime--;//减
        that.setData({
          time: currentTime + '秒后获取'
        })
       
        if (currentTime <= 0) {
          clearInterval(interval)
          that.setData({
            time: '获取验证码',
            currentTime: 61,
            isClick: 'getCode'
          })
        }
      }, 1000);
      let infoOpt = {
        url: '/user/sms',
        type: 'POST',
        data: {
          phone: that.data.watchPhone
        },
        header: {
          'content-type': 'application/json',
       
        },
      }
      let infoCb = {}
      infoCb.success = function (data) {
        console.log(data);
      }

      sendAjax(infoOpt, infoCb, () => {
        // that.onLoad()
        // wx.setStorageSync('G_needUploadIndex', true)
      });
    }
  },
  getK: function () {
    return;
  },
  Submission: function () {
    var that = this;
    let infoOpt = {
      url: '/user/binding',
      type: 'POST',
      data: {
        schoolNum: that.data.watchID,
        password: that.data.watchPassWord,
        phone: that.data.watchPhone,
        code: that.data.watchCode
      },
      header: {
        'content-type': 'application/json',
        'authorization': wx.getStorageSync("userinfo").authorization,
      },
    }
    let infoCb = {}
    infoCb.success = function (data) {
        console.log(data)
      if (data.code == 200) {
        // wx.setStorageSync('isbound', 1);
        // wx.setStorageSync('authorization', data.asToken);
        wx.showModal({
          title: '提示',
          content: data.message || '处理失败',
          showCancel: false,
        });
        if (data.result) {
          wx.setStorageSync('isbound', 1);
          wx.setStorageSync('authorization', data.asToken);
          wx.setStorageSync("userId", that.data.watchID)
          that.setData({
            isshow: 0
          })
          
        }
      }
    }

    sendAjax(infoOpt, infoCb, () => {
      // that.onLoad()
      // wx.setStorageSync('G_needUploadIndex', true)
    });

  },
  catchtouchmove: function () {
    return
  },
  // 投票
  voteBtn: function () {
    var that = this;
    console.log(wx.getStorageSync("userinfo").userId);
    var isbound = wx.getStorageSync('userinfo').isbound;//判断是否绑定了学号
    console.log(isbound);
    if (isbound == 2) {
      that.setData({
        isshow: 1,
      })
      if (wx.pageScrollTo) {
        wx.pageScrollTo({
          scrollTop: 0
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
        })
      }
    } else if (isbound == 1) {
      var user_choose = this.data.user_choose;
      var userList = this.data.userList;
      var creatVote = [];
      for (var i = 0; i < userList.length; i++) {
        if (user_choose[i] == true) {
          creatVote.push(userList[i].serialId);
        }
      }
      // console.log(creatVote.length);
      if (creatVote.length == 0) {
        wx.showToast({
          title: '您还未勾选任何人',
          icon: 'none',
          duration: 1500
        })
      } else if (creatVote.length < that.data.voteMin) {
        wx.showToast({
          title: '最少选择' + that.data.voteMin + '个人',
          icon: 'none',
          duration: 1500
        })
      }
      else if (creatVote.length > that.data.voteMax) {
        wx.showToast({
          title: '最多选择' + that.data.voteMax + '个人',
          icon: 'none',
          duration: 1500
        })
      } else {
        var voteString = creatVote.join(",");
        // console.log(that.data.studentId);
        // console.log(that.data.id);
        // console.log(creatVote.length);
        // console.log(voteString);

        var studentId = wx.getStorageSync("userinfo").userId;
        console.log(studentId);
        let infoOpt = {
          url: '/vote/create',
          type: 'POST',
          data: {
            actionId: that.data.id,
            studentId: studentId,
            sum: creatVote.length,
            detail: voteString
          },
          header: {
            'content-type': 'application/json',
            // 'authorization': wx.getStorageSync("authorization"),
          },
        }
        let infoCb = {}
        infoCb.success = function (res) {
          if (res.message == "投票成功") {
            // wx.showToast({
            //   title: wx.getStorageSync("userName") + '投票成功',
            //   icon: 'none',
            //   duration: 1500
            // })
            wx.showModal({
              title: '缘培',
              content: '投票成功',
              showCancel:false,
              success: function (res) {
                if (res.confirm) {
                  var op = { id: that.data.id };
                  // console.log(op);
                  that.onLoad(op);
                } else if (res.cancel) {
                }
              } 
            })
           
          } else {
            var message = res.message;
            wx.showToast({
              title: message,
              icon: 'none',
              duration: 1500
            })
          }
        }
        sendAjax(infoOpt, infoCb, () => {
          // that.onLoad()
          // wx.setStorageSync('G_needUploadIndex', true)
        });
      }
    }
  },
  toVoteDetail: function (e) {
    console.log(e);
    wx.navigateTo({
      url: '../voteDetail/voteDetail?userDetail=' + e.currentTarget.dataset.pepoid ,
    })
  },
  // 点击底部导航-全部参赛
  nav_all: function () {
    this.setData({
      currentNavId: 0
    })
    this.getVoteDetail(); //获取投票详情
  },
  // 点击底部导航-排行榜
  nav_rank: function () {
    this.setData({
      currentNavId: 1
    })
    this.getVoteRank(); //获取投票排行
  },
  // 点击底部导航-排行榜
  nav_rule: function () {
    this.setData({
      currentNavId: 2
    })
  },
  onReady: function () {
    // countdown(this);
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
});
/* 时间倒计时 */
function countdown(that) {
  var seconds = that.data.voteTimeAll;
  // console.log(seconds)
  formatSeconds(that)
  if (seconds <= 0) {
    that.setData({
      voteTimeDay: '00',
      voteTimeHour: '00',
      voteTimeMin: '00',
      voteTimeSec: '00'
    });
    clearTimeout(timeout);
    // console.log(seconds);
    setTimeout(function () {
      that.onLoad();
      // console.log(that.voteBtnClick)
    }, 500)

  } else {
    var timeout = setTimeout(function () {
      that.setData({
        voteTimeAll: seconds - 1
      });
      countdown(that);
    }, 1000)
  }



}
function formatSeconds(that) {
  var days = 0, mins = 0, hours = 0, seconds = that.data.voteTimeAll
  // console.log(seconds)
  if (seconds < 60) {

  } else if (seconds < 3600) {
    mins = parseInt(seconds / 60)
    seconds = seconds % 60
  } else if (seconds < 86400) {
    mins = parseInt(seconds / 60)
    seconds = seconds % 60
    hours = parseInt(mins / 60)
    mins = mins % 60
  } else {
    mins = parseInt(seconds / 60)
    seconds = seconds % 60
    hours = parseInt(mins / 60)
    mins = mins % 60
    days = parseInt(hours / 24)
    hours = hours % 24
  }
  that.setData({
    voteTimeDay: formatTime(days),
    voteTimeHour: formatTime(hours),
    voteTimeMin: formatTime(mins),
    voteTimeSec: formatTime(seconds)
  })

}
function formatTime(num) {
  if (num < 10)
    return '0' + num
  else
    return num + ''
}
// function countdown(that) {
//   that.setData({
//     voteTimeDay: dateformat(time)
//   });
//   if (time <= 0) {
//     that.setData({
//       voteTimeDay: "已经截止"
//     });
//     return;
//   }
//   setTimeout(function () {
//     time  -= 10;
//     countdown(that);
//   }, 10)
// }
// function dateformat(micro_second) {
//   var second = Math.floor(micro_second / 1000);
//   var day = Math.floor(second / 3600 / 24);
//   var hr = Math.floor(second / 3600);
//   var hr2 = hr % 24;
//   var min = Math.floor((second - hr * 3600) / 60);
//   var sec = (second - hr * 3600 - min * 60); 
//   var micro_sec = Math.floor((micro_second % 1000) / 10);
//   return day + ":" + hr2 + ":" + min + ":" + sec ;
// }
