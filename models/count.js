'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CountSchema = new Schema({ 
  img_count: { type: Number }
})

mongoose.model('Count', CountSchema)