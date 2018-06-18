import axios from "axios";

const baseUrl = "";

class Services {
    getWechatSignature(url) {
        return axios.get(`${baseUrl}/wechat-signature?url=${encodeURIComponent(url)}`);
    }
    getUserByOAuth(url) {
        return axios.get(`${baseUrl}/wechat-oauth?url=${encodeURIComponent(url)}`);
    }

}

export default new Services();