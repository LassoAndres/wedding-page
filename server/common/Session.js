
function setGuestInSession(req, guest) {
    req.session.guest = {
        token: guest.token,
        name: guest.name
    }
}

function isGuestInSession(req) {
    return req.session.guest
}

function getGuestFromSession(req){
    return req.session.guest;
}

module.exports = {
    getGuestFromSession,
    setGuestInSession,
    isGuestInSession
}