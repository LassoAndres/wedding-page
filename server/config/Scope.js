
class Scope {
    static isProdScope() {
        return process.env.NODE_ENV === 'heroku'
    }
}

module.exports = Scope