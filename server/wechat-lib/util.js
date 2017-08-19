import xml2js from 'xml2js'

export function parseXML(xml) {
  return new Promise((resolve, reject) => {
    xml2js.parseString(xml, {tirm: true}, (err, content) => {
      if(err){
        reject(err)
      }else{
        resolve(content)
      }
    })
  })
}