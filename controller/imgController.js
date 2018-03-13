const mongoose = require('mongoose')

const Img = mongoose.model('Img')
const Count = mongoose.model('Count')

module.exports = {
  /**
   * 保存图片
   * 通过爬取到的图片 转存至腾讯COS后，获取到图片的详细信息，保存到本地数据库
   */
  save: async (img) => {
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
}

// 转换颜色格式
function getHexColor(val) { 
  return '#' + ('00000' + (Math.random() * val << 0).toString(16)).substr(-6);
}

// 获取文件类型
function getFileType(val) {
  const list = val.split('/')
  return list[list.length-1].split('.')[1] || 'jpeg'
}