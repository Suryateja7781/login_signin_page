const mongoose=require('mongoose')
const Schema = mongoose.Schema
const logoschema = new Schema({
    teamname:String,
    avatar:String
})
const Logo = mongoose.model('logos',logoschema)
module.exports=Logo
  