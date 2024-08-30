# Welcome to my News API
### Introduction
Thank you for taking the time to view my News API. This portfolio project was made during a week-long sprint (26-8-2024 to 30-8-2024) during my [Northcoders](https://northcoders.com/) full stack software developer bootcamp. During this week I utilised the following skills in order to finish this project:
* Javascript
* Documentation
* Test driven development (TDD)
* Jest
* Supertest
* Express
* Model view controller (MVC)
* PostgreSQL
* Fs/promises
* Hosting using supabase for the database and render for the website

### Access online
To access this API online click on the following URL: [News API](https://news-api-ovyc.onrender.com)

For a list of endpoints, simply type /api in the url after .com

To access each endpoint, you also type it in the URL after .com

### Set up
To interact with this api locally you will need to carry out the following instructions:
1) in your terminal run the following command in your terminal type git ```clone https://github.com/TheStringKing/News-API.git``` . This will clone the news-API repository onto your local system.
 
2) Next open the repository in a code editing software, for example visual studio code. In the __tests__ directory you will be able to see the dest driven development used to develop the API endpoints.

3) Next in the root of the repository create two files, one called .env.test and one called .env.development. In the .env.test file on line one type ```PGDATABASE=nc_news_test``` and in the .env.development file on line one type ```DATABASE_URL=nc_news```

4) check that you have node and node project manager (npm) installed by run the commands ```node -v``` and ```npm -v``` in your terminal, if it does not respond with a version number for either you can install node [here](https://nodejs.org/en/download/prebuilt-installer/current) and install npm by running ```npm install -g npm```

5)check that you have psql installed by ```running psql --version``` if you do not you can find instructions to do so [here](https://www.postgresql.org/download/)

6) next you will need to install the following dependencies:
| dependency  | code to run in your terminal |
| ------------- |:-------------:|
| express  	| ```npm install express``` |
| dotenv  	| ```npm install dotenv``` 	|
| pg  	| ```npm install pg``` 	|
| pg-format  	|   ```npm install pg-format```   |
| jest  	|   ```npm install jest```   |
| jest sorted 	|  ```npm install jest-sorted```	|
| supertest 	|   ```npm install supertest```   |

7) initialise the database by running ```npm run setup-db```

8) seed the database by running ```npm run seed```

9) initialise the server by running ```npm start```


### Contact
If you have any questions or would like to give any feedback please send a message to my email address: ---