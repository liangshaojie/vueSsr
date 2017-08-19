import Router from 'koa-router'
import config from '../config'
import reply from '../wechat/reply'
import {resolve} from 'path'
import wechatMiddle from '../wechat-lib/middleware'

export const router = app => {

  const router = new Router()
  router.all('/wechat-head', wechatMiddle(config.wechat, reply))

  router.get('/upload', async (ctx, next) => {
    let mp = require('../wechat')
    let client = mp.getWechat()
    const news = {
      articles: [
        {
          "title": 'liangshaojie',
          "thumb_media_id": 'ZzeX_o_tscUxQ2nL8x55rIyVgLVFRPWZhdSc6znZqEc',
          "author": 'lsj',
          "digest": '没有再要',
          "show_cover_pic": 1,
          "content": '没有内容',
          "content_source_url": 'www.baidu.com'
        },
        {
          "title": 'liangshaojie2',
          "thumb_media_id": 'ZzeX_o_tscUxQ2nL8x55rIyVgLVFRPWZhdSc6znZqEc',
          "author": 'lsj',
          "digest": '没有再要',
          "show_cover_pic": 0,
          "content": '没有内容',
          "content_source_url": 'www.baidu.com'
        }
      ]
    }
    const data = await client.handle('uploadMaterial', 'news', news,{})
    console.log(data);
  })

  app
      .use(router.routes())
      .use(router.allowedMethods())
}
