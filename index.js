const connectToMongo = require('./db');
var express = require('express');  
const cors = require('cors')
require('dotenv').config()
connectToMongo();

var app = new express(); 


const port = process.env.PORT || 3001

app.use(cors())
app.use(express.json())
app.use('/api/v1/auth',require('./routes/auth.js'))
app.use('/api/v1/notes',require('./routes/notes'))


var server = app.listen(port,()=>{
    console.log(`Servir listen on Port ${port}`)
});  