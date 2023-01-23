"use strict";

const ApiException = require("./ApiException")

function routeHandler(fn) {
    return async (req, res, next) => {
        try {
            return await fn(req, res)
        } catch (e) {
            next(e)
        }
    };
}

function errorHandler(err, req, res, next) {
    if (err instanceof ApiException) {
        if (!err.isExpected) {
            console.log("Handling error:", err, ", request.params:", req.params, ", request.body", req.body)
        }
        res.status(err.status).send(err)
    } else {
        console.log("Handling error:", err, ", request.params:", req.params, ", request.body", req.body)
        res.status(500).send({status:500, code: "internal_server_error", message: "Internal server error"})
    }
}

module.exports = {
    routeHandler,
    errorHandler
}