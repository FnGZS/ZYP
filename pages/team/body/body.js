import Toast from '../../../dist/toast/toast';
let url='https://www.sxscott.com/association/'
Page({

  /**
   * 页面的初始数据
   */
  data: {
     name:'',
     sclass:'',
     phone:'',
     team:'',
     sqq:'',
     code:[]
  },

  /**
   * 表单提交报名表
   */
  signUp:function(e){
    let that=this
    let cname = e.detail.value.name
    let csclass = e.detail.value.sclass
    let cphone=e.detail.value.phone
    let cteam = e.detail.value.team
    let cqq= e.detail.value.sqq 
    let cc=that.data.code
    if (cname== '' ||  csclass== '' ||  cphone== "" ||  cteam== "" || cqq== ""){
      Toast('请把报名信息填写完整后再提交');
    }else{
       wx.request({
         url: url+'wx/setTeam',
         method:"POST",
         data:{
           name:cname,
           sClass:csclass,
           team:cteam,
           phone:cphone,
           sQq:cqq
         },
         success(res){
           console.log(res.data)
           if(res.data.code=='200'){
             cc.push(cteam)
            wx.setStorageSync('code',cc)
            

             wx.showToast({

                title: '报名成功',

                icon: 'success',

                duration: 2000,

                success: function () {

                  setTimeout(function () {

                    wx.reLaunch({

                      url: '/pages/team/team/team',

                    })

                  }, 2000);

                }

             })
           
             
           }else{
             Toast('已报名或者报名失败');
           }
         }
       })
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let cc = wx.getStorageSync('code')
    
    if(cc!=''){
    this.setData({
      team:options.name,
      code:cc
    })
  }else{
      this.setData({
        team: options.name
      })
  }
    
    wx.setStorage({
      key: "code",
      data: []
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.data.team = '123'
    console.log(this.data.team)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
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