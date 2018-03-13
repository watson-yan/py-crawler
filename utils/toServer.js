const request = require('request')
const config = require('../config')

let rootPath = config.rootPath
let authorization
const getHeader = () => {
  const header = {
    "content-type": "application/json;charset=utf-8"
  }
  if (authorization) {
    header["Authorization"] = 'Bearer ' + authorization
  }
  return header
}

const send = async (url, data) => {
  return new Promise((resolve, reject) => {
    request({
      url: rootPath + url,
      method: "POST",
      json: true,
      headers: getHeader(),
      body: data
    }, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        resolve(body)
      } else {
        if (!error && response.statusCode == 401) {
          reject('身份认证错误')
        } else {
          reject(' error: ' + error)
        }
      }
    })
  }).catch(err => {
    console.log(err)
  })
}

module.exports = async (list) => {
  list = list.map(item => {
    delete item._id
    delete item.servered
    return item
  })
  
  await send('/login', {username: config.user.name, password: config.user.password}).then((data) => {
    // console.log(data)
    authorization = data.token
  }).catch(err => {
    console.log(err)
  })
  await send('/admin/img/add', {imgs: list}).then(data => {
    console.log(data)
  }).catch(err => {
    console.log(err)
  })
}







