# node_ts_dynamodb_react 2023
Calendar demonstration written with nodejs, typescript, react, dynamodb and google login.
Written in 2023

# How to run the project 

## 1 Dynamodb database

### run the database and set proper permissions
The dynamodb database is available as a docker image.

To run the database under linux:

$ cd api
$ docker-compose up

Once everything is installed, stop the process with CTRL + C 
Now run the following command to have proper permissions
$ sudo chmod 777 ./docker/dynamodb

Now run the database again
$ docker-compose up

### initialize the database
run the scripts
$ node dist/db_init/initDb.js 
asdfasdf


## 2- Run the api

### Register a google app
Execute the steps in this link: 
https://www.passportjs.org/tutorials/google/register/

set values of google client id and secret in $PROJECT/api/.env file.
GOOGLE_CLIENT_ID=xxxxxxxxxxxxxxxx
GOOGLE_CLIENT_SECRET=yyyyyyyyyyyyyyyyyyyy

### install and run the api server
From the previous directory ($PROJECT/api) open a new console in the same directory and run :
$ npm install
$ npm run dev

This will make the api server run

## 3- run the webapp
$ cd ../webapp
$ npm install
$ npm run dev



