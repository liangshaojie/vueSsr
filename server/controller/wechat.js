import * as api from './../api'
import {parse as urlParse} from 'url'
import {parse as queryParse} from 'querystring'
import config from '../config'

export async function signature(ctx, next) {
  let url = ctx.query.url
  url = decodeURIComponent(url)
  if (!url) {
    ctx.throw(404)
  }
  const params = await api.getSignaureAsync(url)
  ctx.body = {
    success: true,
    params: params
  }
}

export async function redirect(ctx, next) {
  console.log(888);
  const target = config.SITE_ROOT_URL + '/oauth'
  const scope = 'snsapi_userinfo'
  const {a, b} = ctx.query
  const params = `${a}_${b}`
  const url = api.getAutoorizeURL(scope, target, params)
  ctx.redirect(url)
}

export async function oauth(ctx, next) {
  let url = ctx.query.url
  url = decodeURIComponent(url)
  const urlObj = urlParse(url)
  const params = queryParse(urlObj)

  const code = params.code
  const user = await api.getUserByCode(code)

  console.log(user);

  ctx.body = {
    success:true,
    data:user
  }


}