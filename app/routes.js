    module.exports = (app) => {
    	console.log("><routes app", app);
        app.get('/', (req, res) => res.render('index.ejs'))
        app.post('/', (req, res) => {
        	req.session.username = req.body.username
        	// console.log("><req.body", req.body.username)
            // TODO: Save username to req.session.username
            res.redirect('/chat')
        })

        app.get('/chat', (req, res) => {
            let username = req.session.username
            let state = JSON.stringify({
                username
            })
            console.log(">< get chat user name", username)
            res.render('chat.ejs', {
                username, state
            })
        })
    }
