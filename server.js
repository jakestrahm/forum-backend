const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan')
const connectDB = require('./config/db')

//load env vars
dotenv.config({ path: './config/config.env' });

//connect to database
connectDB();

//route files 
const users = require('./routes/users')
const posts = require('./routes/posts')
const comments = require('./routes/comments')

//set port value
const PORT = process.env.PORT || 6006;

//create express application
const app = express();

//body parser
app.use(express.json());

//dev-env logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// mount routers
app.use('/api/v1/users', users)
app.use('/api/v1/posts', posts)
app.use('/api/v1/comments', comments)

// listen for requests
const server = app.listen(PORT, console.log(`server running in ${process} listening on ${PORT}`));

//hand unhandled promise rejections 
process.on('unhandledRejection', (err, promise) => {
    console.log(`error: ${err.message}`);

    //close server and exit process
    server.close(() => process.exit(1));
})

/**
    * TODO comment everything for them to understand
    * TODO cascade delete? or do i want to store comments of deleted posts?  once a post is deleted, so should all comments that have that post id? well reddit still has it on their profile and when you click post it says it's deleted.
    * TODO allow users to delete their own posts? comments? must be authorized
- auth
- use aggregiation pipelines
**/

