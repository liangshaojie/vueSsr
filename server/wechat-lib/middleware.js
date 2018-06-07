import config from "../config";
import sha1 from 'sha1'
import getRawBody from 'raw-body'
import * as util from './util'

export default function(opts, reply) {
    return async function wechatMiddle(ctx, next) {
        require('../wechat/index.js')
        const token = opts.token;
        let { signature, nonce, timestamp, echostr } = ctx.query;
        const str = [token, timestamp, nonce].sort().join("");
        const sha = sha1(str);
        if (ctx.method === "GET") {
            if (sha === signature) {
                ctx.body = echostr;
            } else {
                ctx.body = "fail";
            }
        } else if (ctx.method === "POST") {
            if(sha !== signature){
                ctx.body = 'Failed'
                return false
            }
            const data = await getRawBody(ctx.req,{
                length:ctx.length,
                limit:'lmb',
                encoding:ctx.charset
            })
            const content = await util.parseXML(data)
            console.log(content)
            // const message = await util.formatMessage(content.xml)
            // ctx.weixin = message
            ctx.weixin = {}

            await reply.apply(ctx,[ctx,next])
            const replyBody = ctx.body
            const msg = ctx.weixin

            console.log(replyBody)
            // const xml = util.tpl(replyBody,msg)
            ctx.status = 200
            const xml =
            `
                <xml>  
                    <ToUserName><![CDATA[${content.xml.FromUserName[0]}]]></ToUserName>  
                    <FromUserName><![CDATA[${content.xml.ToUserName[0]}]]></FromUserName> 
                    <CreateTime>1348831860</CreateTime> 
                    <MsgType><![CDATA[text]]></MsgType>  
                    <Content><![CDATA[${replyBody}]]></Content>
                </xml>
            `
            ctx.type = 'application/xml'
            ctx.body = xml
        }
    };
}



