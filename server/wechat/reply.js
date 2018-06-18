const tip = "欢迎来到王者荣耀！";
export default async (ctx, next) => {
    const message = ctx.weixin;

    let mp = require("../wechat");
    let client = mp.getWechat();


    if (message.MsgType === "event") {
        if (message.Event === "subscribe") {
            ctx.body = tip;
        } else if (message.Event === "unsubscribe") {
            console.log("取消关注");
        } else if (message.Event === "LOCATION") {
            ctx.body = message.Latitude + ":" + message.Longitude;
        }
    } else if (message.MsgType === "text") {
        if(message.Content === '1'){
            //测试获取用户列表
            // const data = await client.handle('fetchUserList')

            // 批量获取用户信息
            // let userList =  [
            //     {openid:'oOUx40xSC3thrrX08miMyA-u0pb8',lang:'zh_CN'},
            //     {openid:'oOUx40wx_vkeLw3TiibRUyXNVxZQ',lang:'zh_CN'},
            //     {openid:'oOUx409bCtaJlG9rbVFCzGohAJtY',lang:'zh_CN'}
            // ]
            // const data = await client.handle('batchUserInfo',userList)

            // 单个获取用户信息
            // const data = await client.handle('getUserInfo','oOUx409bCtaJlG9rbVFCzGohAJtY')

            // 获取公众号已创建的标签
            // const data = await client.handle('fetchTag')

            // 重建一个标签
            // const data = await client.handle('createTag','Vuessr')

            // 获取标签下粉丝列表
            // const data = await client.handle('fetchTagUsers',100)

            // 批量为用户打标签
            // const data = await client.handle('batchTag',[
            //     'oOUx409bCtaJlG9rbVFCzGohAJtY'
            // ],100)

            // 获取用户身上的标签列表
            const data = await client.handle('getTagList','oOUx409bCtaJlG9rbVFCzGohAJtY')


            console.log(data)
        }
        ctx.body = message.Content;
    } else if (message.MsgType === "image") {
        ctx.body = {
            type: "image",
            mediaId: message.MediaId
        };
    } else if (message.MsgType === "voice") {
        ctx.body = {
            type: "voice",
            mediaId: message.MediaId
        };
    } else if (message.MsgType === "video") {
        ctx.body = {
            title: message.ThumbMediaId,
            type: "video",
            mediaId: message.MediaId
        };
    } else if (message.MsgType === "location") {
        ctx.body = message.Location_X + ":" + message.Location_Y + ":" + message.Label;
    } else if (message.MsgType === "link") {
        ctx.body = [{
            title: message.Title,
            description: message.Description,
            picUrl: "https://gss3.bdstatic.com/7Po3dSag_xI4khGkpoWK1HF6hhy/baike/whfpf%3D268%2C152%2C50/sign=b8ff5d56164c510fae91b15a0664171b/42a98226cffc1e17b5390faf4690f603728de9ae.jpg",
            url: message.Url
        }];
    }

}