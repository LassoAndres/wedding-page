const express = require('express')
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const uuid = require('uuid');
const next = require('next')
const routes = require('./server/routes/routes')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()


app.prepare().then(() => {
    const server = express()

    // creating 24 hours from milliseconds
    const oneDay = 1000 * 60 * 60 * 24;
    //session middleware
    server.use(sessions({
        name: "guest_identification",
        secret: uuid.v1(),
        saveUninitialized:true,
        cookie: { maxAge: oneDay * 30 },
        resave: false
    }));

    // cookie parser middleware
    server.use(cookieParser());

    // Server routes
    server.use('/api', routes)

    // Client side
    server.all('*', (req, res) => {
        return handle(req, res)
    })

    server.listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`)
    })
})
