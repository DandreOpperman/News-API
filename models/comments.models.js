const db = require('../db/connection')
// const{checkExists}=require('../utils.js')
const{checkArticleIdExists, checkExists} =require('../utils')

exports.selectCommentsByArticleId = (article_id) => {
  const queryVals =[article_id]
  const queryProms = []
    let queryStr ='SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body, comments.article_id FROM comments WHERE comments.article_id = $1 ORDER BY created_at'

    queryProms.push(db.query(queryStr, queryVals))
    queryProms.push(checkExists('articles','article_id', article_id))
    return Promise.all(queryProms).then((output) => {
        return output[0].rows;
      });
}
exports.insertComment = (article_id, {username, body}) =>{
  const queryProms = []
  let queryStr = 'INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *;'
  queryProms.push(db.query(queryStr, [body, username, article_id]))
  queryProms.push(checkExists('articles','article_id', article_id))
  return Promise.all(queryProms).then((output) => {
    console.log(output[0].rows[0])
    return output[0].rows[0];
  });
}