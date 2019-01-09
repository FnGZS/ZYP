const url = require('../../../config.js')
const sendAjax = require('../../../utils/sendAjax.js')
const util = require('../../../utils/util.js')
const promise = require('../../../utils/promise.js')
var weekday = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
  minutes = ["00", "30"],
  hours = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"],
  myDate = new Date(),
  hh = myDate.getHours();

++hh;
function GetUserEntity(sendUrl, sendData) {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url.host + sendUrl,
      method: "GET",
      data: sendData,
      header: {
        'content-type': 'application/json',
        'authorization': wx.getStorageSync('authorization')
      },
      success: (res) => {
        if (res.data.code == 200) {


        let result = res.data.items[0].id
        resolve(result);
        console.log(result)
          getApp().data.luckDrawId = result

        }
      },
      fail: () => {
        reject("系统异常，请重试！")
      }
    })
  })

}
function GetUserPOST(sendUrl, sendData) {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url.host + sendUrl,
      method: "POST",
      data: sendData,
      header: {
        'content-type': 'application/json',
        'authorization': wx.getStorageSync('authorization')
      },
      success: (res) => {
        if (res.data.code == 200) {
          console.log(res)

        }
      },
      fail: () => {
        reject("系统异常，请重试！")
      }
    })
  })

}
//时间选择
for (var dateTemp, time1, dateArrays = [], time = [], c = [], flag = 1, i = 0; i < 7; i++) {
  var m = "",
    d = "";
  dateTemp = (m = myDate.getMonth() + 1 < 10 ? "0" + (myDate.getMonth() + 1) : myDate.getMonth() + 1) + "月" + (d = myDate.getDate() < 10 ? "0" + myDate.getDate() : myDate.getDate()) + "日 " + weekday[myDate.getDay()],
    dateArrays.push(dateTemp), time1 = m + "-" + d, time.push(time1), myDate.setDate(myDate.getDate() + flag);
}


