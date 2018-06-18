import {getWechat} from "../wechat/index"

const client = getWechat()

export async function getSignaureAsync(url) {
  const data = await client.fetchAccessToken()
  const token = data.access_token
  const ticketData = await client.fetchTicket(token)
  const ticket = ticketData.ticket

  let params = client.sign(ticket,url)
  params.appId = client.appID

  return params
}