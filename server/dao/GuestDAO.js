const {Guest} = require("../model/Guest");
const {json} = require("express");

class GuestDAO {
    #dbConnection;

    constructor(dbConnection) {
        this.#dbConnection = dbConnection
    }

    async getByToken(token) {
        return this.#dbConnection.getConnection()
            .oneOrNone('SELECT * FROM guests WHERE token = $1 LIMIT 1', token)
    }

    async getGuestsWithInvitationNotSend() {
        return this.#dbConnection.getConnection()
            .query("SELECT * FROM guests WHERE status = 'NOT_SEND'")
    }

    async setSentStatus(token) {
        await this.#dbConnection.getConnection()
            .none("UPDATE guests SET status = 'SENT' WHERE token = $1", token)
    }

    async setNotComingStatus(token) {
        await this.#dbConnection.getConnection()
            .none("UPDATE guests SET status = 'NOT_COMING' WHERE token = $1", token)
    }

    async setComingData(token, comingData) {
        comingData.token = token
        let fieldsToSet = ""
        fieldsToSet += ", meal_type = ${meal_type}"
        fieldsToSet += ", celiac = ${celiac}"
        fieldsToSet += ", allergic = ${allergic}"
        fieldsToSet += ", allergy_comment = ${allergy_comment}"

        if (comingData.has_children) {
            fieldsToSet += ", children = ${children:value}"
        }

        if (comingData.has_plus_one) {
            fieldsToSet += ", with_plus_one = ${with_plus_one}"
            if (comingData.with_plus_one) {
                fieldsToSet += ", plus_one_full_name = ${plus_one_full_name}"
                fieldsToSet += ", plus_one_meal_type = ${plus_one_meal_type}"
                fieldsToSet += ", plus_one_celiac = ${plus_one_celiac}"
                fieldsToSet += ", plus_one_allergic = ${plus_one_allergic}"
                fieldsToSet += ", plus_one_allergy_comment = ${plus_one_allergy_comment}"
            }
        }

        await this.#dbConnection.getConnection()
            .none("UPDATE guests SET status = 'COMING'"+fieldsToSet+" WHERE token = ${token}", comingData)
    }
}

module.exports = GuestDAO

