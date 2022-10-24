# routes
## comments
- get all: /comments/
- get one: /comments/:commentId
- put: /comments/:commentId
- delete: /comments/:commentId
- post: /posts/:postId/comments

## posts
- get all: /posts/
- get one: /posts/:postId
- put: /posts/
- delete: /posts/:postId
- post: /posts/
    userId is taken from token

## users
- get all: /users/
- get: /users/:usersId
- delete: /users/
    userId is taken from token
- put: /users/
    userId is taken from token
- post: -> see auth route ->

## auth
- -> "post user" -> post /auth/register
- /auth/login
- get the current user: /auth/me 

# todo 
- [ ] look through all models and figure out how they'll be altered via calls
- [ ] comment_count
- [ ] view_count
- [ ] score
- [ ] reputation
