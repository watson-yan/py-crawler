const mongoose = require('mongoose')
const mongo = require('./mongo.js')
const db = mongo()
const config = require('./config')
// 图片数据
const data = require('./data')
// 核心方法
const {cos, request, toServer} = require('./utils/index')
// Controller
const imgController = require('./controller/imgController')
// Models
const Img = mongoose.model('Img')



async function main() {
  let imgList = await translate(data)
  for (img of imgList) {
    await imgController.save(img)
  }
}

console.log(serverPath)

// TODO:做标签去重
const imgs = Img.find({servered: true}).then(async doc => {
  
  // console.log(doc.length)
  // toServer(doc, serverPath)
  // if (serverPath.indexOf('xiaowd') !== -1) {
  //   for (let img of doc) {
  //     img.servered = true
  //     img.save()
  //   }
  // }

  // 翻译名称
  // for (let img of doc) {
  //   // img.name = await translate(img.name)
  //   img.name = img.name.replace('的照片', '图片')
  //                       .replace('库存照片', '图片')
  //                       .replace('照片', '图片')
  //   await img.save()
  //   console.log(img.name)
  // }
})

// main()



async function update(img) {
  request('/admin/img/update')
}




