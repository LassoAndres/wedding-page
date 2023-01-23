const pgp = require("pg-promise")({
    schema: 'wedding'
});
const {ConnectionString} = require('connection-string');

class DbConnection {
    #database = null

    constructor(dbConnectionString) {
        let connectionString = new ConnectionString(dbConnectionString)
        const connectionConf = {
            host: connectionString.hostname,
            port: connectionString.port,
            database: connectionString.path?.[0],
            user: connectionString.user,
            password: connectionString.password,
            ssl: {
                rejectUnauthorized : false,
            },
            allowExitOnIdle: true,
            max: 10 //connections pools
        };
        this.#database = pgp(connectionConf)
    }

    getConnection() {
        return this.#database
    }
}

module.exports = DbConnection