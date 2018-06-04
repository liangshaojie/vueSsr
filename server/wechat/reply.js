const tip = "欢迎来到王者荣耀！"

export default async (ctx, next) => {
    const message = ctx.weixin
    console.log(message)

    ctx.body = tip
}