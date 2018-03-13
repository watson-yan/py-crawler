const request = require('request')

async function _request (option) {
  return new Promise((resolve, reject) => {
    request(option, async (err, res, data) => {
      if (err) {
        reject(err)
      } else {
        if (res.statusCode == 200) { 
          resolve(data)
        }
      }
    })
  })
}

module.exports = _request