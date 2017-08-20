import request from 'request-promise'
import formstream from 'formstream'
import fs from 'fs'
import path from 'path'
import * as _ from 'lodash'
import { sign } from './util'

const base = 'https://api.weixin.qq.com/cgi-bin/'

const api = {
  accessToken: base + 'token?grant_type=client_credential',
  temporary: {
    upload: base + 'media/upload?',
    fetch: base + 'media/get?'
  },
  permanent: {
    upload: base + 'material/add_material?',
    uploadNews: base + 'material/add_news?',
    uploadNewsPic: base + 'media/uploadimg?',
    fetch: base + 'material/get_material?',
    del: base + 'material/del_material?',
    update: base + 'material/update_news?',
    count: base + 'material/get_materialcount?',
    batch: base + 'material/batchget_material?'
  },
  tag: {
    create: base + 'tags/create?',
    fetch: base + 'tags/get?',
    update: base + 'tags/update?',
    del: base + 'tags/delete?',
    fetchUsers: base + 'user/tag/get?',
    batchTag: base + 'tags/members/batchtagging?',
    batchUnTag: base + 'tags/members/batchuntagging?',
    getTagList: base + 'tags/getidlist?'
  },
  user: {
    remark: base + 'user/info/updateremark?',
    info: base + 'user/info?',
    batchgetInfo: base + 'user/info/batchget?',
    fetchUserList: base + 'user/get?',
    getBlackList: base + 'tags/members/getblacklist?',
    batchBlackList: base + 'tags/members/batchblacklist?',
    batchUnBlackList: base + 'tags/members/batchunblacklist?'
  },
  menu: {
    create: base + 'menu/create?',
    get: base + 'menu/get?',
    del: base + 'menu/delete?',
    addconditional: base + 'menu/addconditional?',
    delconditional: base + 'menu/delconditional?',
    get_current_selfmenu_info: base + 'get_current_selfmenu_info?',
  },
  ticket:{
    get: base + 'ticket/getticket?',
  }
}

function statFile(filepath) {
  return new Promise((resolve, reject) => {
    fs.stat(filepath, (err, stat) => {
      if (err) {
        reject(err)
      } else {
        resolve(stat)
      }
    })
  })
}


export default class Wechat {
  constructor(opts) {
    this.opts = Object.assign({}, opts)
    this.appID = opts.appID
    this.appSecret = opts.appSecret
    this.getAccessToken = opts.getAccessToken
    this.saveAccessToken = opts.saveAccessToken
    this.getTicket = opts.getTicket
    this.saveTicket = opts.saveTicket
    this.fetchAccessToken()
    this.fetchTicket()
  }

  async request(options) {
    options = Object.assign({}, options, {json: true})
    try {
      const response = await request(options)
      return response
    } catch (err) {
      console.error(err)
    }
    return response
  }

  async fetchAccessToken() {
    var data = await this.getAccessToken()
    if (!this.isValidToken(data,'access_token')) {
      data = await this.updateAccessToken()
    }
    await this.saveAccessToken(data)
    return data
  }

  async fetchTicket(token) {
    var data = await this.getTicket()
    if (!this.isValidToken(data,'ticket')) {
      data = await this.updateTicket(token)
    }
    await this.saveTicket(data)
    return data
  }

  async updateAccessToken() {
    const url = api.accessToken + '&appid=' + this.appID + '&secret=' + this.appSecret
    const data = await this.request({url: url})
    const now = (new Date().getTime())
    const expirsIn = now + (data.expires_in - 20) * 1000
    data.expires_in = expirsIn
    return data
  }

  async updateTicket(token) {
    const url = api.ticket.get + 'access_token=' + token +'&type=jsapi'
    const data = await this.request({url: url})
    const now = (new Date().getTime())
    const expirsIn = now + (data.expires_in - 20) * 1000
    data.expires_in = expirsIn
    return data
  }



  isValidToken(data,name) {
    if (!data || !data[name] || !data.expires_in) {
      return false
    }
    const expirsIn = data.expires_in
    const now = (new Date().getTime())

    if (now < expirsIn) {
      return true
    } else {
      return false
    }
  }

  async handle(operation, ...args) {
    const tokenData = await this.fetchAccessToken()
    const options = this[operation](tokenData.access_token, ...args)
    const data = await this.request(options)
    return data
  }

  uploadMaterial(token, type, material, permanent) {
    let form = {}
    let url = api.temporary.upload

    if (permanent) {
      url = api.permanent.upload
      _.extend(form, permanent)
    }
    if (type === 'pic') {
      url = api.permanent.uploadNewsPic
    }
    if (type === 'news') {
      url = api.permanent.uploadNews
      form = material
    } else {
      form.media = fs.createReadStream(material)
    }

    let uploadUrl = url + 'access_token=' + token

    if (!permanent) {
      uploadUrl += '&type=' + type
    } else {
      if (type !== 'news') {
        form.access_token = token
      }
    }

    const options = {
      method: 'POST',
      url: uploadUrl
    }

    if (type === 'news') {
      options.body = form
    } else {
      options.formData = form
    }

    return options
  }

