const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');

const app = express();

//load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//Passport Config
require('./config/passport')(passport);

//DB config
const db = require('./config/database');

//Map global promise-get rid of warning
mongoose.Promise = global.Promise

//connect to mongoose
mongoose.connect(db.mongoURI, {
    useNewUrlParser: true   //{useMongoClient : true} is deprecated in mongoose5 
})
    .then(() => console.log('MongoDB connected..'))
    .catch(err => console.log(err));



//Handlebars middleware 
app.engine('handlebars', exphbs({    //lines from the site
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));  //from the express body-parser site
app.use(bodyParser.json());       //from the express body-parser site

//Static folder
app.use(express.static(path.join(__dirname, 'public')));

//method-override middleware
app.use(methodOverride('_method'));

//express-session middleware
app.use(session({
    secret: 'secret', //we can take anything for secret
    resave: true,
    saveUninitialized: true,
}));

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//Global variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

//Index Route
app.get('/', (req, res) => {
    const title = 'Welcome';
    res.render('index', {
        title: title
    });
});

//About Route
app.get('/about', (req, res) => {
    res.render('about');
});

//Use routes
app.use('/ideas', ideas);  //ideas=> ideas.js
app.use('/users', users);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);//way in ES6
});

