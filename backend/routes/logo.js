const express = require("express")
const logocontroller = require('../controllers/logocontroller')
const upload= require('../middleware/logos')
const router = express.Router()
router.post('/store',upload.single('avatar'),logocontroller.store)
router.post('/findlogo',logocontroller.retrieve)
module.exports=router   