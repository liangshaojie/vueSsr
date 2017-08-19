const tip = '我的卡里新，欢迎来到这里\n'

export default async (ctx,next) => {
  const message = ctx.weixin
  console.log(message);
  ctx.body = tip
}