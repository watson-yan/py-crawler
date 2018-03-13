'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ImgSchema = new Schema({ 
  name: { type: String, required: true },   // 图片名字
  from: { type: String, default: '' },    // 图片来源
  url: { type: String },              // 图片地址
  address: { // 图片来源地址
    type: String, 
    required: [true, '图片地址不能为空'], 
    unique: true 
  }, 
  width: { type: Number },            // 图片宽
  height: { type: Number },           // 图片高
  type: { type: String },             // 图片类型
  size: { type: Number, default: 0 },             // 图片大小
  download_count: { type: Number, default: 0 },   // 下载次数
  file_name: { type: String, default: '' },     // 文件名
  alt: { type: String, default: '' },
  img_rgb: { type: String, default: '' },
  etag: { type: String, default: '' },          // 腾讯云返回的唯一识别码
  tags: { type: Array, default: [] },
  from_url: { type: String, default: '' },
  servered: { type: Boolean, default: false },
  storage: { type: Boolean, default: false }
})

// 验证图片来源地址唯一
ImgSchema.statics.checkUrl = function (address) {
  this.findOne({address: address}, (err, doc) => {
    if (err) return false
    return !!doc
  })
}

const Img = mongoose.model('Img', ImgSchema)

ImgSchema.path('address').validate((value) => {
  return Img.checkUrl(value)
}, '已经存在该图片')