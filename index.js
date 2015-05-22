let mongoose = require('mongoose')
let requireDir = require('require-dir')
let flash = require('connect-flash')

const NODE_ENV = process.env.NODE_ENV || 'development'
let App = require('./app/app')

// let app = express()
let config = requireDir('./config', {
    recurse: true
})
let port = process.env.PORT || 8000


let app = new App(config, port)

app.config = {
    database: config.database[NODE_ENV]
}
app.initialize(port)
    .then(() => console.log(`Listening @ http://127.0.0.1:${port}`))
// ALWAYS REMEMBER TO CATCH!
.catch(e => console.log(e.stack ? e.stack : e))




// start server
// app.listen(port, () => console.log(`Listening @ http://127.0.0.1:${port}`))