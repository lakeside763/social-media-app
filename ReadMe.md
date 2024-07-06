# Social media app

## Backend Tasks
- By Moses Idowu
### Getting Started
- Setup .env and env.test environment variable using env.local.sample.

- To run the application locally

```
yarn install
yarn start - to start the application
yarn test - to process unit testing and integration testing
```


### Created API
The API documentation in details
- [https://documenter.getpostman.com/view/1194460/2sA3e1AVD7]
  
The app API was organised into two modules for easy maintainability
#### Users
- http://localhost:4500/v1/users - POST
- http://localhost:4500/v1/users/:id/follow - POST
- http://localhost:4500/v1/users/:id/unfollow - POST
- http://localhost:4500/v1/user/posts - GET
- http://localhost:4500/v1/user/feeds - GET


#### Posts
- http://localhost:4500/v1/posts - POST
- http://localhost:4500/v1/posts/:id/like - POST
- http://localhost:4500/v1/posts/:id/comment - POST


#### Notifications
- http://localhost:4500/v1/notifications - GET
- http://localhost:4500/v1/notifications/:id/read - POST

  
#### Authentication
- http://localhost:4500/v1/login - POST
- http://localhost:4500/v1/logout - POST

#### Things Achieved
- JWT Authentication
- Project structuring
- Writing of Test cases
- Schema Validation
- Using of cluster Module for managing concurrency
- Using of logger
- Error handling middlewares

#### Thing I would have love to add
- Write more test cases
- Web socket / server-sent for real-time notification
