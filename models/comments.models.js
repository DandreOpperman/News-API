const db = require('../db/connection')
const articles = require('../db/data/test-data/articles')
exports.selectCommentsByArticleId = (article_id) => {
    let queryStr ='SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body, comments.article_id FROM comments WHERE comments.article_id = $1'
    let count = 0
    const ValidIdArr = articles.map(()=>{
        count++
        return count
    })

    const idIsValid = ValidIdArr.indexOf(Number(article_id))!==-1

    queryStr += ` ORDER BY created_at;`
    return db
      .query(queryStr, [article_id])
      .then(({rows}) => {
        if(idIsValid){return rows}
        if(rows.length===0){return Promise.reject({ message: "article does not exist", status: 404})
        }
    console.log(rows)
        return rows;
      });
}