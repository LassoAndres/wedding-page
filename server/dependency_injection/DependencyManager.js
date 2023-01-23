
const EnvDependencies = require('./EnvDependencies')
const GuestDAO = require("../dao/GuestDAO");
const GuestService = require("../services/GuestService");
const GuestController = require("../controllers/GuestController");
const DbConnection = require("../config/DB");

class DependencyManager extends EnvDependencies {
    DatabaseConnection = this.bind("DatabaseConnection", () => new DbConnection(process.env.DATABASE_URL))
    GuestController = this.bind("GuestController", () => new GuestController(this.GuestService()))
    GuestService = this.bind("GuestService", () => new GuestService(this.GuestDAO()))
    GuestDAO = this.bind("GuestDAO", () => new GuestDAO(this.DatabaseConnection()))
}

module.exports = new DependencyManager()