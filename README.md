# Welcome to my News API

### Introduction

Thank you for taking the time to view my News API. The purpose of this API is accessing application data programmatically. The intention of this project was to mimic the building of a real world backend service, which is going to provide information to the front end architecture of the next project. This portfolio project was made during a week-long sprint (26-8-2024 to 30-8-2024) during my [Northcoders](https://northcoders.com) full stack software developer bootcamp. During this week I utilised the following skills in order to finish this project:

- Javascript
- Documentation
- Test driven development (TDD)
- Jest
- Supertest
- Express
- Model view controller (MVC)
- PostgreSQL
- Fs/promises
- Hosting using supabase for the database and render for the website

### Access online

To access this API online click on the following URL: [News API](https://news-api-ovyc.onrender.com)

For a list of endpoints, simply type /api in the url after .com

To access each endpoint, you also type it in the URL after .com

### Set up

To interact with this api locally you will need to carry out the following instructions:

1. clone the repository with following command `git clone https://github.com/TheStringKing/News-API.git`

2. Next open the repository in a code editing software, for example visual studio code.

3. Next in the root of the repository create two files, one called .env.test and one called .env.development. In the .env.test file on line one type `PGDATABASE=nc_news_test` and in the .env.development file on line one type `DATABASE_URL=nc_news`

4. next you will need to install the dependencies with following command: `git i` . Doing so will install these dependencies:

- express
- dotenv
- pg
- pg-format
- jest
- jest sorted
- supertest

5. initialise the database by running `npm run setup-db`

6. seed the database by running `npm run seed`

7. initialise the server by running `npm start`

### Contact

If you have any questions or would like to give any feedback please send a message to my email address: ---
