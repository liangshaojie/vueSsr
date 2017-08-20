import Router from 'koa-router'
import config from '../config'
import reply from '../wechat/reply'
import {resolve} from 'path'
import wechatMiddle from '../wechat-lib/middleware'
import {signature} from "../controller/wechat"

export const router = app => {

  const router = new Router()
  router.all('/wechat-head', wechatMiddle(config.wechat, reply))
  router.all('/wechat-signature', signature)
  app
      .use(router.routes())
      .use(router.allowedMethods())
}
