# Node code base API

Project for node code base.

# Table of Contents
[Pre-requisites](#Pre-requisites)

[Getting started](#Getting-started)

[API Document endpoints](#API-endpoints)

# Pre-requisites
- Install [Node.js](https://nodejs.org/en/) version >= 18.16.1

# Getting-started
- Clone the repository
```
git clone  <git lab url> http://172.16.10.188:8888/web/node-base-setup
```
- Install dependencies
```
cd <project-name>
npm install
```
- Configure .env file (rename .env.example to .env)

- Setup database
```
Create database in your local phpmyadmin and update connection details in .env file
```
- Build and run the project
```
npm start
```
- run sequelize seed command
```
npx sequelize-cli db:seed:all
```
-  Navigate to `http://localhost:5011`

# API-endpoints
```
  swagger Endpoint : http://localhost:5011/api-docs 
  username: backend@mailinator.com 
  password: Test@123
```
