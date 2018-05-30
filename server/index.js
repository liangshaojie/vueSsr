import Koa from 'koa'
import {Nuxt, Builder} from 'nuxt'
import R from 'ramda'
import {resolve} from 'path'

const r = path => resolve(__dirname, path)
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3006
// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env === 'production')
const MIDDLEWARES = ['database','router']

class Server {
    constructor() {
        this.app = new Koa()
        this.useMiddleWare(this.app)(MIDDLEWARES);
    }

    //加载所有的中间件   这个方法从右往左依次执行
    useMiddleWare(app) {
        return R.map(R.compose(
            R.map(i => i(app)),
            require,
            i => `${r('./middlewares')}/${i}`)
        )
    }

    //开启服务的方法
    async start() {
        const nuxt = new Nuxt(config)
        if (config.dev) {
            const builder = new Builder(nuxt)
            builder.build().catch(e => {
                process.exit(1)
            })
        }
        this.app.use(ctx => {
            ctx.status = 200
            return new Promise((resolve, reject) => {
                ctx.res.on('close', resolve)
                ctx.res.on('finish', resolve)
                nuxt.render(ctx.req, ctx.res, promise => {
                    promise.then(resolve).catch(reject)
                })
            })
        })
        this.app.listen(port, host)
        console.log('Server listening on ' + host + ':' + port) // eslint-disable-line no-console
    }
}

const app = new Server();

app.start();







