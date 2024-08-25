const express = require('express');
const app = express();
const{getTopics} = require('./controllers/topics.controllers')
const {serverErrorHandler} =require('./error')

app.get('/api/topics', getTopics)

app.all('/*', (req, res)=>{
    res.status(404).send({message : 'Route not found'})
})
app.use(serverErrorHandler)

module.exports = app;