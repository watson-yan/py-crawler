const MD5 = require('./md5')
const qs = require('qs')
const request = require('request')

// module.exports = async list => {
//   const newList = []
//   for(let item of list) {
//     if (item.alt.indexOf('Free stock photo of') !== -1) {
//       tagList = item.alt.replace('Free stock photo of ', '')
//       let result = await translate(tagList)
//       result = result.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/ig, ',')
//       item.tags = result.split(',')
//     }
//     // item.name = await translate(item.alt)
//     newList.push(item)
//   }
//   return newList
// }

const translate = async query => {
  const appid = '2015063000000001';
  const key = '12345678';
  const salt = (new Date).getTime();
  const q = query;
  // 多个query可以用\n连接  如 query='apple\norange\nbanana\npear'
  const from = 'en';
  const to = 'zh';
  const str1 = appid + query + salt +key;
  const sign = MD5(str1);
  const url = `http://api.fanyi.baidu.com/api/trans/vip/translate?${qs.stringify({ q, appid, key, salt, from, to, salt, sign })}`
  return new Promise((resolve, reject) => {
    request(url, (error, response, body) => {
      if (error) {
        reject('')
      }
      if (!error && response.statusCode == 200) {
        const result = JSON.parse(body)
        if (result.trans_result && result.trans_result.length > 0) {
          resolve(result.trans_result[0].dst)
        } else {
          resolve('')
        }
      }
    })
  })
}

module.exports = translate