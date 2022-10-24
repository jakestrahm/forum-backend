const path = require('path')
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan')
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db')
const cors = require('cors');
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser')

//load env vars
dotenv.config({ path: './config/config.env' });

//connect to database
connectDB();


//route files 
const users = require('./routes/users')
const posts = require('./routes/posts')
const comments = require('./routes/comments');
const auth = require('./routes/auth');

//set port value
const PORT = process.env.PORT || 6006;

//create express application
const app = express();

//configuring cors 
const corsOpts = {
    origin: 'http://localhost:3000', //allow frontend
    credentials: true,
    optionSuccessStatus: 200
}
//use cors options 
app.use(cors(corsOpts));

//body parser
app.use(express.json());

//cookie parser 
app.use(cookieParser())

//dev-env logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//file uploading
app.use(fileUpload())

//set static folder 
app.use(express.static(path.join(__dirname, 'public')))
// mount routers
app.use('/api/v1/users', users)
app.use('/api/v1/posts', posts)
app.use('/api/v1/comments', comments)
app.use('/api/v1/auth', auth)

//error handiling middleware
/* this has to be after the controller methods if i want to use this on them
    as middleware is executed in a linear order*/
app.use(errorHandler)


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
    * TODO auth
    * TODO aggregiation pipelines
    * TODO figure out hosting
**/

