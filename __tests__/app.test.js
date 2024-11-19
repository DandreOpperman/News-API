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

describe("/", () => {
  test("should return a welcome message", () => {
    return request(app)
      .get("/")
      .then(({ body: { message } }) => {
        expect(message).toBe(
          "Welcome to news API! go to /api for endpoint info"
        );
      });
  });
});

describe("non-routed path", () => {
  test("if a url is inputed that does not exist a relevant error message should be returned", () => {
    return request(app)
      .get("/api/thisEndPointDoesNotExist")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Route not found");
      });
  });
});

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
        expect(article.created_at).toBe("2020-07-10T01:11:00.000Z");
        expect(article.votes).toBe(100);
        expect(article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });
  test("GET:200 article should have a property of comment_count that shows the number of comments on the article", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.comment_count).toBe(11);
      });
  });
  test("GET:200 article should have a property of comment_count that shows the number of comments on the article when there are no comments", () => {
    return request(app)
      .get("/api/articles/4")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.comment_count).toBe(0);
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
  test("PATCH:200 will update the votes of an article using an inc_votes object, increasing the votes by the value of the inc_votes key", () => {
    const newVotes = { inc_votes: 5 };
    return request(app)
      .patch("/api/articles/1")
      .send(newVotes)
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.votes).toBe(105);
      });
  });
  test("PATCH:200 will update the votes of an article if the increse in votes is negative, representing a decrease in votes)", () => {
    const newVotes = { inc_votes: -5 };
    return request(app)
      .patch("/api/articles/1")
      .send(newVotes)
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.votes).toBe(95);
      });
  });
  test("PATCH:404 sends an appropriate status and error message when given a valid but non-existent article_id", () => {
    const newVotes = { inc_votes: -5 };
    return request(app)
      .patch("/api/articles/999")
      .send(newVotes)
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("article_id not found");
      });
  });
  test("PATCH:400 sends an appropriate status and error message when given an invalid article_id", () => {
    const newVotes = { inc_votes: -5 };
    return request(app)
      .patch("/api/articles/destroyeverything")
      .send(newVotes)
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request");
      });
  });
  test("Patch:400 sends an appropriate status and error message if the newVotes object contains an invalid value type", () => {
    const newVotes = { inc_votes: "macaronni" };
    return request(app)
      .patch("/api/articles/3")
      .send(newVotes)
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
  test("GET:200 response array should contain author, title, article_id, topic, created_at, votes and article_img_url properties", () => {
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
  test("GET:200 there should be no body property on any of the arrticles in the array", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        articles.forEach((article) => {
          expect(article).not.toHaveProperty("body");
        });
      });
  });
  test("GET:200 there should be a comment_count property on each arrticle in the array that has a value equal to the number of comments in the comments table that have the same article_id as the article", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        articles.forEach((article) => {
          expect(article).toHaveProperty("comment_count");
        });
      });
  });
  test("GET:200 the array should defult to being sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("GET:200 When provided a query sort_by follwed by a valid column name (author) sorts the array by that column name", () => {
    return request(app)
      .get("/api/articles?sort_by=author")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("author", {
          descending: true,
        });
      });
  });
  test("GET:200 When provided a query sort_by follwed by a valid column name (votes) sorts the array by that column name", () => {
    return request(app)
      .get("/api/articles?sort_by=votes")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("votes", {
          descending: true,
        });
      });
  });
  test("GET:200 When provided a query sort_by follwed by a valid column name (votes) sorts the array by that column name", () => {
    return request(app)
      .get("/api/articles?sort_by=comment_count")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("comment_count", {
          descending: true,
        });
      });
  });
  test("GET:400 When provided a query sort_by followed by an invalid column name (passwords) should return an appropriate status and error message", () => {
    return request(app)
      .get("/api/articles?sort_by=passwords")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request");
      });
  });
  test("GET:200 When provided a query order followed by asc or desc sorts the array in that order (ascending or descending)", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at");
      });
  });
  test("GET:200 When provided querys for sort_by and order arry should be sorted by the column name in the correct order", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=desc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("title", {
          descending: true,
        });
      });
  });
  test("GET:200 if sort_by or order queries are left blank should order and sort by the defult values (date in descending order)", () => {
    return request(app)
      .get("/api/articles?sort_by=&order=")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("GET:400 When provided an order query follwed by an invalid input (12345) should return an appropriate status and error message", () => {
    return request(app)
      .get("/api/articles?order=12345")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request");
      });
  });
  test("GET:200 if topic query is present with a valid topic, the articles array should be filtered to only contain articles that have that topic title", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(12);
        articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });
  test("GET:200 if multiple valid querys are present, the articles array should be filtered sorted and ordered correctly", () => {
    return request(app)
      .get("/api/articles?topic=mitch&sort_by=votes&order=asc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(12);
        expect(articles).toBeSortedBy("votes");
        articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });
  test("GET:404 if topic query is present with an invalid topic, should return an appropriate status and error message", () => {
    return request(app)
      .get("/api/articles?topic=11111")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("slug not found");
      });
  });
  test("GET:200 if topic query exists but has no articles, should return an empty array", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toEqual([]);
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
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("article_id");
          expect(comment.article_id).toBe(1);
        });
      });
  });
  test("GET:200 comments should be sorted by the date they were created at, with the most recent date coming first ", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toBeSortedBy("created_at");
      });
  });
  test("GET:404 sends an appropriate status and error message when given a valid but non-existent article_id", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("article_id not found");
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
  test("POST:201 inserts a new comment into the db and sends the new team back to the client", () => {
    const newComment = {
      username: "icellusedkars",
      body: "I like this content, thank you for your hard work",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment.comment_id).toBe(19);
        expect(comment.author).toBe("icellusedkars");
        expect(comment.body).toBe(
          "I like this content, thank you for your hard work"
        );
      });
  });
  test("POST:201 inserts a new comment into the db and sends the new team back to the client when the newComment object has additional properties", () => {
    const newComment = {
      username: "icellusedkars",
      body: "I like this content, thank you for your hard work",
      givepassword: "${password}",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment.comment_id).toBe(19);
        expect(comment.author).toBe("icellusedkars");
        expect(comment.body).toBe(
          "I like this content, thank you for your hard work"
        );
        expect(comment.givepassword).not.toBe("${password}");
      });
  });
  test("POST:400 responds with an appropriate status and error message when provided with an incomplete comment (no body)", () => {
    const newComment = {
      username: "icellusedkars",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request");
      });
  });
  test("POST:404 responds with an appropriate status and error message when provided with a comment from a non existant user)", () => {
    const newComment = {
      username: "ImNoTrEaL",
      body: "not a real user",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Non existent user");
      });
  });
  test("POST:400 sends an appropriate status and error message when given a valid but nonexistant id)", () => {
    const newComment = {
      username: "icellusedkars",
      body: "I like this content, thank you for your hard work",
    };
    return request(app)
      .post("/api/articles/999/comments")
      .send(newComment)
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Non existent user");
      });
  });
  test("POST:400 sends an appropriate status and error message when given an invalid id)", () => {
    const newComment = {
      username: "icellusedkars",
      body: "I like this content, thank you for your hard work",
    };
    return request(app)
      .post("/api/articles/NOT_A_USER_ID/comments")
      .send(newComment)
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request");
      });
  });
});
describe("/api/comments/:comment_id", () => {
  test("DELETE:204 deletes comment that is specified by comment_id and sends no body back", () => {
    return request(app).delete("/api/comments/3").expect(204);
  });
  test("DELETE:404 sends an appropriate status and error message when given a valid but non-existent comment_id", () => {
    return request(app)
      .delete("/api/comments/999")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("comment_id not found");
      });
  });
  test("DELETE:400 sends an appropriate status and error message when given an invalid comment_id", () => {
    return request(app)
      .delete("/api/comments/not-an-id")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request");
      });
  });
});
describe("/api/users", () => {
  test("GET:200 response array should contains data for all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users.length).toBe(4);
        users.forEach((user) => {
          expect(user).toHaveProperty("username");
          expect(user).toHaveProperty("name");
          expect(user).toHaveProperty("avatar_url");
        });
      });
  });
});
