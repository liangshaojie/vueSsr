import Router from "koa-router";
import config from "../config";
import reply from "../wechat/reply";
import { resolve } from "path";
import wechatMiddle from "../wechat-lib/middleware";


export const router = app => {
    const router = new Router();
    router.all("/wechat-head", wechatMiddle(config.wechat, reply));
    router.get("/upload", async (ctx, next) => {
        let mp = require("../wechat");
        let client = mp.getWechat();
        // 上传临时素材
        // const data = await client.handle("uploadMaterial", "video", resolve(__dirname, "../../ice.mp4"));
        //上传永久素材（视频）
        // const data = await client.handle("uploadMaterial", "video", resolve(__dirname, "../../ice.mp4"),{
        //     type:'video',
        //     description:'{"title":"haha", "introduction":"heihei"}'
        // });
        // 上传永久素材（图片）
        // const data = await client.handle("uploadMaterial", "video", resolve(__dirname, "../../ice.jpg"),{
        //     type:'image',
        // });
        // 上传临时素材（图片）
        // const data = await client.handle("uploadMaterial", "video", resolve(__dirname, "../../ice.jpg"));
        // 上传图文
        // const news = {
        //     articles: [
        //         {
        //             "title": 'liangshaojie',
        //             "thumb_media_id": 'i4XscoVjcjt_9IkfC4QyVqXxzyYhAEII0l04g96RQus',
        //             "author": 'lsj',
        //             "digest": '没有再要',
        //             "show_cover_pic": 1,
        //             "content": '没有内容',
        //             "content_source_url": 'www.baidu.com'
        //         },
        //         {
        //             "title": 'liangshaojie2',
        //             "thumb_media_id": 'i4XscoVjcjt_9IkfC4QyVqXxzyYhAEII0l04g96RQus',
        //             "author": 'lsj',
        //             "digest": '没有再要',
        //             "show_cover_pic": 0,
        //             "content": '没有内容',
        //             "content_source_url": 'www.baidu.com'
        //         }
        //     ]
        // }
        // const data = await client.handle('uploadMaterial', 'news', news,{})

        // { media_id: 'i4XscoVjcjt_9IkfC4QyVqXxzyYhAEII0l04g96RQus',
        //     url: 'http://mmbiz.qpic.cn/mmbiz_jpg/pjSjJL7Xtz8OI3eR4lgwr1YymhjSCTX1uPXJ9vJg8ELbHnjpfcTOibBTkBjUHJ5ZcAPHFjPmsMsSDWPzpCOkq1Q/0?wx_fmt=jpeg' }
        // 获取素材
        const data = await client.handle('fetchMaterial', 'i4XscoVjcjt_9IkfC4QyVqXxzyYhAEII0l04g96RQus', 'image',{})
        console.log(data)
    });

    app.use(router.routes()).use(router.allowedMethods());
};