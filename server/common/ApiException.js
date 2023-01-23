
class ApiException {
    status;
    error;
    message;
    #expected;

    constructor(error, message, status, expected = false) {
        this.error = error
        this.message = message
        this.status = status
        this.#expected = expected
    }

    get isExpected() {
        return this.#expected;
    }
}

module.exports = ApiException