var app = getApp();

Page({
    data: {
    },
    onLoad: function(t) {
       console.log(t)
       this.setData({
         luckdataPic:t.luckdataPic,
         value1: t.value1,
         value2: t.value2
       })
        
    },
    goTicketmy: function() {
        wx.redirectTo({
            url: "../ticketmy/ticketmy"
        });
    }
});