  fetchMaterial(token, mediaId, type, permanent) {
    let form = {}
    let fetchUrl = api.temporary.fetch

    if (permanent) {
      fetchUrl = api.permanent.fetch
    }

    let url = fetchUrl + 'access_token=' + token
    let options = {method: 'POST', url: url}

    if (permanent) {
      form.media_id = mediaId
      form.access_token = token
      options.body = form
    } else {
      if (type === 'video') {
        url = url.replace('https://', 'http://')
      }
      url += '&media_id=' + mediaId
    }
    return options
  }

  deleteMaterial(token, mediaId) {
    const form = {
      media_id: mediaId
    }
    const url = api.permanent.del + 'access_token=' + token + '&media_id' + mediaId
    return {method: 'POST', url: url, body: form}
  }

  updateMaterial(token, mediaId, news) {
    const form = {
      media_id: mediaId
    }
    _.extend(form, news)
    const url = api.permanent.update + 'access_token=' + token + '&media_id' + mediaId
    return {method: 'POST', url: url, body: form}
  }

  //获取素材总数
  countMaterial(token) {
    const url = api.permanent.count + 'access_token=' + token
    return {method: 'POST', url: url}
  }

  //获取永久素材接口
  batchMaterial(token, options) {
    options.type = options.type || 'image'
    options.offset = options.offset || 0
    options.count = options.count || 10
    const url = api.permanent.batch + 'access_token=' + token
    console.log(options);
    return {method: 'POST', url: url, body: options}
  }

  //重建一个标签
  createTag(token, name) {
    const form = {
      tag: {
        name: name
      }
    }
    const url = api.tag.create + 'access_token=' + token

    return {method: 'POST', url: url, body: form}
  }

  //获取公众号已创建的标签
  fetchTag(token) {
    const url = api.tag.fetch + 'access_token=' + token
    return {method: 'GET', url: url}
  }

  //编辑标签
  uploadTag(token, id, name) {
    const form = {
      "tag": {
        "id": id,
        "name": name
      }
    }
    const url = api.tag.update + 'access_token=' + token
    return {method: 'POST', url: url, body: form}
  }

  // 删除标签
  delTag(token, id) {
    const form = {
      "tag": {
        "id": id,
      }
    }
    const url = api.tag.del + 'access_token=' + token
    return {method: 'POST', url: url, body: form}
  }

  //获取标签下粉丝列表
  fetchTagUsers(token, tagid, next_openid) {
    let form = {
      "tagid": tagid,
      "next_openid": next_openid || ''
    }
    const url = api.tag.fetchUsers + 'access_token=' + token
    return {method: 'POST', url: url, body: form}
  }

  //批量为用户打标签
  batchTag(token, openid_list, tagid, unTag) {
    let form = {
      "openid_list": openid_list,
      "tagid": tagid
    }
    let url;
    if (unTag) {
      url = api.tag.batchUnTag + 'access_token=' + token
    } else {
      url = api.tag.batchTag + 'access_token=' + token
    }
    return {method: 'POST', url: url, body: form}
  }

  //获取用户身上的标签列表
  getTagList(token, openid) {
    let form = {
      "openid": openid
    }
    const url = api.tag.getTagList + 'access_token=' + token
    return {method: 'POST', url: url, body: form}
  }

  //设置用户备注名
  remarkUser(token, openid, remark) {
    let form = {
      "openid": openid,
      "remark": remark
    }
    const url = api.user.remark + 'access_token=' + token
    return {method: 'POST', url: url, body: form}
  }

  //获取用户基本信息
  getUserInfo(token, openid, lang) {
    const url = `${api.user.info}access_token=${token}&openid=${openid}&lang=${lang || 'zh_CN'}`
    console.log(url);
    return {method: 'GET', url: url}
  }

  //批量获取用户基本信息
  batchUserInfo(token, user_list) {
    let form = {
      "user_list": user_list
    }
    const url = api.user.batchgetInfo + 'access_token=' + token
    return {method: 'POST', url: url, body: form}
  }

  //获取用户基本信息
  fetchUserList(token, next_openid) {
    const url = `${api.user.fetchUserList}access_token=${token}&next_openid= ${next_openid || ''}`
    return {method: 'GET', url: url}
  }

  //自定义菜单创建接口
  createMenu(token,menu) {
    const url = api.menu.create + 'access_token=' + token
    console.log(url);
    console.log({method: 'POST', url: url, body: menu});
    return {method: 'POST', url: url, body: menu}
  }

  getMenu(token){
    const url = api.menu.get + 'access_token=' + token
    return {method: 'GET', url: url}
  }

  delMenu(token){
    const url = api.menu.del + 'access_token=' + token
    return {method: 'GET', url: url}
  }
  addconditional(token,menu,rule){
    const url = api.menu.addconditional + 'access_token=' + token
    const form = {
      "button":menu,
      "matchrule":rule
    }
    return {method: 'POST', url: url, body: form}
  }

  delconditional(token,menuid){
    const url = api.menu.delconditional + 'access_token=' + token
    const form = {
      "menuid":menuid
    }
    return {method: 'POST', url: url, body: form}
  }
  get_current_selfmenu_info(){
    const url = api.menu.get_current_selfmenu_info + 'access_token=' + token
    return {method: 'GET', url: url}
  }

  sign(ticket,url){
    return sign(ticket,url);
  }
}
