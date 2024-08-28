const express = require('express');
const app = express();
const{getTopics} = require('./controllers/topics.controllers')
const {getEndPoints}=require('./controllers/api.controller')
const {getArticleById, getArticles}=require('./controllers/articles.controllers')
const {getCommentsByArticleId, postComment} =require('./controllers/comments.controllers')
const {serverErrorHandler, customErrorHandler, idErrorHandler, reqBodyErrorHandler} =require('./error')

app.use(express.json());

app.get('/api/topics', getTopics)
app.get('/api', getEndPoints)
app.get('/api/articles/:article_id', getArticleById)
app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id/comments', getCommentsByArticleId)
app.post('/api/articles/:article_id/comments', postComment)

app.use(customErrorHandler)
app.use(idErrorHandler)
app.use(reqBodyErrorHandler)
app.all('/*', (req, res)=>{
    res.status(404).send({message : 'Route not found'})
})
app.use(serverErrorHandler)

module.exports = app;