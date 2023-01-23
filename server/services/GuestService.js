"use strict";

const {GuestStatus} = require("../model/Guest");

class GuestService {
    #guestDAO;

    constructor(guestDAO) {
        this.#guestDAO = guestDAO
    }

    async validateGuestToken(token) {
        return await this.#guestDAO.getByToken(token)
    }

    async confirmationForm(token, formData) {
        if (formData.status === GuestStatus.NOT_COMING) {
            await this.#guestDAO.setNotComingStatus(token)
            return
        }
        let guest = await this.#guestDAO.getByToken(token);
        let comingData = {
            meal_type: formData.meal_type,
            celiac: formData.celiac,
            allergic: formData.allergic,
            allergy_comment: formData.allergy_comment,
            has_children: guest.has_children,
            has_plus_one: guest.has_plus_one
        }
        if (guest.has_children) {
            comingData.children = formData.children
        }

        if (guest.has_plus_one) {
            comingData.with_plus_one = formData.with_plus_one
            if (formData.with_plus_one) {
                comingData.plus_one_full_name = formData.plus_one_full_name
                comingData.plus_one_meal_type = formData.plus_one_meal_type
                comingData.plus_one_celiac = formData.plus_one_celiac
                comingData.plus_one_allergic = formData.plus_one_allergic
                comingData.plus_one_allergy_comment = formData.plus_one_allergy_comment
            }
        }

        await this.#guestDAO.setComingData(token, comingData)
    }

}

module.exports = GuestService

