const morgan = require('morgan')
const express= require('express')
const mongoose= require('mongoose')
const cors = require('cors');
const logorouter = require('./routes/logo')
mongoose.connect('mongodb://localhost:27017/ipldata')
const db= mongoose.connection
const app = express()
const PORT = process.env.PORT || 3000
db.on('error',(err)=>{
    console.log("error connecting to the database")
})
db.once('open',()=>{
    console.log("database connected succesfully")
})   
app.use(morgan('dev'))
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cors({
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST'], 
  }));
  app.use('/logos', express.static('logos'));
  app.use('/api/logo',logorouter)
app.listen(PORT,()=>{
    console.log("server is running on the port")
})

