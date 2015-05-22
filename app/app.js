let path = require('path')
var browserify = require('browserify-middleware');
let express = require('express')
let morgan = require('morgan')
let session = require('express-session')
let MongoStore = require('connect-mongo')(session)
let cookieParser = require('cookie-parser')
let bodyParser = require('body-parser')
let routes = require('./routes')
let Server = require('http').Server
let io = require('socket.io')
require('songbird')

// app/app.js
class App {
    constructor(config, port) {
        let app = this.app = express()
        this.port = port || 8000 //process.env.PORT || 8000
        // connect to the database
        // mongoose.connect(app.config.database.url)

        // set up our express middleware
        app.use(morgan('dev')) // log every request to the console
        app.use(cookieParser('ilovethenodejs')) // read cookies (needed for auth)
        app.use(bodyParser.json()) // get information from html forms
        app.use(bodyParser.urlencoded({
            extended: true
        }))


        app.set('views', path.join(__dirname, 'views'))
        app.set('view engine', 'ejs') // set up ejs for templating
        this.sessionMiddleware = session({
            secret: 'ilovethenodejs',
            store: new MongoStore({
                db: 'social-chat'
            }),
            resave: true,
            saveUninitialized: true
        })


        // required for passport
        app.use(this.sessionMiddleware)

        // Just pass app to routes
        routes(this.app)

        browserify.settings({
            transform: ['babelify']
        })
        app.use('/js/index.js', browserify('./public/js/index.js'))

        this.server = Server(app)
        this.io = io(this.server)

        this.io.use((socket, next) => {
            this.sessionMiddleware(socket.request, socket.request.res, next)
        })

        // And add some connection listeners:
        this.io.on('connection', socket => {
            // console.log('a user connected')
            let username = socket.request.session.username
            console.log("><  socket.request.session",  socket.request.session)
            socket.on('im', msg => {
                // im received
                console.log(">< username", username)
                console.log(msg)
                // echo im back
                this.io.emit('im', {
                    username, msg
                })
            })
            socket.on('disconnect', () => console.log('user disconnected'))
        })

    }

    async initialize() {
        console.log(">< this.server", this.server)
        await this.server.promise.listen(this.port)
        // Return this to allow chaining
        return this
    }
}
module.exports = App