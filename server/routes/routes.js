const express = require('express')
const router = express.Router()
const DependencyManager = require('../dependency_injection/DependencyManager')
const {routeHandler, errorHandler} = require("../common/Handlers")

let guestController = DependencyManager.GuestController()

router.use(express.json()) //http://expressjs.com/en/api.html#express.json
router.use(express.urlencoded({ extended: false })) //http://expressjs.com/en/5x/api.html#express.urlencoded

router
    .get('/ping', (req, res, next) => {
        res.send('pong')
    })
    .get('/guest/validate-token/:token', routeHandler((r, s) => guestController.verifyToken(r, s)))
    .post('/guest/confirmation/:token', routeHandler((r, s) => guestController.submitConfirmationFrom(r, s)))

router.use(errorHandler);

module.exports = router