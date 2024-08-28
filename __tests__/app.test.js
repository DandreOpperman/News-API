const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const {
  articleData,
  commentData,
  topicData,
  userData,
} = require("../db/data/test-data/index");
const endpointsData = require("../endpoints.json");

beforeEach(() => seed({ topicData, userData, articleData, commentData }));
afterAll(() => db.end());

describe("/api/topics", () => {
  test("GET:200 response array should contains data for all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(topic).toHaveProperty("description");
          expect(topic).toHaveProperty("slug");
        });
      });
  });
  test("if a url is inputed that does not exist a relevant error message should be returned", () => {
    return request(app)
      .get("/api/thisEndPointDoesNotExist")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Route not found");
      });
  });
});

describe("/api", () => {
  test("GET:200 this end point should respond with an object containing a key of endpoints, that has a value of all other endpoints available", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsData);
      });
  });
});
describe("/api/articles/:article_id", () => {
  test("GET:200 sends a single article to the client", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.author).toBe("butter_bridge");
        expect(article.title).toBe("Living in the shadow of a great man");
        expect(article.article_id).toBe(1);
        expect(article.body).toBe("I find this existence challenging");
        expect(article.topic).toBe("mitch");
        expect(article.created_at).toBe("2020-07-09T20:11:00.000Z");
        expect(article.votes).toBe(100);
        expect(article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });
  test("GET:404 sends an appropriate status and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("article does not exist");
      });
  });
  test("GET:400 sends an appropriate status and error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/not-an-article-id")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request");
      });
  });
});
describe("/api/articles", () => {
  test("GET:200 response array should contains data for all articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(13);
      });
  });
  test("response array should contain author, title, article_id, topic, created_at, votes and article_img_url properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        articles.forEach((article) => {
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
        });
      });
  });
  test("there should be no body property on any of the arrticles in the array", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        articles.forEach((article) => {
          expect(article).not.toHaveProperty("body");
        });
      });
  });
  test("there should be a comment_count property on each arrticle in the array that has a value equal to the number of comments in the comments table that have the same article_id as the article", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        articles.forEach((article) => {
          expect(article).toHaveProperty("comment_count");
            })
        });
      });
  test("the array should be sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
});
describe("/api/articles/:article_id/comments", () => {
  test("GET:200 responds with an array of comments for the given article_id, each comment should have comment_id, votes, created_at, author, body and article_id properties", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(Array.isArray(comments)).toBe(true);
        comments.forEach((comment) => {
          expect(comment).toHaveProperty('comment_id');
          expect(comment).toHaveProperty('votes');
          expect(comment).toHaveProperty('created_at');
          expect(comment).toHaveProperty('author');
          expect(comment).toHaveProperty('body');
          expect(comment).toHaveProperty('article_id');
        });
      });
  });
  test('comments should be sorted by the date they were created at, with the most recent date coming first ',()=>{
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toBeSortedBy("created_at");
      });
  })
  test("GET:404 sends an appropriate status and error message when given a valid but non-existent article_id", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("article does not exist");
      });
  });
  test("GET:400 sends an appropriate status and error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/not-an-article-id/comments")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request");
      });
  });
  test("GET:200 sends an empty array when given a valid article_id that has no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toEqual([]);
      });
  });
});
