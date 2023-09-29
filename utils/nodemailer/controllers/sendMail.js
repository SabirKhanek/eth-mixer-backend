const { mailTransporter } = require('../nodeMailerConfig')
const CONFIG = require('../../../config')
module.exports = async (to, subject, html) => {
    try {
        /**
         * @typedef {import('nodemailer').SendMailOptions}
         */
        const mailOptions = {
            from: CONFIG.SYSTEM_GMAIL,
            to,
            subject,
            html 
        }


        await mailTransporter.sendMail(mailOptions)
    } catch(err) {
        throw new Error(err)
    }
}