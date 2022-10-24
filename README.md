# routes
## users
- get /api/v1/users
    get all users 
- get /api/v1/users/:id
    get user by id
- post /api/v1/users/
    create new user
- put /api/v1/users/:id
    put user by id
- delete /api/v1/users/:id
    delete user by id
- put /api/v1/users/:id/photo
    upload photo

## auth
- post /api/v1/auth/register
    register user
        public
- post /api/v1/auth/login
    login user
        public
- get /api/v1/auth/logout
    log user out / clear cookie
        public
- get /api/v1/auth/me
    get current logged in user
        private
- put /api/v1/auth/updatedetails
    update user details
        private
- put /api/v1/auth/updatepassword
    update password
        private
- post /api/v1/auth/forgotpassword
    forgot password
        public
- put /api/v1/auth/resetpassword/:resettoken
    reset password
        public

## posts
- get /api/v1/posts
    get all posts 
- get /api/v1/users/:userId/posts
    get all posts for a user
- get /api/v1/posts/:id
    get post by id
- post /api/v1/posts
    post new post
- put /api/v1/posts/:id
    put post by id
- delete /api/v1/posts/:id
    delete post by id

## comments
- get /api/v1/comments
    get all comments 
- get /api/v1/posts/:postId/comments
    get all comments for a post
- get /api/v1/comments/:id
    get comment by id
- post /api/v1/posts/:postId/comments
    post new comment
- put /api/v1/comments/:id
    put comment by id
- delete /api/v1/comments/:id
    delete comment by id

