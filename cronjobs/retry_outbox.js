const EmailService = require('../services/email_service')
const { minutesToCronExpression } = require('./minutesToCronExpression')
const CONFIG = require('../config')
const cron = require('node-cron')

function setOutboxRetryJob() {
    console.log('Retry outbox mails cron job being set')
    cron.schedule(minutesToCronExpression(CONFIG.RETRY_MAIL_OUTBOX_INTERVAL), (new EmailService).retryOutboxMails)
}

module.exports = setOutboxRetryJob