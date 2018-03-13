const request = require('request')
const mongoose = require('mongoose')
const translate = require('./translate/index')
const mongo = require('./mongo.js')
const data = require('./data')
const cos = require('./cos')
const toServer = require('./toServer')
const db = mongo()

const serverPath = 'https://www.xiaowd.com'

const Img = mongoose.model('Img')
const Count = mongoose.model('Count')

async function main() {
  let imgList = await translate(data)
  for (img of imgList) {
    await imgSave(img)
  }
}

// const imgs = Img.find({servered: false}).then((doc) => {
//   toServer(doc, serverPath)
//   if (serverPath.indexOf('xiaowd') !== -1) {
//     for (let img of doc) {
//       img.servered = true
//       img.save()
//     }
//   }
// })

main()

async function imgSave(img) {
  const _img = await Img.findOne({from_url: img.url})
  if (_img) {
    return
  }
  if (!img.name) {
    img.name =img.alt
  }
  img.address = img.url
  let count = await Count.findOne()
  if (!count) {
    count = new Count({ img_count: 0 })
    await count.save()
  }
  const buffer = await _request({ url: img.url, encoding: null })
  img.from_url = img.url
  // return
  count.img_count++
  const name = `p/xiaowd-img-${count.img_count}.${getFileType(img.url)}`
  await count.save()
  await cos(name, buffer)
        .catch(err => {
          console.log(err)
          return
        })
  const body = await _request(`https://image.xiaowd.com/${name}?imageInfo`)
  let info
  try {
    info = JSON.parse(body)
  } catch (err) {
    console.log(err)
    return
  }
  if (!info) {
    console.log('没有图片返回信息')
  }
  img.file_name = name.replace('/p/', '')
  img.storage = true
  img.url = `https://image.xiaowd.com/${name}`
  img.etag = info.md5
  img.type = info.format
  img.width = info.width
  img.height = info.height
  img.size = info.size
  img.storage = true
  img.img_rgb = getHexColor(info.photo_rgb)
  await new Img(img).save()
}

async function _request (option) {
  return new Promise((resolve, reject) => {
    request(option, async (err, res, data) => {
      if (err) {
        console.log(option)
        console.log(err)
        reject(err)
      } else {
        if (res.statusCode == 200) { 
          resolve(data)
        }
      }
    })
  })
}

function getHexColor(val) { 
  return '#' + ('00000' + (Math.random() * val << 0).toString(16)).substr(-6);
}

function getFileType(val) {
  const list = val.split('/')
  return list[list.length-1].split('.')[1] || 'jpeg'
}
