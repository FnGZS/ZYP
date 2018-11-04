const url = require('../../../config.js')
Page({
  data: {
    URL: url.host,
    id: null,  //活动ID
    studentId: 1,  //用户ID
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
phoneHeight:''
  },
  getPhoneInfo: function () {
    this.setData({
      phoneHeight: 750 / wx.getSystemInfoSync().windowWidth * wx.getSystemInfoSync().windowHeight
    })
  },
  onLoad: function (options) {
    this.getPhoneInfo();
    var that = this;
    
    console.log(options)
    this.setData({
      id: options.id
      // id:1
    })
    this.getVoteDetail(); //获取投票详情
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
    wx.request({
      url: this.data.URL + `/vote/getAction/detail/${this.data.id}`,
      data: {},
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        var voteDetail = res.data;
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
          voteTimeAll: diffTime
        })
        console.log(voteDetail.status)
        if (voteDetail.status != 2) {
          countdown(that);
        }

        that.initChoose(); //初始化选中
        that.checkStatus(); //检测当前活动状态
      }
    })

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
    console.log(voteStatus)
    var that = this;
    wx.request({
      method: 'POST',
      url: this.data.URL + '/vote/check',
      data: {
        actionId: that.data.id,
        studentId: that.data.studentId
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log(res)
        if (res.data.status == 0) {
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
          console.log(res.data.detail);
          var detail = res.data.detail;
          var isVote = detail.split(',');
          var user_choose = that.data.user_choose;
          for (var i = 0; i < isVote.length; i++) {
            user_choose[isVote[i] - 1] = true;
          }
          console.log(user_choose);
          that.setData({
            voteBtnColor: 'grey',
            voteBtnText: '已投票',
            user_choose: user_choose,
            voteBtnClick: 0,
            lodingHidden: 'hidden'
          })
        }

      }
    })
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
        wx.request({
          url: this.data.URL + '/vote/search',
          method: 'POST',
          data: {
            actionId: that.data.id,
            peopleName: search_content
          },
          header: {
            'content-type': 'application/json'
          },
          success(res) {
            var userList = res.data.voteDetailList;
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
        })
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
    wx.request({
      url: this.data.URL + `/vote/getAction/detail/rank/${this.data.id}`,
      data: {},
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        that.setData({
          userRank: res.data.voteDetailList
        })
      }
    })
  },
  //初始化选中状态
  initChoose: function () {
    var userList = this.data.userList;
    var user_choose = [];
    var userHidden = [];
    for (var i = 0; i < userList.length; i++) {
      user_choose.push(false);
      userHidden.push('');
    }
    this.setData({
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
  // 投票
  voteBtn: function () {
    var that = this;
    var user_choose = this.data.user_choose;
    var userList = this.data.userList;
    var creatVote = [];
    for (var i = 0; i < userList.length; i++) {
      if (user_choose[i] == true) {
        creatVote.push(userList[i].serialId);
      }
    }
    console.log(creatVote);
    if (creatVote.length == 0) {
      wx.showToast({
        title: '您还未勾选任何人',
        icon: 'none',
        duration: 1500
      })
    } else {
      
      var voteString = creatVote.join(",");
      console.log(voteString);
      wx.request({
        method: 'POST',
        url: this.data.URL + '/vote/create',
        data: {
          actionId: that.data.id,
          studentId: that.data.studentId,
          sum: creatVote.length,
          detail: voteString
        },
        header: {
          'content-type': 'application/json'
        },
        success(res) {
          console.log(res)
          if (res.data.message == "投票成功") {
            wx.showToast({
              title: '投票成功',
              icon: 'none',
              duration: 1500
            })
            that.onLoad(that.data.id);
          } else {
            var message = res.data.message;
            wx.showToast({
              title: message,
              icon: 'none',
              duration: 1500
            })
          }
        }
      })
    }

  },
  toVoteDetail:function(e){
    console.log(123123123);
    var id = e.currentTarget.dataset.id;
    var userDetail = this.data.userList[id - 1];
    console.log(userDetail)
    wx.navigateTo({
      url: '../voteDetail/voteDetail?userDetail=' + JSON.stringify(userDetail),
    })
  },
  // 点击底部导航-全部参赛
  nav_all: function () {
    // this.getVoteDetail(); //获取投票详情
    this.setData({
      currentNavId: 0
    })
  },
  // 点击底部导航-排行榜
  nav_rank: function () {
    this.setData({
      currentNavId: 1
    })
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
    console.log(seconds);
    setTimeout(function () {
      that.onLoad();
      console.log(that.voteBtnClick)
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
