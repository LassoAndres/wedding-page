"use strict";

const http_status = require('http-constants').codes;
const {setGuestInSession, isGuestInSession, getGuestFromSession} = require("../common/Session");
const {validateConfirmationFormBody} = require("../validators/GuestValidator");
const {Guest} = require("../model/Guest");

class GuestController {
    #guestService;

    constructor(guestService) {
        this.#guestService = guestService
    }

     async verifyToken(req , res) {
        let token = req.params.token
         if (token === null || token === "") {
             return res.status(http_status.BAD_REQUEST).send();
         }
         token = token.toLowerCase()

        let guest = await this.#guestService.validateGuestToken(token)
        if (guest === null) {
            res.send({isAuthenticated: false})
        } else {
            setGuestInSession(req, guest)
            res.send({isAuthenticated: true})
        }
    }

    async submitConfirmationFrom(req, res) {
        validateConfirmationFormBody(req)
        if (!isGuestInSession(req)) {
            return res.status(http_status.UNAUTHORIZED).send();
        }
        let token = req.params.token.toLowerCase();
        if (getGuestFromSession(req).token !== token) {
            return res.status(http_status.FORBIDDEN).send();
        }
        let guestRequest = Guest.from(req.body);
        await this.#guestService.confirmationForm(token, guestRequest)
        res.send(guestRequest)
    }

}

module.exports = GuestController;