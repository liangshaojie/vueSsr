import cheerio from 'cheerio'
import rp from 'request-promise'
import R from 'ramda'
// import Agent from'socks5-http-client/lib/Agent'

export const getIMDbCharacter = async () => {
  console.log('开始了');
  const options = {
    uri: 'http://www.imdb.com/title/tt0944947/fullcredits?ref_=tt_cl_sm#cast',
    // agentClass: Agent,
    // agentOptions: {
    //   socksHost: 'localhost',
    //   socksPort: 1080 // 本地 VPN 的端口，这里用的 shadowsocks
    // },
    transform: body => cheerio.load(body)
  }
  const $ = await rp(options)
  var photos = []
  $('table.cast_list tr.odd, tr.even').each(function () {
    let nmIdDom = $(this).find('td.itemprop a')
    const nmId = nmIdDom.attr('href')
    let character = $(this).find('td.character a')
    let name = character.text()
    let chId = character.attr('href')
    let playedBy = $(this).find('td.itemprop span.itemprop')
    playedBy = playedBy.text()
    const data = {
      playedBy,
      nmId,
      name,
      chId
    }
    photos.push(data)
  })
  console.log('共拿到'+photos.length);
  const fn = R.compose(
      R.map(photo => {
        const reg1 = /\/name\/(.*?)\/\?ref/
        const reg2 = /\/character\/(.*?)\/\?ref/
        const match1 = photo.nmId.match(reg1)
        const match2 = photo.chId.match(reg2)
        photo.nmId = match1[1]
        photo.chId = match2[1]
        return photo
      }),
      R.filter(photo => photo.playedBy && photo.name && photo.nmId && photo.chId)
  )
  photos = fn(photos)
  console.log('清洗后'+photos.length);
  return photos
}

getIMDbCharacter()


