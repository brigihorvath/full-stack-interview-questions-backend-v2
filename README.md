# JavaScript Interview Questions - Backend

## Description

A NodeJS back-end application for the JS Interview questions React app.

## ROUTES:

USER ROUTES:

- GET /users/:userId,
  - get user's details
- GET /login
  - returns if the user is logged in or not
- POST /signup
  - redirects to / if user logged in
  - body:
    - email
    - password
- GET /login
  - redirects to / if user logged in
  - renders the login form
- POST /login
  - redirects to / if user logged in
  - body:
    - email
    - password
- POST /logout

  - redirect to homepage

  QUESTION ROUTES:

-GET /questions - returns an array with all the questions
-GET /questions/:questionId - get one question's details
-GET /questions/categories/:category
-returns an array of questions of the corresponding category
-GET /questions/favourites - returns an array with the user's favourite questions
-PUT /questions/:questionId - modifies one questions description
-DELETE /questions/:questionId - deletes one question from the database
-POST /questions/favourites - adds a question to the user's getFavourites

ANSWER ROUTES:

-GET /answers/answerId
-returns one answer from the database
-POST /answers/create-answer
-creates an answer
-PUT /answers/answerId
-modifies an answer
-DELETE /answers/answerId
-deletes an answer

## Models

User model

```
email: String
password: String
username: String
image: String / Default
role: enum [admin, user]
questions: ObjectId - Question
answers: ObjectID array - Answer
favourites: ObjectId array - Question
answeredQuestions: ObjectId array - Question
points: Number

```

Question model

```
question: Object,
  answers: ObjectId - Answer
  likes: Number
  category: String, [Basics, Number, Date, OOP, Closures, DOM, Arrays, Strings, Promises, JavaScript]
  user: ObjectId - User

```

Answer model

answer: Object
user: ObjectId - User

## Links

### Trello

[Link to your trello board](https://trello.com/b/dhB1yjRG/javascript-interview-questions)

### Git

The url to your repository and to your deployed project

[Repository Link](https://github.com/brigihorvath/full-stack-interview-questions-backend-v2)

[Deploy Link](https://dashboard.heroku.com/apps/full-stack-interview-questions)

## Backlog

List of other features outside of the MVPs scope

### Slides

[Slides Link](https://docs.google.com/presentation/d/1ID3YVjUAl_WkPlTbIyOJ54M1rkpECa5a-JcYlxU6Ayk/edit?usp=sharing)
