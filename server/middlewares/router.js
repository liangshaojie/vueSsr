import Router from "koa-router";
import config from "../config";
import reply from "../wechat/reply";
import { resolve } from "path";
import wechatMiddle from "../wechat-lib/middleware";


export const router = app => {
    const router = new Router();
    router.all("/wechat-head", wechatMiddle(config.wechat, reply));
    router.get("/upload", (ctx, next) => {
        let mp = require("../wechat");
        let client = mp.getWechat();
        client.handle("uploadMaterial", "video", resolve(__dirname, "../../ice.mp4"));
    });

    app.use(router.routes()).use(router.allowedMethods());
};