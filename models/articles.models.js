const db = require('../db/connection')
exports.selectArticleById = (article_id) => {
    return db
      .query('SELECT * FROM articles WHERE article_id = $1;', [article_id])
      .then(({rows}) => {
        if(rows.length===0){return Promise.reject({ message: "article does not exist", status: 404})}
        return rows[0];
      });
  };

  exports.selectArticles = () => {
    let queryStr = 'SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url FROM articles'

    queryStr += ` ORDER BY created_at DESC;`
    return db
      .query(queryStr)
      .then(({rows}) => {
        rows.forEach((article)=>{
          let count = 0
          let articleId = article.article_id
          const comments = require('../db/data/test-data/comments')
          comments.forEach((comment)=>{if(comment.article_id === articleId){count++}})
            article.comment_count = count
        })
        return rows;
      });
  };