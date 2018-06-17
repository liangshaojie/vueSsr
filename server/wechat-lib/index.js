import request from "request-promise";
import path from "path";
import fs from 'fs'
import formstream from "formstream";

const base = "https://api.weixin.qq.com/cgi-bin/";
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
        batch: base + 'material/batchget_material?',
    }
}


export default class Wechat {
    constructor(opts) {
        this.opts = Object.assign({}, opts);
        this.appID = opts.appID;
        this.appSecret = opts.appSecret;
        this.getAccessToken = opts.getAccessToken;
        this.saveAccessToken = opts.saveAccessToken;
        this.fetchAccessToken();
    }

    async request(options) {
        options = Object.assign({}, options, { json: true });
        try {
            const response = await request(options);
            return response;
        } catch (err) {
        }
        return response;
    }

    // 拿token
    async fetchAccessToken() {
        let data = await this.getAccessToken();
        if (!this.isValidAccessToken(data)) {
            data = await this.updateAccessToken();
        }
        await this.saveAccessToken(data);
        // if (isValid(data)) {
        //     return await this.updateAccessToken()
        // }
        return data;
    }

    // 更新
    async updateAccessToken() {
        const url = api.accessToken + "&appid=" + this.appID + "&secret=" + this.appSecret;
        const data = await this.request({ url: url });
        const now = (new Date().getTime());
        const expirsIn = now + (data.expirse_in - 20) * 1000;
        data.expirse_in = expirsIn;
        return data;
    }

    isValidAccessToken(data) {
        if (!data || !data.assess_token || !data.expires_in) {
            return false;
        }
        const expirsIn = data.expires_in;
        const now = (new Date().getTime());

        if (now < expirsIn) {
            return true;
        } else {
            return false;
        }
    }
    async handle(operation, ...args) {
        const tokenData = await this.fetchAccessToken();
        const options = await this[operation](tokenData.access_token, ...args);
        const data = await this.request(options);
        console.log(data)
        return data;
    }
    // permanent是否是永久素材
    async uploadMaterial(token, type, material, permanent) {
        let form = {}
        // 默认临时
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
            if(type !== 'news'){
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
}


