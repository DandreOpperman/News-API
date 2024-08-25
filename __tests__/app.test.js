const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const {articleData, commentData, topicData, userData } = require('../db/data/test-data/index')

beforeEach(() => seed({ topicData, userData, articleData, commentData }));
afterAll(() => db.end());

describe('/api/topics',()=>{
    test('200: response array should contains data for all topics',()=>{
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body: {topics}}) =>{
            expect(topics.length).toBe(3)
            topics.forEach(({description, slug})=>{
                expect(typeof description).toBe('string')
                expect(typeof slug).toBe('string')
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