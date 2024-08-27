const express = require('express');
const app = express();
const{getTopics} = require('./controllers/topics.controllers')
const {getEndPoints}=require('./controllers/api.controller')
// const {getTopics, getEndPoints}=require('./controllers/index')
const {serverErrorHandler} =require('./error')

app.get('/api/topics', getTopics)
app.get('/api', getEndPoints)
app.all('/*', (req, res)=>{
    res.status(404).send({message : 'Route not found'})
})
app.use(serverErrorHandler)

module.exports = app;