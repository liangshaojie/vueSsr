const tip = "欢迎来到王者荣耀！"
export default async (ctx, next) => {
    const message = ctx.weixin
    console.log(message);
    if(message.MsgType === 'event'){
        if(message.Event === 'subscribe'){
            ctx.body = tip
        }else if(message.Event === 'unsubscribe'){
            console.log('取消关注');
        }else if(message.Event === 'LOCATION'){
            ctx.body = message.Latitude + ':' + message.Longitude
        }
    } else if (message.MsgType === 'text') {
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
    } else if (message.MsgType === 'video') {
        ctx.body = {
            title: message.ThumbMediaId,
            type: 'video',
            mediaId: message.MediaId
        }
    } else if (message.MsgType === 'location') {
        ctx.body = message.Location_X + ':'+message.Location_Y +':'+ message.Label
    }else if (message.MsgType === 'link') {
        ctx.body = [{
            title:message.Title,
            description:message.Description,
            picUrl:'https://gss3.bdstatic.com/7Po3dSag_xI4khGkpoWK1HF6hhy/baike/whfpf%3D268%2C152%2C50/sign=b8ff5d56164c510fae91b15a0664171b/42a98226cffc1e17b5390faf4690f603728de9ae.jpg',
            url:message.Url
        }]
    }

}