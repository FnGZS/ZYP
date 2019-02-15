var url = require('../config.js')
const sendAjax = require('sendAjax.js')

function templeMsg(userId,template_id, page, data){
  console.log(template_id)
  console.log(page)
  console.log(data)
  var that = this;

  let infoOpt = {
    url: '/user/message',
    type: 'POST',
    data: {
      userId: userId,
      template_id: template_id,
      page:page,
      data: JSON.stringify(data) ,
      emphasis_keyword: 'keyword1.DATA'
    },
    header: {
      'content-type': 'application/json',
    },
  }
  let infoCb = {}
  infoCb.success = function (res) {
    console.log(res);
  }
  infoCb.beforeSend = () => { }
  sendAjax(infoOpt, infoCb, () => { });
}

module.exports = {
  templeMsg: templeMsg,
}