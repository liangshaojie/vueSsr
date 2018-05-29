import Router from 'koa-router'
import config from '../config'
import sha1 from 'sha1'

export const router = app => {
    const router = new Router()
    router.get('/wechat-head', (ctx, next) => {
        const token = config.wechat.token
        let {signature, nonce, timestamp, echostr} = ctx.query
        const str = [token, timestamp, nonce].sort().join('')
        const sha = sha1(str)
        if (sha === signature) {
            ctx.body = echostr
        } else {
            ctx.body = 'fail'
        }
    })
    // router.post('/wechat-head', (ctx,next) => {
    //
    // })
    app.use(router.routes())
    app.use(router.allowedMethods())
}