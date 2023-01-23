"use strict";

const http_status = require('http-constants').codes;
const ApiException = require("../common/ApiException")
const {MealType, GuestStatus} = require("../model/Guest")

function validateConfirmationFormBody(req) {
    if (!req.params.token) {
        throw new ApiException("invalid_token", "token must be present", http_status.BAD_REQUEST, true)
    }

    let guest = req.body;
    let possibleStatus = [GuestStatus.COMING, GuestStatus.NOT_COMING];
    if (!(guest.hasOwnProperty("status") && possibleStatus.includes(guest.status))) {
        throw new ApiException("invalid_status", "status must be one of " + possibleStatus, http_status.BAD_REQUEST, true)
    }
    if (guest.status === GuestStatus.NOT_COMING) {
        return //Nothing to check when is not coming status
    }
    let possibleMealTypes = [MealType.carnivorous, MealType.vegetarian, MealType.vegan];
    if (!(guest.hasOwnProperty("meal_type") && possibleMealTypes.includes(guest.meal_type))) {
        throw new ApiException("invalid_meal_type", "meal_type must be one of " + possibleMealTypes, http_status.BAD_REQUEST, true)
    }
    if (!guest.hasOwnProperty("celiac")) {
        throw new ApiException("invalid_celiac", "celiac must be present", http_status.BAD_REQUEST, true)
    }
    if (!guest.hasOwnProperty("allergic")) {
        throw new ApiException("invalid_allergic", "allergic must be present", http_status.BAD_REQUEST, true)
    }

    if (guest.has_children) {
        if (!guest.hasOwnProperty("children") || guest.children < 0 || guest.children > 4) {
            throw new ApiException("invalid_children", "children must be between 0 and 4 ", http_status.BAD_REQUEST, true)
        }
    }

    if (guest.has_plus_one && guest.with_plus_one) {
        if (!guest.hasOwnProperty("plus_one_full_name")) {
            throw new ApiException("invalid_plus_one_full_name", "plus_one_full_name must be present", http_status.BAD_REQUEST, true)
        }
        if (!(guest.hasOwnProperty("plus_one_meal_type") && possibleMealTypes.includes(guest.plus_one_meal_type))) {
            throw new ApiException("invalid_meal_type", "plus_one_meal_type must be one of " + possibleMealTypes, http_status.BAD_REQUEST, true)
        }
        if (!guest.hasOwnProperty("plus_one_celiac")) {
            throw new ApiException("invalid_plus_one_celiac", "plus_one_celiac must be present", http_status.BAD_REQUEST, true)
        }
        if (!guest.hasOwnProperty("plus_one_allergic")) {
            throw new ApiException("invalid_plus_one_allergic", "plus_one_allergic must be present", http_status.BAD_REQUEST, true)
        }
    }
}

module.exports = {
    validateConfirmationFormBody
}