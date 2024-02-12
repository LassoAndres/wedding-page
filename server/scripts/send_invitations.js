"use strict";

require('dotenv').config()
const nodemailer = require("nodemailer");
//const prompt = require("prompt-sync")({ sigint: true });
const fs = require('fs');
const handlebars = require('handlebars');

const dependencyManager = require('../dependency_injection/DependencyManager');
const guestDAO = dependencyManager.GuestDAO();

const emailFrom = process.env.EMAIL_FROM;
let mailerTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: emailFrom,
        pass: process.env.EMAIL_FROM_PASSWORD//prompt.hide(`Gmail password for ${emailFrom}:`),
    }
});

function buildTemplate(guest) {
    let template = handlebars.compile(htmlTemplate);
    let replacements = {
        token: guest.token
    };
    return template(replacements);
}

async function sendInvitation(guest) {
    let response = await mailerTransport.sendMail({
        from: '"Sender name" <' + emailFrom + '>',
        to: `"${guest.full_name}" <${guest.email}>`,
        subject: "Wedding invitation - XX & ZZ",
        html: buildTemplate(guest)
    })
    if (response.accepted.length !== 0) {
        console.log(`Email sent: ${response.accepted.join(",")}`)
    } else {
        console.log(`Email not sent: ${guest.email}`)
    }
    if (response.rejected.length !== 0) {
        console.log(`Email not sent: ${response.rejected.join(",")}`)
    }
}


/**
 * Start of scripting
 */

let htmlTemplate;
fs.readFile('./template_email.html', async function read(err, data) {
    if (err) {
        throw err;
    }
    htmlTemplate = data.toString();
    await main();
});

async function main() {
    await mailerTransport.verify();
    let guestsWithInvitationNotSent = await guestDAO.getGuestsWithInvitationNotSend();
    for (const guest of guestsWithInvitationNotSent) {
        try {
            await sendInvitation(guest)
            await guestDAO.setSentStatus(guest.token)
        } catch (e) {
            console.log("Falló envío o guardado del invitado:", guest)
            throw e
        }
    }
}