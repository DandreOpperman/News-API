const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const {articleData, commentData, topicData, userData } = require('../db/data/test-data/index')
const endpointsData = require('../endpoints.json')

beforeEach(() => seed({ topicData, userData, articleData, commentData }));
afterAll(() => db.end());

describe('/api/topics',()=>{
    test('GET:200 response array should contains data for all topics',()=>{
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body: {topics}}) =>{
            expect(topics.length).toBe(3)
            topics.forEach((topic)=>{
                expect(topic).toHaveProperty('description')
                expect(topic).toHaveProperty('slug')
            })
        })
    })
    test('if a url is inputed that does not exist a relevant error message should be returned',()=>{
        return request(app)
        .get('/api/thisEndPointDoesNotExist')
        .expect(404)
        .then(({body: {message}}) =>{
            expect(message).toBe('Route not found')
        })
    })
})

describe('/api',()=>{
    test('GET:200 this end point should respond with an object containing a key of endpoints, that has a value of all other endpoints available',()=>{
        return request(app)
        .get('/api')
        .expect(200)
        .then(({body:{endpoints}}) =>{
            expect(endpoints).toEqual(endpointsData)
        })
    })
})
describe('/api/articles/:article_id', () => {
    test('GET:200 sends a single article to the client', () => {
      return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({body : {article}}) => {
            expect(article.author).toBe("butter_bridge")
            expect(article.title).toBe("Living in the shadow of a great man");
            expect(article.article_id).toBe(1);
            expect(article.body).toBe("I find this existence challenging",)
            expect(article.topic).toBe('mitch');
            expect(article.created_at).toBe('2020-07-09T20:11:00.000Z');
            expect(article.votes).toBe(100);
            expect(article.article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700")
        });
    });
    test('GET:404 sends an appropriate status and error message when given a valid but non-existent id', () => {
      return request(app)
        .get('/api/articles/999')
        .expect(404)
        .then(({body : {message}}) => {
          expect(message).toBe('article does not exist');
        });
    });
    test('GET:400 sends an appropriate status and error message when given an invalid id', () => {
      return request(app)
        .get('/api/articles/not-an-article-id')
        .expect(400)
        .then(({body: {message}}) => {
          expect(message).toBe('Bad request');
        });
    });
})