Page({
  data: {
    gaoji: false, //隐藏高级
    albumSrc: [], //上传介绍图片包
    luckExplain: "", //抽奖说明
    luckPrizeExplain: "", //抽奖介绍
    current: 0,
    valueKey1:false,
    valueKey2:false,
    valueKeyShow1: [],
    valueKeyShow2: [],
    awardtype: 1,
    showtime: !1,
    showpaly: !1,
    index: 0,
    addticketArr: [1], //添加奖项数组
    palylist: ["按时间自动开奖", "手动开奖"],
    dateArrays: dateArrays,
    time: time,
    time1: time[0],
    dateArray: dateArrays[0],
    hours: hours,
    hour: hours[0],
    dayy: 0,
    nowhour: hh,
    minutes: minutes,
    minute: minutes[0],
    inputValue1: [], //请输入奖品名称
    inputValue1show: !1,
    inputValue2: [], //请输入奖品数量
    inputValue2show: !1,
    inputValue3: 0,
    inputValue3show: !1,
    inputValue4: 0,
    inputValue4show: !1,
    inputValue5: 0,
    inputValue5show: !1,
    inputValue6show: !1,
    imgSrc: "",
    gName: "",
    pic: "",
    prizeList: []
  },
  onLoad: function(a) {
    console.log(a)
    var t = this,
      e = a.avatar;
    if (e) {
      var u = url.uploadFile;
      wx.uploadFile({
        url: u,
        filePath: e,
        name: "file",
        formData: {
          picType: 'luckPic'
        },
        header: {
          'content-type': 'application/json',
          'authorization': 'ciRW3cOmi1JYY8niXxG7xxx3+b5no4/N5k3gZFChkEzIR+Cbv2rpqh2M8q7RuwTx'
        },
        success: function(a) {
          var a = JSON.parse(a.data);
          console.log(a), t.setData({
            pic: a.urlList[0]
          });
        }
      }), this.setData({
        imgSrc: e
      });
    }
    console.log(wx.getStorageSync('userId'))
    this.setData({
      userInfo: wx.getStorageSync('userId')
    })
  },
  //上传图片
  picture: function() {
    var n = this,
      o = n.data.albumSrc;

    wx.chooseImage({
      count: 9,
      sizeType: ["compressed"],
      sourceType: ["album"],
      success: function(a) {
        console.log(a)
        var t = a.tempFilePaths;
        if (1 == t) o.length < 9 ? o = o.concat(a.tempFilePaths[0]) : wx.showToast({
          title: "最多上传9张图片",
          icon: "none",
          duration: 2e3
        });
        else
          for (var e = 0; e < t.length; e++) o.length < 9 ? o = o.concat(a.tempFilePaths[e]) : wx.showToast({
            title: "最多上传9张图片",
            icon: "none",
            duration: 2e3
          });
        for (let i in o) {
          var u = url.uploadFile;
          if (o[i]) {
            wx.uploadFile({
              url: u,
              filePath: o[i],
              name: "file",
              formData: {
                picType: 'luckPic'
              },
              header: {
                'content-type': 'application/json',
                'authorization': 'ciRW3cOmi1JYY8niXxG7xxx3+b5no4/N5k3gZFChkEzIR+Cbv2rpqh2M8q7RuwTx'
              },
              success: function(a) {
                var a = JSON.parse(a.data);
                console.log(a)
                o[i] = a.urlList[0]
                n.setData({
                  albumSrc: o
                }), console.log(o);
              }
            })
          }

        }






      }
    })
  },
  //显示要上传的图片
  previewImage: function(a) {
    var t = a.currentTarget.dataset.index,
      e = this.data.albumSrc;
    wx.previewImage({
      current: e[t],
      urls: e
    });
  },
  //移除图片
  closeitem: function(a) {
    var t = this,
      e = a.currentTarget.dataset.index,
      n = t.data.albumSrc;
    wx.showModal({
      title: "提示",
      content: "确定删除吗？",
      success: function(a) {
        a.confirm && (n.splice(e, 1), t.setData({
          albumSrc: n
        }));
      }
    });
  },
  //添加奖项
  addTicket() {
    var that = this
    var addticketArr = that.data.addticketArr
    var inputValue2 = that.data.inputValue2
    var inputValue1 = that.data.inputValue1
    var valueKeyShow1 = that.data.valueKeyShow1
    var valueKeyShow2 = that.data.valueKeyShow2
    if (inputValue1.length==0){
      inputValue1.push("")
      inputValue1.push("")
    }else{
      inputValue1.push("")
    }
    if (inputValue2.length == 0) {
      inputValue2.push(false)
      inputValue2.push(false)
    } else {
      inputValue2.push(false)
    }
    if (valueKeyShow2.length != 0) {
      valueKeyShow2.push(false)
    }
    if (valueKeyShow1.length != 0) {
      valueKeyShow1.push(false)
    }
    var addticketArr = that.data.addticketArr
    var addNum = 1 //第一次循环数
    addticketArr.push(addNum++) //添加
    // console.log(addticketArr)
    that.setData({
      addticketArr,
      inputValue2,
      inputValue1,
      valueKeyShow1,
      valueKeyShow2
    })
  },
  //删除奖项
  removeTicket() {
    var that = this
    var addticketArr = that.data.addticketArr
    var inputValue2 = that.data.inputValue2
    var inputValue1 = that.data.inputValue1
    var valueKeyShow1 = that.data.valueKeyShow1
    var valueKeyShow2 = that.data.valueKeyShow2
    addticketArr.pop() //删除
    if (valueKeyShow1.length != 0){
      valueKeyShow1.pop()
    }
    if (valueKeyShow2.length != 0) {
      valueKeyShow2.pop()
    }
    inputValue1.pop()
    inputValue2.pop()
    
    
    that.setData({
      addticketArr,
      inputValue2,
      inputValue1,
      valueKeyShow2,
      valueKeyShow1
    })
  },
  //设置封面
  upload: function() {
    wx.chooseImage({
      count: 1,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success: function(a) {
        var t = a.tempFilePaths[0];
        wx.redirectTo({
          url: "../upload/upload?src=" + t
        });
      }
    });
  },
  //时间选择
  bindChange: function(a) {
    var t = this,
      e = a.detail.value,
      u = a.detail.value[1],
      i = t.data.inputValue6show;
    console.log(t.data.nowhour), i = u < t.data.nowhour && 0 == a.detail.value[0], this.setData({
      dateArray: this.data.dateArrays[e[0]],
      time1: this.data.time[e[0]],
      choosehour: u,
      hour: this.data.hours[e[1]],
      minute: this.data.minutes[e[2]],
      inputValue6show: i,
      dayy: e[0]
    });
  },
  //回到首页
  gohome: function() {
    wx.reLaunch({
      url: "../ticketmian/ticketmian"
    });
  },
  //说明
  luckExplain(e) {
    this.setData({
      luckExplain: e.detail.value
    })


  },
  //介绍
  luckPrizeExplain(e) {
    this.setData({
      luckPrizeExplain: e.detail.value
    })
  },
  //发起抽奖
  goTicketdetail: function(a) {
    var that = this
    console.log(that.data.inputValue1, that.data.inputValue2)
    var value1 = that.data.inputValue1
    var value2 = that.data.inputValue2
    var time = util.formatTime(new Date());
    var year = time.substring(0, 4)
    var albumSrc = that.data.albumSrc
    var luckSrc = ""
    for (let i in albumSrc) {
      luckSrc = luckSrc + "<img src='" + albumSrc[i] + "'>" + "</img>"
    }
    var luckMode = that.data.index + 1
    var luckExplain = that.data.luckExplain
    var luckPrizeExplain = that.data.luckPrizeExplain + luckSrc
    var luckdataPic = that.data.pic
    var lotteryTime = year + "-" + that.data.time1 + " " + that.data.hour + ":" + that.data.minute
    var valueKeyShow1 = that.data.valueKeyShow1
    var valueKeyShow2 = that.data.valueKeyShow2
    if(value1.length==0){
      valueKeyShow1[0] = true
      that.setData({
        valueKeyShow1
      })
    }else{
      for (let i in value1) {
        if (value1[i] == "") {
          valueKeyShow1[i] = true
        } else {
          valueKeyShow2[i] = false

        }
      }
    }
    if (value2.length == 0) {
      valueKeyShow2[0] = true

      that.setData({
        valueKeyShow2
      })
    } else {
      that.setData({
        valueKey2: false
      })
    for (let i in value2) {
      if (!value2[i]) {
        valueKeyShow2[i] = true
      } else {
        valueKeyShow2[i] = false

      }
    }
    }
    that.setData({
      valueKeyShow1,
      valueKeyShow2
    })

    if (valueKeyShow1.indexOf(true) == -1 && valueKeyShow2.indexOf(true) == -1 && value1.length != 0 && value2.length != 0) {
      if (luckdataPic == "") {
        wx.showToast({
          title: '请添加奖品图片',
          icon: "none",
          duration: 2000,
          mask: true

        })
      } else {
        let infoOpt = {
          url: '/luck/addLuck',
          type: 'POST',
          data: {
            userId: wx.getStorageSync("userId"),
            luckName: "",
            luckPic: luckdataPic,
            luckExplain,
            lotteryTime,
            luckPrizeExplain,
            luckMode
          },
          header: {
            'content-type': 'application/json',
          },
        }
        let infoCb = {}
        infoCb.success = function(res) {
          console.log(res)
          GetUserEntity("/luck/delease", { userId: wx.getStorageSync("userId"), pageNo: 1, pageSize: 1 }).then((res) => {
            for(let j in value2){
              GetUserPOST("/luck/addPrize", { luckDrawId: getApp().data.luckDrawId, luckPrize: value1[j], num: value2[j], luckPic: "", sponsor: "" })
            }
            if (albumSrc.length != 0) {
              wx.showToast({
                title: '图片正在上传中...',
                icon: 'loading',
                duration: 2000
              })
              var timer = setTimeout(function () {
                wx.reLaunch({
                  url: "../ticketdetail/ticketdetail?luckdataPic=" + luckdataPic + "&&value1=" + value1[0] + "&&value2=" + value2[0]
                });
              }, 2000);
             
            }else{
              wx.showToast({
                title: '正在提交...',
                icon: 'loading',
                duration: 1000
              })
              var timer = setTimeout(function () {
                wx.reLaunch({
                  url: "../ticketdetail/ticketdetail?luckdataPic=" + luckdataPic + "&&value1=" + value1[0] + "&&value2=" + value2[0]
                });
              }, 1000);
            }
            

             }).catch((res) => { console.log(res) })
        }
        infoCb.beforeSend = () => {}
        sendAjax(infoOpt, infoCb, () => {});
        

      }
    }




    
  },
  goTicketmy: function(a) {
    wx.navigateTo({
      url: "../ticketmy/ticketmy"
    });
  },
  choosetime: function(a) {
    var t = this.data.showtime;
    t = !t, this.setData({
      showtime: t
    });
  },
  chooselotterytime: function() {
    this.data.showpaly;
    this.setData({
      showpaly: !0
    });
  },
  closeplay: function(a) {
    this.data.showpaly;
    var t = a.currentTarget.dataset.index;
    this.setData({
      showpaly: !1,
      index: t
    });
  },

  //请输入奖品名称
  bindKeyInput1: function(a) {
    if (this.data.imgSrc==""){
      wx.showToast({
        title: '请先添加奖品图片',
        icon: "none",
        duration: 2000,
        mask: true

      })
    }else{
      console.log(a)
      var index = a.currentTarget.dataset.index
      var value = a.detail.value
      var valueKeyShow1 = this.data.valueKeyShow1
      // console.log(index)
      var inputValue1 = this.data.inputValue1
      inputValue1[index] = value
      if (value==""){
        valueKeyShow1[index]=true
        this.setData({
          valueKeyShow1
        });
      }else{
        valueKeyShow1[index] = false
        this.setData({
          inputValue1,
          valueKeyShow1
        });
      }
      
      
    }
   
    
  },
  //请输入奖品数量
  bindKeyInput2: function(a) {
    if (this.data.imgSrc == "") {
      wx.showToast({
        title: '请先添加奖品图片',
        icon: "none",
        duration: 2000,
        mask: true

      })
    } else {
      var index = a.currentTarget.dataset.index
      var value = parseInt(a.detail.value)

      var inputValue2 = this.data.inputValue2
      inputValue2[index] = value
      var valueKeyShow2 = this.data.valueKeyShow2
      console.log(value)
      if (!value) {
        valueKeyShow2[index] = true
        this.setData({
          valueKeyShow2
        });
      } else {
        valueKeyShow2[index] = false
        this.setData({
          inputValue2,
          valueKeyShow2
        });
      }
    }
    
  },
  bindKeyInput3: function(a) {
    var t = this.data.inputValue3show;
    t = 0 == a.detail.value || 200 < a.detail.value, this.setData({
      inputValue3: a.detail.value,
      inputValue3show: t
    });
  },
  bindKeyInput4: function(a) {
    var t = this.data.inputValue4show;
    t = 0 == a.detail.value || 100 < a.detail.value, this.setData({
      inputValue4: a.detail.value,
      inputValue4show: t
    });
  },
  bindKeyInput5: function(a) {
    var t = this.data.inputValue5show;
    t = 0 == a.detail.value.length, this.setData({
      inputValue5: a.detail.value.length,
      inputValue5show: t,
      accurate: a.detail.value
    });
  },
  changeSwitch1(e) {
    this.setData({
      gaoji: e.detail.value
    })
  }
});