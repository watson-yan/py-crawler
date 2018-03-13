// 引入模块
const fs = require('fs')
const COS = require('cos-nodejs-sdk-v5')

// 创建实例
const cos = new COS({
    // 必选参数
    SecretId: 'AKIDcghUFq9Bcsd7sSJn9LdyDB1tbqk162Dd',
    SecretKey: 'b4Wq6HLH4jFdp273rZ9hVjyGPj9Uhomc',
    // 可选参数
    FileParallelLimit: 3,    // 控制文件上传并发数
    ChunkParallelLimit: 3,   // 控制单个文件下分片上传并发数
    ChunkSize: 1024 * 1024,  // 控制分片大小，单位 B
})


module.exports = (fileName, buffer) => {
  return new Promise((resolve, reject) => {
    if (!buffer) {
      reject('没有获取到数据')
    }
    // 分片上传
    cos.putObject({
      Bucket: 'xwd-1255376240',
      Region: 'ap-shanghai',
      ContentLength: buffer.length || 0,
      Key: fileName,
      Body: buffer
    }, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

