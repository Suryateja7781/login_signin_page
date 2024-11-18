const multer = require('multer')
const path= require('path')
const storage= multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'logos/')
    },
    filename: function(req,file,cb){
        let ext = path.extname(file.originalname)
        cb(null,Date.now()+ext)
    }
})   
var upload = multer({
    storage:storage,
    fileFilter:function(req,file,cb){
        if( 
            file.mimetype=='image/jpg'||
            file.mimetype=='image/png'


        ){
            cb(null,true)
        }
        else{
            console.log("only png and jpg is supported")
            cb(null,false)
        }
    },
        limits:{
            fileSize:1024*1024*2
        }
    }
)
module.exports = upload