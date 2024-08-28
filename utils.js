const format = require("pg-format");
const db = require("./db/connection");
exports.checkExists=(table_name, column_name, value)=>{
  const queryStr = format("SELECT * FROM %I WHERE %I = $1;", table_name, column_name);
  return db.query(queryStr, [value]).then(({rows}) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, message: `${column_name} not found` });
    }
  });
};
// exports.checkArticleIdExists = (article_id)=>{
//     return db.query('SELECT * FROM articles WHERE articles.article_id = $1', [article_id]).then(({rows})=>{
//       if(rows.length===0){return Promise.reject({ message: "article does not exist", status: 404})
//       }
//     })
//   }
