const tip = '我的卡里新，欢迎来到这里\n'

export default async (ctx, next) => {
  const message = ctx.weixin
  let mp = require('../wechat')
  let client = mp.getWechat()
  console.log(message);
  if (message.MsgType === 'event') {
    if (message.Event === 'subscribe') {
      ctx.body = tip
    } else if (message.Event === 'unsubscribe') {
      console.log('取消关注');
    } else if (message.Event === 'LOCATION') {
      ctx.body = message.Latitude + ':' + message.Longitude
    } else if (message.Event === 'VIEW') {
      ctx.body = message.EventKey + message.MenuId
    } else if (message.Event === 'pic_sysphoto') {
      ctx.body = message.Count +'photos sent'
    }
  } else if (message.MsgType === 'text') {
    if (message.Content === '1') {
      const data = await client.handle('getTagList', 'orryJwEYFPTne7drHJScOgFoTNJ0')
      console.log(data);
    } else if (message.Content === '2') {
      const menu = require('./menu.js').default
      console.log(menu);
      const del = await client.handle('delMenu')
      const data = await client.handle('createMenu', menu)
      console.log(data);
    }
    ctx.body = message.Content
  } else if (message.MsgType === 'image') {
    ctx.body = {
      type: 'image',
      mediaId: message.MediaId
    }
  } else if (message.MsgType === 'voice') {

    ctx.body = {
      type: 'voice',
      mediaId: message.MediaId
    }
  } else if (message.MsgType === 'voice') {
    ctx.body = {
      title: message.ThumbMediaId,
      type: 'voice',
      mediaId: message.MediaId
    }
  } else if (message.MsgType === 'location') {
    ctx.body = message.Location_X + ':' + message.Location_Y + ':' + message.Label
  } else if (message.MsgType === 'link') {
    ctx.body = [{
      title: message.Title,
      description: message.Description,
      picUrl: 'http://mmbiz.qpic.cn/mmbiz_jpg/CMhZY0OLZSibGPIHxM0x0g3EqmWiaoZic1Iuy2w2oTv4pPHiagwRaLia3gP2x6QUO4CYzlrF1D2CI1vJtKCsWK7CN0Q/0',
      url: message.Url
    }]
  }

}